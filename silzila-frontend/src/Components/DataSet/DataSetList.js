import { VisibilitySharp } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
	resetState,
	setArrows,
	setConnectionValue,
	setDataSchema,
	setDsId,
	setFriendlyName,
	setRelationship,
	setTempTables,
	setUserTable,
} from "../../redux/Dataset/datasetActions";
import FetchData from "../../ServerCall/FetchData";
import { findShowHeadAndshowTail } from "../CommonFunctions/FindIntegrityAndCordinality";
import { SelectListItem } from "../CommonFunctions/SelectListItem";
import DeleteIcon from "@mui/icons-material/Delete";
import { NotificationDialog } from "../CommonFunctions/DialogComponents";

const DataSetList = ({
	//state
	token,
	stateSchema,

	// dispatch
	resetState,
	setConnectionValue,
	setDataSchema,
	setUserTable,
	setTempTables,
	setArrows,
	setRelationship,
	setFriendlyName,
	setDsId,
}) => {
	var navigate = useNavigate();

	const [dataSetList, setDataSetList] = useState([]);
	const [openAlert, setOpenAlert] = useState(false);
	const [testMessage, setTestMessage] = useState("");
	const [severity, setSeverity] = useState("success");
	useEffect(() => {
		resetState();
		getInformation();

		// eslint-disable-next-line
	}, []);

	const editDs = async (dsuid) => {
		var result = await FetchData({
			requestType: "noData",
			method: "GET",
			url: "ds/get-ds/" + dsuid,
			headers: { Authorization: `Bearer ${token}` },
		});
		if (result.status) {
			console.log(result.data);
			let res = result.data;
			const schemaNames = res.data_schema.tables.map((el) => {
				return el.schema_name;
			});
			let uniqueSchema = [...new Set(schemaNames)];
			console.log(uniqueSchema);
			let schema = res.data_schema.tables[0].schema_name;
			setConnectionValue(res.dc_uid);
			setDsId(dsuid);
			setDataSchema(schema);
			setFriendlyName(res.friendly_name);
			setRelationship(res.data_schema.relationships);
			console.log(res.data_schema.relationships);
			getTables(res.dc_uid, schema, res.data_schema.tables);
			const arr = res.data_schema.relationships.map((el) => {
				var showHeadAndshowTail = findShowHeadAndshowTail(el.cardinality);
				if (el.table1_columns.length !== 1) {
					let len = el.table1_columns.length;
					let i = 0;
					var obj = {
						table1_uid: schema.concat(el.table1),
						table2_uid: schema.concat(el.table2),
						isSelected: false,
						startTableName: el.table1,
						start: el.table1.concat(el.table1_columns[i]),
						endTableName: el.table2,
						end: el.table2.concat(el.table2_columns[i]),
						integrity: el.ref_integrity,
						startColumnName: el.table1_columns[i],
						endColumnName: el.table2_columns[i],
						cardinality: el.cardinality,
						showHead: showHeadAndshowTail.showHead,
						showTail: showHeadAndshowTail.showTail,
					};
					while (i <= len) {
						i++;
						return {
							...obj,
							isSelected: true,
						};
					}
				} else {
					return {
						...obj,
						isSelected: false,
					};
				}
			});
			console.log(arr, "arrows");
			setArrows(arr);
		}
		setTimeout(() => {
			navigate("/editdataset");
		}, 1000);
	};

	const getInformation = async () => {
		var result = await FetchData({
			requestType: "noData",
			method: "GET",
			url: "ds/get-all-ds",
			headers: { Authorization: `Bearer ${token}` },
		});

		if (result.status) {
			setDataSetList(result.data);
		} else {
			console.log(result.data.detail);
		}
	};

	const getTables = async (connection, schema, tables) => {
		var res = await FetchData({
			requestType: "noData",
			method: "GET",
			url: `dc/tables/${connection}/${schema}`,
			headers: { Authorization: `Bearer ${token}` },
			token: token,
		});
		if (res.status) {
			console.log(res.data, "tablesList");
			const userTable = res.data.map((el) => {
				var tableAlready_Checked = tables.filter(
					//have to make changes in  schema
					(tbl) => tbl.schema_name === schema && tbl.table_name === el
				)[0];
				if (tableAlready_Checked) {
					return {
						tableName: el,
						isSelected: true,
						table_uid: schema.concat(el),
						// uid: tbl.id,
					};
				}
				return {
					tableName: el,
					isSelected: false,
					table_uid: schema.concat(el),
					// uid: tbl.id,
				};
			});
			const x = userTable.filter((el) => {
				return el.isSelected === true;
			});
			const canvasTables = await Promise.all(
				x.map(async (el) => {
					return {
						table_uid: el.table_uid,
						schema: schema,
						dcId: connection,
						columns: await getColumns(connection, schema, el.tableName),
						tableName: el.tableName,
						alias: el.tableName,
						isSelected: el.isSelected,
					};
				})
			);
			console.log(canvasTables);
			console.log(userTable);
			setUserTable(userTable);
			setTempTables(canvasTables);
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
				// TODO  tableName.concat(data.column_name).concat(schema)
				return { uid: tableName.concat(data.column_name), ...data };
			});
			return arrayWithUid;
		} else {
			console.log(result.detail);
		}
	};

	const deleteDs = async (dsUid) => {
		var result = await FetchData({
			requestType: "noData",
			method: "DELETE",
			url: "ds/delete-ds/" + dsUid,
			headers: { Authorization: `Bearer ${token}` },
		});
		if (result.status) {
			setSeverity("success");
			setOpenAlert(true);
			setTestMessage("Deleted Successfully!");
			setTimeout(() => {
				setOpenAlert(false);
				setTestMessage("");
			}, 2000);
		} else {
			console.log(result.detail);
		}
	};

	return (
		<div className="dataSetContainer">
			<div className="containersHead">
				<div className="containerTitle">Datasets</div>

				{/* TODO: Priority 1:  Reset dataset values (Same from BottomBar.js)  - completed
				Make sure the NewDataSet page doesn't have any old values in state */}
				<input
					className="containerButton"
					type="button"
					value="New"
					onClick={(e) => {
						navigate("/newdataset");
					}}
				/>
			</div>

			<div className="connectionListContainer">
				{dataSetList &&
					dataSetList.map((dc) => {
						return (
							<SelectListItem
								key={dc.friendly_name}
								render={(xprops) => (
									<div
										className="dataConnectionList"
										onMouseOver={() => xprops.setOpen(true)}
										onMouseLeave={() => xprops.setOpen(false)}
									>
										<div className="dataConnectionName">{dc.friendly_name}</div>

										{xprops.open ? (
											// TODO: Priority 1 - Implement edit dataset functionality.
											<Tooltip
												title="View/Edit Dataset"
												arrow
												placement="right-start"
											>
												{/* TODO: This icon must be view / edit icon.  - completed*/}
												{/* changed from ModeEditOutlineTwoTone to Visibilitysharp */}
												<div>
													<VisibilitySharp
														style={{
															width: "1rem",
															height: "1rem",
															margin: "auto",
														}}
														onClick={() => editDs(dc.ds_uid)}
													/>
													<DeleteIcon
														style={{
															width: "1rem",
															height: "1rem",
															margin: "auto",
														}}
														onClick={() => {
															var yes = window.confirm(
																"are you sure you want to Delete thi DS?"
															);
															if (yes) {
																deleteDs(dc.ds_uid);
															}
														}}
													/>
												</div>
											</Tooltip>
										) : null}
									</div>
								)}
							/>
						);
					})}
			</div>

			<NotificationDialog
				openAlert={openAlert}
				severity={severity}
				testMessage={testMessage}
			/>
		</div>
	);
};
const mapDispatchToProps = (dispatch) => {
	return {
		resetState: () => dispatch(resetState()),
		setConnectionValue: (pl) => dispatch(setConnectionValue(pl)),
		setDataSchema: (pl) => dispatch(setDataSchema(pl)),
		setUserTable: (pl) => dispatch(setUserTable(pl)),
		setTempTables: (pl) => dispatch(setTempTables(pl)),
		setArrows: (pl) => dispatch(setArrows(pl)),
		setRelationship: (pl) => dispatch(setRelationship(pl)),
		setFriendlyName: (pl) => dispatch(setFriendlyName(pl)),
		setDsId: (pl) => dispatch(setDsId(pl)),
	};
};
const mapStateToProps = (state) => {
	return {
		token: state.isLogged.accessToken,
		stateSchema: state.dataSetState.schema,
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(DataSetList);
