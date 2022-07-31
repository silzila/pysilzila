from importlib.metadata import metadata
from pyspark.sql import SparkSession
from pyspark.sql.functions import *
from fastapi import HTTPException
import os
import json
import shortuuid

from . import schema


# holds all data frame created in spark
df_holder = {}
# this variable will hold spark engine once initialized
spark = False


# initialize spark engine
async def create_spark_engine() -> bool:
    global spark
    spark = SparkSession.builder.appName("silzila_spark_engine").getOrCreate()
    return True


async def read_csv(file_name, new_file_name: str) -> dict:
    global df_holder
    global spark

    if spark == False:
        await create_spark_engine()
    file_path = os.path.join(os.path.expanduser(
        '~'), '.silzila', new_file_name)
    # create data frame and sql view
    if not df_holder.get(new_file_name):
        df_holder[new_file_name] = spark.read.format('csv').options(
            header='true', inferSchema='true').load(file_path)

        # df_holder[f"{new_file_name}_"] = f"{new_file_name}_"
        # print("sql view name =======", df_holder[f"{new_file_name}_"])

        df_holder[new_file_name].createOrReplaceTempView(
            f"{new_file_name}_")
        # query = f"select * from {new_file_name}_ LIMIT 2"
        # print("query ==============", query)
        # spark.sql(query).show()
        # df_holder[new_file_name].printSchema()

    records = df_holder[new_file_name].limit(100).toJSON().collect()
    records_json = list(map(lambda x: json.loads(x), records))
    meta_cols = list(map(lambda x: dict(
        zip(['column_name', 'data_type'],  list(x))), df_holder[new_file_name].dtypes))

    # convert Spark specific data types into Silzila data types
    for col in meta_cols:
        if col['data_type'] in ('int', 'integer'):
            col['data_type'] = 'integer'
        elif col['data_type'] == 'boolean':
            col['data_type'] = 'boolean'
        elif col['data_type'] in ('double', 'decimal'):
            col['data_type'] = 'decimal'
        elif col['data_type'] == 'datedate':
            col['data_type'] = 'date'
        elif col['data_type'] == 'timestamp':
            col['data_type'] = 'timestamp'
        elif col['data_type'] == 'string':
            col['data_type'] = 'text'
        else:
            # col['data_type'] = 'unsupported'
            col['data_type']
    return {'file_id': new_file_name, 'table_name': file_name, 'meta_data': meta_cols, 'sample_records': records_json}


async def edit_table(meta_info: schema.EditTableSchema):
    print("inside edit table function**********")
    global df_holder
    global spark
    df_holder[meta_info.file_id].show(2)
    if not df_holder.get(meta_info.file_id):
        raise HTTPException(
            status_code=500, detail="Data File is not loaded")
    _cols = []
    for col in meta_info.meta_cols:
        print("looping====")
        field_string = ""

        # data type changing
        if col.new_data_type and col.data_type != col.new_data_type:
            if col.new_data_type == 'text':
                col.new_data_type = 'string'
            if col.new_data_type in ('integer', 'string', 'boolean') or \
                    (col.new_data_type in ('date' 'timestamp') and not col.column_format):
                field_string = f"cast(`{col.column_name}` as {col.new_data_type})"
            elif col.new_data_type == 'decimal' and col.decimal_place:
                field_string = f"cast(`{col.column_name}` as DECIMAL({col.decimal_place[0] + col.decimal_place[1]}, {col.decimal_place[1]}))"

            elif col.new_data_type in ('date' 'timestamp') and col.column_format:
                field_string = f"to_{col.new_data_type}(`{col.column_name}`, '{col.column_format}')"
        else:
            field_string = f"`{col.column_name}`"

        # column renaming
        field_string2 = ""
        if col.new_column_name:
            field_string2 = f"{field_string} `{col.new_column_name}`"
        # renaming is necessary for to_date & to_timestamp functions,
        # supply original column name when new column name is not availablle
        elif col.new_data_type in ('date', 'timestamp') and col.column_format:
            field_string2 = f"{field_string} `{col.column_name}`"
        else:
            field_string2 = field_string
        _cols.append(field_string2)

    cols_string = ", ".join(_cols)
    print("cols_string ========== ", cols_string)
    # sql_view_name = f"{meta_info.file_id}_"
    df_holder[meta_info.file_id] = spark.sql(
        f"select {cols_string} from {meta_info.file_id}_")

    parquet_file_name = shortuuid.ShortUUID().random(length=12)
    parquet_file_full_path = os.path.join(os.path.expanduser(
        '~'), '.silzila', f"{parquet_file_name}.parquet")
    df_holder[meta_info.file_id].write.parquet(parquet_file_full_path)
    df_holder[meta_info.file_id].show(2)
    # df_holder[meta_info.file_id].createOrReplaceTempView(
    #     f"{meta_info.file_id}_")
    # spark.sql(f"select * from {meta_info.file_id}_").show(2)
    # df_holder[sql_view_name
    #           ] = df_holder[meta_info.file_id].selectExpr(cols_string)

    records = df_holder[meta_info.file_id].limit(100).toJSON().collect()
    records_json = list(map(lambda x: json.loads(x), records))
    meta_cols = list(map(lambda x: dict(
        zip(['column_name', 'data_type'],  list(x))), df_holder[meta_info.file_id].dtypes))

    # delete user uploaded file as it is saved as parquet file
    uploaded_file_path = os.path.join(os.path.expanduser(
        '~'), '.silzila', meta_info.file_id)
    os.remove(uploaded_file_path)

    # remove decimal precision from decimal data type. eg., decimal(10,2) to decimal
    for col in meta_cols:
        if 'decimal' in col['data_type']:
            col['data_type'] = 'decimal'

    return {'file_id': meta_info.file_id, 'table_id': parquet_file_name, 'table_name': meta_info.table_name, 'meta_cols': meta_cols, 'sample_records': records_json}
