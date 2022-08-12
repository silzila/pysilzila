from importlib.metadata import metadata
from xml.etree.ElementInclude import include
from pyspark.sql import SparkSession
from pyspark.sql.functions import *
from fastapi import HTTPException
import os
import json
import shortuuid

from silzila.data_set.schema import DataSetOut

from . import schema


# holds all data frame created in spark
df_holder = {}
# this variable will hold spark engine once initialized
spark = False


# initialize spark engine
async def create_spark_engine() -> bool:
    global spark
    if spark == False:
        spark = SparkSession.builder.appName(
            "silzila_spark_engine").getOrCreate()
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
            header='true', inferSchema='true', samplingRatio=0.2).load(file_path).limit(100)

        # df_holder[f"{new_file_name}_"] = f"{new_file_name}_"
        # print("sql view name =======", df_holder[f"{new_file_name}_"])

        # df_holder[new_file_name].createOrReplaceTempView(
        #     f"{new_file_name}_")
        # query = f"select * from {new_file_name}_ LIMIT 2"
        # print("query ==============", query)
        # spark.sql(query).show()
        # df_holder[new_file_name].printSchema()

    records = df_holder[new_file_name].toJSON().collect()
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
    # df_holder[new_file_name].unpersist()
    return {'file_id': new_file_name, 'table_name': file_name, 'meta_cols': meta_cols, 'sample_records': records_json}


def stitch_metadata_for_dataframe(columns: schema.Column) -> str:
    _cols = []
    for col in columns:
        # renaming user friendly text data type to Spark specific data type
        if col.data_type == 'text':
            col.data_type = 'string'
        # for decimal, need to add precision
        if col.data_type == 'decimal':
            _field = f"`{col.column_name}` DECIMAL({col.decimal_place[0]+col.decimal_place[1]}, {col.decimal_place[1]})"
        else:
            _field = f"`{col.column_name}` {col.data_type}"
        _cols.append(_field)
    # combine all field name & data types into one string
    cols_string = ", ".join(_cols)
    return cols_string


async def edit_table(meta_info: schema.EditTableSchema, user_uid: str):
    print("inside edit table function**********")
    global df_holder
    global spark

    if spark == False:
        await create_spark_engine()

    if not df_holder.get(user_uid):
        df_holder[user_uid] = {}
    if not df_holder[user_uid].get('tables'):
        df_holder[user_uid]['tables'] = {}

    date_format = meta_info.date_format if meta_info.date_format else "MM/dd/yyyy"
    timestamp_format = meta_info.timestamp_format if meta_info.timestamp_format else "yyyy-MM-dd HH:mm:ss[.SSS]"
    timestamp_with_timezone_format = meta_info.timestamp_with_timezone_format if meta_info.timestamp_with_timezone_format else "yyyy-MM-dd'T'HH:mm:ss[.SSS][XXX]"

    # build schema for dataframe
    _cols = []
    for col in meta_info.meta_cols:
        _col = ""
        if col.include == True:
            _col += f"`{col.new_column_name}`" if col.new_column_name else f"`{col.column_name}`"
            if col.data_type == 'text':
                _data_type = 'string'
            elif col.data_type == 'decimal':
                if col.decimal_place:
                    _data_type = f"decimal({col.decimal_place[0]}, {col.decimal_place[1]})"
                else:
                    _data_type = "decimal"
            else:
                _data_type = col.data_type
            _col += f" {_data_type}"
        else:
            _col = f"`{col.column_name}` boolean"
        _cols.append(_col)
    schema_string = ", ".join(_cols)

    # create data frame and sql view
    df_holder[user_uid]['tables'][meta_info.file_id] = spark.read.format('csv').options(
        header='true', samplingRatio=0.2, dateFormat=date_format, timestampFormat=timestamp_with_timezone_format,  timestampNTZFormat=timestamp_format).schema(schema_string).load("/home/balu/Desktop/pyspark_different_datatypes.csv").limit(10)

    # if data type is changed then read csv again with newly supplied schema,
    # else use previously opened data frame
    flag_read_csv_again = False
    for col in meta_info.meta_cols:
        if col.new_data_type or col.column_format:
            flag_read_csv_again = True
    if flag_read_csv_again == True:
        # 1. first delete previously opened data frame
        if df_holder.get(meta_info.file_id):
            df_holder[meta_info.file_id].unpersist()
        file_path = os.path.join(os.path.expanduser(
            '~'), '.silzila', meta_info.file_id)

    # df_holder[meta_info.file_id].show(2)
    if not df_holder.get(meta_info.file_id):
        raise HTTPException(
            status_code=500, detail="Data File is not loaded")
    _cols = []
    for col in meta_info.meta_cols:
        print("looping====")
        field_string = ""

        # data type changing
        if col.new_data_type:
            if col.new_data_type == 'text':
                col.new_data_type = 'string'
            if col.new_data_type in ('integer', 'string', 'boolean') or \
                    (col.new_data_type in ('date' 'timestamp') and not col.column_format):
                field_string = f"cast(`{col.column_name}` as {col.new_data_type})"
            elif col.new_data_type == 'decimal' and col.decimal_place:
                print("trying to cast to decimal *********")
                field_string = f"cast(`{col.column_name}` as DECIMAL({col.decimal_place[0] + col.decimal_place[1]}, {col.decimal_place[1]}))"
            elif col.new_data_type in ('date' 'timestamp') and col.column_format:
                field_string = f"to_{col.new_data_type}(`{col.column_name}`, '{col.column_format}')"
        else:
            field_string = f"`{col.column_name}`"
        print("data type changing is done *********")
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
        print("field renaming is done *********")
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


async def load_ds_tables_in_spark(table_list):
    pass


# checks if data set is loaded in-memory
# in-momory loaded data set (tables & relationships) help reduce time
# for query building process while user interacts with data
async def is_fd_ds_active(ds_uid: str, user_uid: str) -> bool:
    global df_holder
    if not df_holder.get(ds_uid):
        df_holder[ds_uid] = {}
    if df_holder.get(dc_uid) and df_holder.get(dc_uid).get('data_schema') and \
            df_holder.get(dc_uid).get('data_schema').get(ds_uid):
        return True
    else:
        return False


async def get_file_data_schema(ds_uid: str):
    global df_holder


# create Data Frame in Spark for the file data for querying:
async def create_spark_df(ds: DataSetOut, user_uid: str):
    global df_holder
    if not df_holder.get(user_uid):
        df_holder[user_uid] = {}
    if not df_holder[user_uid].get('tables'):
        df_holder[user_uid]['tables'] = {}
    for table in ds.data_schema.tables:
        if not df_holder[user_uid]['tables'].get(table.table_name):
            try:
                file_path = os.path.join(os.path.expanduser(
                    '~'), '.silzila', f"{table.file_data_id}.parquet")
                df_holder[user_uid]['tables'][table.file_data_id] = spark.read.format(
                    'parquet').options(header='true', inferSchema='true').load(file_path)
                df_holder[user_uid]['tables'][table.file_data_id].createOrReplaceTempView(
                    f"{table.file_data_id}_{table.table_name}")
                spark.sql(
                    f"SELECT * FROM {table.file_data_id}_{table.table_name} LIMIT 2").show()
            except Exception as err:
                print(err)
                raise HTTPException(
                    status_code=500, detail=err)
    return True
