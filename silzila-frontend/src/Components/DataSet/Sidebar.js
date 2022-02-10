import { List, MenuItem, Select } from "@mui/material";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
	setConnectionValue,
	setDataSchema,
	setUserTable,
} from "../../redux/Dataset/datasetActions";
import FetchData from "../../ServerCall/FetchData";
import { ChangeConnection } from "../CommonFunctions/DialogComponents";
import { SelectListItem } from "../CommonFunctions/SelectListItem";
import TableList from "./TableList";

const Sidebar = (props) => {
	const [connectionList, setConnectionList] = useState([]);
	const [selectedConnection, setSelectedConnection] = useState("");
	const [connectionId, setConnectionId] = useState();
	const [schemaList, setSchemaList] = useState([]);
	const [selectedSchema, setSelectedSchema] = useState("");
	const [openDlg, setOpenDlg] = useState(false);

	useEffect(() => {
		getAllDc();
	}, []);

	const getAllDc = async () => {
		var res = await FetchData({
			requestType: "noData",
			method: "GET",
			url: "dc/get-all-dc",
			headers: { Authorization: `Bearer ${props.token}` },
		});

		console.log("Get All Dc Response", res);
		if (res.status) {
			setConnectionList(res.data);
		} else {
			console.log("get All Dc Error".res.data.detail);
		}
	};

	// ==============================================================
	// get schema after connection selected
	// ==============================================================

	const getSchemaList = async (e) => {
		const dc_uid = e.target.value;
		setConnectionId(dc_uid);
		props.setConnection(dc_uid);
		props.setUserTable([]);

		var res = await FetchData({
			requestType: "noData",
			method: "GET",
			url: `dc/connect-dc/${dc_uid}`,
			headers: { Authorization: `Bearer ${props.token}` },
			token: props.token,
		});

		console.log("Connect Dc Response", res);
		if (res.status) {
			console.log(res.data);
			if (res.data.message === "success") {
				var res2 = await FetchData({
					requestType: "noData",
					method: "GET",
					url: `dc/schemas/${dc_uid}`,
					headers: { Authorization: `Bearer ${props.token}` },
					token: props.token,
				});

				console.log("get schema res:", res2);
				if (res2.status) {
					setSchemaList(res2.data);
				} else {
					console.log("get schema error", res2.data.detail);
				}
			}
		} else {
			console.log("connect dc error:", res.data.detail);
		}
	};

	// ======================================================================
	// getting tables List
	// ======================================================================

	const getTables = async (e) => {
		console.log("selected Schema:", e.target.value);
		const schema = e.target.value;
		setSelectedSchema(schema);
		props.setDataSchema(schema);

		var res = await FetchData({
			requestType: "noData",
			method: "GET",
			url: `dc/tables/${connectionId}/${schema}`,
			headers: { Authorization: `Bearer ${props.token}` },
			token: props.token,
		});

		console.log("get Tables response:", res);
		if (res.status) {
			props.setUserTable(res.data);
		} else {
			console.log("get Tables error:", res);
		}
	};

	return (
		<div className="sidebar">
			<div className="sidebarHeading">Connection</div>
			<div>
				<Select
					className="selectBar"
					onChange={(e) => {
						setSelectedConnection(e.target.value);
						getSchemaList(e);
						setSelectedSchema("");
						props.setDataSchema("");
					}}
					value={selectedConnection}
				>
					{connectionList &&
						connectionList.map((connection, i) => {
							return (
								<MenuItem value={connection.dc_uid} key={connection.dc_uid}>
									{connection.db_name} ({connection.friendly_name})
								</MenuItem>
							);
						})}
				</Select>
			</div>

			<div className="sidebarHeading">Schema</div>
			<div>
				<Select className="selectBar" onChange={(e) => getTables(e)} value={selectedSchema}>
					{schemaList &&
						schemaList.map((schema) => {
							return (
								<MenuItem value={schema} key={schema}>
									{schema}
								</MenuItem>
							);
						})}
				</Select>
			</div>

			<React.Fragment>
				<div className="sidebarHeading">Tables</div>
				{props.tableList.length !== 0 ? (
					props.tableList &&
					props.tableList.map((tab) => {
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

			{/* <ChangeConnection open={openDlg} setOpen={setOpenDlg} /> */}
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		token: state.isLogged.accessToken,
		tableList: state.dataSetState.tables,
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
