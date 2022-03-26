import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { setUserTable, setValuesToState } from "../../redux/Dataset/datasetActions";
import FetchData from "../../ServerCall/FetchData";
import Canvas from "./Canvas";
import Sidebar from "./Sidebar";

const EditDataSet = ({
	//state
	token,
	dsId,

	//dispatch
	setValuesToState,
	setUserTable,
}) => {
	const [loadPage, setloadPage] = useState(false);
	const [editMode, seteditMode] = useState(true);
	useEffect(() => {
		setAllInfo();
	}, []);

	const setAllInfo = async () => {
		var res = await FetchData({
			requestType: "noData",
			method: "GET",
			url: "ds/get-ds/" + dsId,
			headers: { Authorization: `Bearer ${token}` },
		});

		if (res.status) {
			console.log(res.data);

			const canvasTables = await Promise.all(
				res.data.data_schema.tables.map(async (tbl) => {
					return {
						table_uid: tbl.schema_name.concat(tbl.table_name),
						tableName: tbl.table_name,
						alias: tbl.alias,
						dcId: res.data.dc_uid,
						schema: tbl.schema_name,
						columns: await getColumns(res.data.dc_uid, tbl.schema_name, tbl.table_name),
						isSelected: true,
					};
				})
			);

			console.log(canvasTables);

			// ======================== set tables & schema ====================================================

			var schema_list = res.data.data_schema.tables.map((el) => {
				return el.schema_name;
			});

			var uniqueSchema = Array.from(new Set(schema_list));
			console.log(uniqueSchema);

			let userTable = [];

			const getTables = async () => {
				var res1 = await FetchData({
					requestType: "noData",
					method: "GET",
					url: `dc/tables/${res.data.dc_uid}/${uniqueSchema[0]}`,
					headers: { Authorization: `Bearer ${token}` },
					token: token,
				});

				if (res1.status) {
					userTable = res1.data.map((el) => {
						var tableAlreadyChecked = canvasTables.filter(
							(tbl) =>
								tbl.dcId === res.data.dc_uid &&
								tbl.schema === uniqueSchema[0] &&
								tbl.tableName === el
						)[0];
						if (tableAlreadyChecked) {
							return {
								tableName: el,
								isSelected: true,
								table_uid: uniqueSchema[0].concat(el),
							};
						}
						return {
							tableName: el,
							isSelected: false,
							table_uid: uniqueSchema[0].concat(el),
						};
					});
					console.log(userTable, "$$$$$$$$$$$$$ user Table $$$$$$$$$$$$$$$");
					setUserTable(userTable);
				} else {
					console.log(res1);
				}
			};

			await getTables();

			// ====================================================================================

			// ============================= set relationships and arrows==========================

			let data = {
				isSelected: false,
				startTableName: "table1",
				endTableName: "table2",
				start: "schema+table1+table1_columns",
				end: "schema+table2+table2_columns",
				table1_uid: "schema+table1",
				table2_uid: "schema+table2",
				startSchema: "schema of table1",
				endSchema: "schema of table2",
				integrity: "integrity",
				cardinality: "cardinality",
				showHead: "find showHead",
				showTail: "find showTail",
				relation_id: "generate uid",
			};

			const rel = res.data.data_schema.relationships.map((r) => {
				return {
					isSelected: false,
					startTableName: r.table1,
					endTableName: r.table2,
					start: "schema+table1+table1_columns",
					end: "schema+table2+table2_columns",
					table1_uid: "schema+table1",
					table2_uid: "schema+table2",
					startSchema: "schema of table1",
					endSchema: "schema of table2",
					integrity: r.integrity,
					cardinality: r.cardinality,
					showHead: "find showHead",
					showTail: "find showTail",
					relation_id: "generate uid",
				};
			});
			// ====================================================================================

			setValuesToState(
				res.data.dc_uid,
				res.data.friendly_name,
				canvasTables,
				uniqueSchema[0]
			);
			setloadPage(true);
		} else {
			console.log(res.data.detail);
		}
	};

	const getColumns = async (connection, schema, tableName) => {
		var result = await FetchData({
			requestType: "noData",
			method: "GET",
			url: "dc/columns/" + connection + "/" + schema + "/" + tableName,
			headers: { Authorization: `Bearer ${token}` },
		});
		if (result.status) {
			console.log(result.data);
			const arrayWithUid = result.data.map((data) => {
				return { uid: schema.concat(tableName).concat(data.column_name), ...data };
			});
			return arrayWithUid;
		} else {
			console.log(result.detail);
		}
	};

	return (
		<div className="createDatasetPage">
			{loadPage ? (
				<>
					<Sidebar editMode={editMode} />
					<Canvas />
				</>
			) : null}
		</div>
	);
};
const mapStateToProps = (state) => {
	return {
		token: state.isLogged.accessToken,
		dsId: state.dataSetState.dsId,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		setValuesToState: (conId, fname, canvasTables, schema) =>
			dispatch(setValuesToState({ conId, fname, canvasTables, schema })),
		setUserTable: (pl) => dispatch(setUserTable(pl)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(EditDataSet);
