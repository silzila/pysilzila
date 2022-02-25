import { List, MenuItem, Select } from "@mui/material";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
	setConnectionValue,
	setDataSchema,
	setFriendlyName,
	setUserTable,
} from "../../redux/Dataset/datasetActions";
import FetchData from "../../ServerCall/FetchData";
import { ChangeConnection } from "../CommonFunctions/DialogComponents";
import { SelectListItem } from "../CommonFunctions/SelectListItem";
import TableList from "./TableList";

const Sidebar = ({
	// state
	token,
	tableList,
	tempTable,

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
		console.log(e.target.value);
		console.log(tempTable.length);
		if (tempTable.length > 0) {
			setDcToResetTo(e.target.value);
			setOpenDlg(true);
		} else {
			setSelectedConnection(e.target.value);
			getSchemaList(e.target.value);
			setSelectedSchema("");
			setDataSchema("");
		}
	};

	useEffect(() => {
		getAllDc();
	}, []);

	console.log(dcToResetTo);

	useEffect(() => {
		if (resetDataset) {
			console.log("Reseting DC name");
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

		console.log(res);
		if (res.status) {
			setConnectionList(res.data);
		} else {
			console.log(res.data.detail);
		}
	};

	const getSchemaList = async (uid) => {
		const dc_uid = uid;
		let fname;
		connectionList.map((con) => {
			if (con.dc_uid === dc_uid) {
				fname = con.friendly_name;
			}
		});
		setConnectionId(dc_uid);
		setConnection(dc_uid);
		setUserTable([]);

		var res = await FetchData({
			requestType: "noData",
			method: "GET",
			url: `dc/connect-dc/${dc_uid}`,
			headers: { Authorization: `Bearer ${token}` },
			token: token,
		});

		console.log(res);
		if (res.status) {
			console.log(res.data);
			if (res.data.message === "success") {
				var res2 = await FetchData({
					requestType: "noData",
					method: "GET",
					url: `dc/schemas/${dc_uid}`,
					headers: { Authorization: `Bearer ${token}` },
					token: token,
				});

				console.log(res2);
				if (res2.status) {
					setSchemaList(res2.data);
				} else {
					console.log(res2.data.detail);
				}
			}
		} else {
			console.log(res.data.detail);
		}
	};

	const getTables = async (e) => {
		console.log(e.target.value);
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

		console.log(res);
		if (res.status) {
			const userTable = res.data.map((el) => {
				console.log(el, tempTable, connectionId, schema);
				var tableAlreadyChecked = tempTable.filter(
					(tbl) =>
						tbl.dcId === connectionId && tbl.schema === schema && tbl.tableName === el
				)[0];
				console.log(tableAlreadyChecked);
				if (tableAlreadyChecked) {
					return { tableName: el, isSelected: true };
				}
				return { tableName: el, isSelected: false };
			});

			console.log(userTable);

			setUserTable(userTable);
		} else {
			console.log(res);
		}
	};

	return (
		<div className="sidebar">
			{/* TODO Change the input fields to MUI */}
			<div className="sidebarHeading">Connection</div>
			<div>
				<select
					className="selectBar"
					onChange={(e) => {
						onConnectionChange(e);
					}}
					value={selectedConnection}
				>
					<option value="" disabled hidden>
						{"--Select Connection--"}
					</option>
					{connectionList &&
						connectionList.map((connection, i) => {
							return (
								<option value={connection.dc_uid} key={connection.dc_uid}>
									{connection.db_name} ({connection.friendly_name})
								</option>
							);
						})}
				</select>
			</div>

			<div className="sidebarHeading">Schema</div>
			<div>
				<select className="selectBar" onChange={(e) => getTables(e)} value={selectedSchema}>
					<option value="" disabled hidden>
						{"--Select Schema--"}
					</option>
					{schemaList &&
						schemaList.map((schema) => {
							return (
								<option value={schema} key={schema}>
									{schema}
								</option>
							);
						})}
				</select>
			</div>

			<React.Fragment>
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
											selectedSchema={selectedSchema}
										/>
									</div>
								)}
							/>
						);
					})
				) : (
					<div style={{ marginTop: "10px", fontStyle: "italic" }}>No Tables</div>
				)}
			</React.Fragment>

			<ChangeConnection open={openDlg} setOpen={setOpenDlg} setReset={setResetDataset} />
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		token: state.isLogged.accessToken,
		tableList: state.dataSetState.tables,
		tempTable: state.dataSetState.tempTable,
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
