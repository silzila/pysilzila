import React, { useState } from "react";
import { Checkbox, Tooltip } from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import FetchData from "../../ServerCall/FetchData";
import { connect } from "react-redux";
import { addTable, removeArrows, toggleOnChecked } from "../../redux/Dataset/datasetActions";
import TableData from "./TableData";

const TableList = (props) => {
	const [selectedTable, setSelectedTable] = useState("");
	const [showTableData, setShowTableData] = useState(false);
	const [tableData, setTableData] = useState([]);
	const [objKeys, setObjKeys] = useState([]);

	const getTableColumns = async (tableName) => {
		var result = await FetchData({
			requestType: "noData",
			method: "GET",
			url: "dc/columns/" + props.connectionId + "/" + props.schema + "/" + tableName,
			headers: { Authorization: `Bearer ${props.token}` },
		});
		if (result.status) {
			let obj;
			props.tableList.map((el) => {
				if (el.tableName === tableName && el.isSelected === true) {
					const arrayWithUid = result.data.map((data) => {
						return {
							uid: tableName.concat(data.column_name).concat(props.schema),
							...data,
						};
					});
					console.log(arrayWithUid);
					obj = {
						table_uid: el.table_uid,
						tableName: tableName,
						isSelected: el.isSelected,
						alias: tableName,
						columns: arrayWithUid,
						dcId: props.connectionId,
						schema: props.schema,
					};
				}
			});
			props.addTable(obj);
		}
	};

	const checkAndUncheck = (e, tableUid) => {
		console.log(e.target.value, tableUid);
		// props.onChecked(e.target.value);
		props.onChecked(tableUid);

		if (e.target.checked) {
			getTableColumns(e.target.value);
		} else {
			if (props.tempTable.length !== 0) {
				props.tempTable.map((el) => {
					if (el.table_uid === tableUid) {
						props.removeArrows(tableUid);
					}
				});
			}
		}
	};

	// ==============================================================
	//  get Table Data
	// ==============================================================
	const getTableData = async (table) => {
		var res = await FetchData({
			requestType: "noData",
			method: "GET",
			url: "dc/sample-records/" + props.connectionId + "/" + props.schema + "/" + table,
			headers: { Authorization: `Bearer ${props.token}` },
		});

		if (res.status) {
			setTableData(res.data);
			setShowTableData(true);
			var keys = Object.keys(res.data[0]);
			setObjKeys([...keys]);
		} else {
			console.log("Get Table Data Error".res.data.detail);
		}
	};

	// =========================== props to tableData ====================================

	const properties = {
		showTableData,
		setShowTableData,
		selectedTable,
		setSelectedTable,
		tableData,
		setTableData,
		objKeys,
	};

	return (
		<React.Fragment>
			<Checkbox
				style={{ width: "1rem", height: "1rem", margin: "auto 5px auto 0" }}
				size="1rem"
				checked={props.table.isSelected ? true : false}
				onClick={(e) => checkAndUncheck(e, props.table.table_uid)}
				value={props.table.tableName}
			/>

			<span className="tableName" title={props.table.tableName}>
				{props.table.tableName}
			</span>

			{props.xprops.open ? (
				<Tooltip
					title="View Table"
					arrow
					placement="right-start"
					style={{ float: "right" }}
				>
					<VisibilityOutlinedIcon
						className="tableIcon"
						style={{ width: "1rem", height: "1rem", margin: "auto 5px" }}
						onClick={() => {
							setSelectedTable(props.table.tableName);
							getTableData(props.table.tableName);
						}}
					/>
				</Tooltip>
			) : null}
			<TableData {...properties} />
		</React.Fragment>
	);
};

const mapStateToProps = (state) => {
	return {
		tableList: state.dataSetState.tables,
		tempTable: state.dataSetState.tempTable,
		token: state.isLogged.accessToken,
		connectionId: state.dataSetState.connection,
		schema: state.dataSetState.schema,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onChecked: (data) => dispatch(toggleOnChecked(data)),
		addTable: (payload) => dispatch(addTable(payload)),
		removeArrows: (pl) => dispatch(removeArrows(pl)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(TableList);
