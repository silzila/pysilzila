import { Menu, MenuItem, Select, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import ShortUniqueId from "short-unique-id";
import {
	setConnectionValue,
	setDataSchema,
	setUserTable,
} from "../../redux/Dataset/datasetActions";
import FetchData from "../../ServerCall/FetchData";
import { ChangeConnection } from "../CommonFunctions/DialogComponents";
import { SelectListItem } from "../CommonFunctions/SelectListItem";
import TableList from "./TableList";
import "../DataConnection/DataSetup.css";

const Sidebar = ({
	//props
	editMode,

	// state
	token,
	tableList,
	tempTable,
	connectionValue,
	schemaValue,

	// dispatch
	setConnection,
	setDataSchema,
	setUserTable,
}) => {
	const [selectedConnection, setSelectedConnection] = useState("");
	const [connectionList, setConnectionList] = useState([]);
	const [connectionId, setConnectionId] = useState();
	const [schemaList, setSchemaList] = useState([]);
	const [selectedSchema, setSelectedSchema] = useState("");

	const [openDlg, setOpenDlg] = useState(false);
	const [resetDataset, setResetDataset] = useState(false);

	const [dcToResetTo, setDcToResetTo] = useState("");

	const onConnectionChange = (e) => {
		if (tempTable.length > 0) {
			setDcToResetTo(e.target.value);
			setOpenDlg(true);
		} else {
			setSelectedConnection(e.target.value);
			setDataSchema("");
			getSchemaList(e.target.value);
			setSelectedSchema("");
		}
	};

	useEffect(() => {
		console.log(editMode);
		if (editMode) {
			getAllDc();
			// setSelectedConnection(connectionValue);
			// setConnectionId(connectionValue);
			getSchemaList(connectionValue);
			// setSelectedSchema(schemaValue);
		} else {
			getAllDc();
		}
	}, []);

	useEffect(() => {
		if (resetDataset) {
			setSelectedConnection(dcToResetTo);
			getSchemaList(dcToResetTo);
			setSelectedSchema("");
			setDataSchema("");
			setResetDataset(false);
		}
	}, [resetDataset]);

	const getAllDc = async () => {
		var res = await FetchData({
			requestType: "noData",
			method: "GET",
			url: "dc/get-all-dc",
			headers: { Authorization: `Bearer ${token}` },
		});

		if (res.status) {
			setConnectionList(res.data);
			if (editMode) {
				setSelectedConnection(connectionValue);
				setConnectionId(connectionValue);
			}
		} else {
			console.log(res.data.detail);
		}
	};

	const getSchemaList = async (uid) => {
		const dc_uid = uid;
		if (!editMode) {
			setConnectionId(dc_uid);
			setConnection(dc_uid);
			setUserTable([]);
		}

		var res = await FetchData({
			requestType: "noData",
			method: "GET",
			url: `dc/connect-dc/${dc_uid}`,
			headers: { Authorization: `Bearer ${token}` },
			token: token,
		});

		if (res.status) {
			if (res.data.message === "success") {
				var res2 = await FetchData({
					requestType: "noData",
					method: "GET",
					url: `dc/schemas/${dc_uid}`,
					headers: { Authorization: `Bearer ${token}` },
					token: token,
				});

				if (res2.status) {
					setSchemaList(res2.data);
				} else {
					console.log(res2.data.detail);
				}
			}
			if (editMode) {
				setSelectedSchema(schemaValue);
			}
		} else {
			console.log(res.data.detail);
		}
	};

	const getTables = async (e) => {
		const schema = e.target.value;
		setSelectedSchema(schema);
		setDataSchema(schema);

		var res = await FetchData({
			requestType: "noData",
			method: "GET",
			url: `dc/tables/${connectionId}/${schema}`,
			headers: { Authorization: `Bearer ${token}` },
			token: token,
		});

		if (res.status) {
			const uid = new ShortUniqueId({ length: 8 });
			const userTable = res.data.map((el) => {
				var id = "";
				var tableAlreadyChecked = tempTable.filter(
					(tbl) =>
						tbl.dcId === connectionId && tbl.schema === schema && tbl.tableName === el
				)[0];
				tempTable.forEach((tbl) => {
					if (
						tbl.dcId === connectionId &&
						tbl.schema === schema &&
						tbl.tableName === el
					) {
						id = tbl.id;
					}
				});
				if (tableAlreadyChecked) {
					return {
						tableName: el,
						isSelected: true,
						table_uid: schema.concat(el),
						id: id,
					};
				}
				return {
					tableName: el,
					isSelected: false,
					table_uid: schema.concat(el),
					id: uid(),
				};
			});

			setUserTable(userTable);
		} else {
			console.log(res);
		}
	};

	return (
		<div className="sidebar">
			<div className="sidebarHeading">Connection</div>
			<div>
				<Select
					className="selectBar"
					onChange={(e) => {
						onConnectionChange(e);
					}}
					// TODO:(c) Priority 5 - (WARNING) in MUI Select component
					// You have provided an out-of-range value `post` for the select component.
					// Consider providing a value that matches one of the available options or ''.The available values are "".
					value={selectedConnection}
				>
					{/* <MenuItem value="">
						<em>---select connection---</em>
					</MenuItem> */}
					{connectionList &&
						connectionList.map((connection, i) => {
							return (
								<MenuItem
									// TODO menuItem Width have to be decreased and elipsis text when overflow
									sx={{
										// 	fontSize: "14px",
										width: "100px",
										// 	paddingBottom: "4px",
										// 	paddingTop: "4px",
										// 	paddingRight: "8px",
										// 	paddingLeft: "8px",
										// 	textOverflow: "ellipsis",
									}}
									value={connection.dc_uid}
									key={connection.dc_uid}
									title={
										connection.db_name +
										" " +
										"(" +
										connection.friendly_name +
										")"
									}
								>
									{connection.db_name} ({connection.friendly_name})
								</MenuItem>
							);
						})}
				</Select>
			</div>

			<div className="sidebarHeading">Schema</div>
			<div>
				<Select className="selectBar" onChange={(e) => getTables(e)} value={selectedSchema}>
					{/* <MenuItem value="">
						<em>---Select Schema---</em>
					</MenuItem> */}
					{schemaList &&
						schemaList.map((schema) => {
							return (
								<MenuItem
									sx={{
										fontSize: "14px",
										width: "200px",
										paddingBottom: "4px",
										paddingTop: "4px",
										paddingRight: "8px",
										paddingLeft: "8px",
										textOverflow: "ellipsis",
									}}
									value={schema}
									key={schema}
								>
									{schema}
								</MenuItem>
							);
						})}
				</Select>
			</div>

			<div className="sidebarHeading">Tables</div>
			{tableList.length !== 0 ? (
				tableList &&
				tableList.map((tab) => {
					return (
						<SelectListItem
							key={tab.tableName}
							render={(xprops) => (
								<div
									className="tableListStyle"
									onMouseOver={() => xprops.setOpen(true)}
									onMouseLeave={() => xprops.setOpen(false)}
								>
									<TableList
										key={tab.tableName}
										className="tableListElement"
										table={tab}
										tableId={tab.tableName}
										xprops={xprops}
										connectionId={connectionId}
									/>
								</div>
							)}
						/>
					);
				})
			) : (
				<div style={{ marginTop: "10px", fontStyle: "italic" }}>No Tables</div>
			)}

			<ChangeConnection
				open={openDlg}
				setOpen={setOpenDlg}
				setReset={setResetDataset}
				heading="RESET DATASET"
				message="Changing connection will reset this dataset creation. Do you want to discard
						the progress?"
			/>
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		token: state.isLogged.accessToken,
		tableList: state.dataSetState.tables,
		tempTable: state.dataSetState.tempTable,
		connectionValue: state.dataSetState.connection,
		schemaValue: state.dataSetState.schema,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		setConnection: (pl) => dispatch(setConnectionValue(pl)),
		setDataSchema: (pl) => dispatch(setDataSchema(pl)),
		setUserTable: (userTable) => dispatch(setUserTable(userTable)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
