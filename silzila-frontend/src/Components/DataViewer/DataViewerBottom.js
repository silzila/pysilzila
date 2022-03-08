import { Divider, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
	setSelectedDsInTile,
	setSelectedTableInTile,
} from "../../redux/ChartProperties/actionsChartProps";
import {
	setSelectedDataSetList,
	setTablesForSelectedDataSets,
} from "../../redux/TabTile/actionsTabTile";
import FetchData from "../../ServerCall/FetchData";
import DatasetListPopover from "../CommonFunctions/PopOverComponents/DatasetListPopover";
import "./dataViewerBottom.css";
import DisplayTable from "./DisplayTable";

const DataViewerBottom = ({
	// state
	token,
	tabTileProps,
	chartProps,

	// dispatch
	setSelectedDataSetList,
	setSelectedDs,
	setSelectedTable,
	setTablesForDs,
}) => {
	console.log(JSON.parse(JSON.stringify(tabTileProps)));
	console.log(JSON.parse(JSON.stringify(chartProps)));

	var propKey = `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`;
	var selectedChartProp = chartProps.properties[propKey];
	var tables = tabTileProps?.tablesForSelectedDataSets?.[selectedChartProp?.selectedDs];
	console.log(propKey, selectedChartProp);

	const [open, setOpen] = useState(false);
	const [selectedDataset, setSelectedDataset] = useState("");

	// When a new dataset is added to the tile for work,
	// set it in SelectedDataSet of tabTileProps
	useEffect(async () => {
		if (selectedDataset !== "") {
			var isAlready = tabTileProps.selectedDataSetList.filter((ds) => ds === selectedDataset);
			console.log(isAlready);
			if (isAlready.length > 0) {
				window.alert("Dataset already in selected list");
			} else {
				// TODO: Priority 1 - Open in new tab if any of the column by default for now
				// Later in left already has a field in it.
				setSelectedDataSetList(selectedDataset);
				setSelectedDs(propKey, selectedDataset.ds_uid);
				setOpen(false);
			}
		}
	}, [selectedDataset]);
	console.log(selectedDataset);

	// When a Dataset is selected, make sure the tables for that dataset is present in store.
	// If not, get it from server and save in store
	useEffect(async () => {
		if (
			tabTileProps?.tablesForSelectedDataSets?.[selectedChartProp?.selectedDs] === undefined
		) {
			console.log("Get Tables from server");
			var tablesFromServer = await getTables(selectedChartProp.selectedDs);

			setTablesForDs({ [selectedDataset.ds_uid]: tablesFromServer });
		} else {
			console.log("already tables present for this dataset");
		}
	}, [selectedChartProp.selectedDs]);

	const getTables = async (uid) => {
		var result = await FetchData({
			requestType: "noData",
			method: "GET",
			url: `ds/get-ds-tables/${uid}`,
			headers: { Authorization: `Bearer ${token}` },
		});

		if (result.status) {
			return result.data;
		} else {
			console.log(result.data.detail);
		}
	};

	const handleDataSetChange = (value) => {
		if (value === "addNewDataset") {
			setOpen(true);
			console.log("Show popover now");
		} else {
			var dsObj = tabTileProps.selectedDataSetList.filter((ds) => ds.ds_uid === value);
			console.log(dsObj);
			setSelectedDs(propKey, value);
		}
	};

	const handleTableChange = (tableId, schemaName) => {
		console.log("To handle when table is changed in dvb");

		console.log(tableId, schemaName, selectedChartProp.selectedTable);

		if (tableId === selectedChartProp.selectedTable) {
			console.log("Same Table selcted");
		} else {
			setSelectedTable(propKey, tableId);

			// Check if the table is in store
			// if yes, display the table
			// if No, get table from server, save in store and display the table
		}
	};

	// const getTableData = async (table) => {
	// 	var res = await FetchData({
	// 		requestType: "noData",
	// 		method: "GET",
	// 		url: "dc/sample-records/" + props.connectionId + "/" + props.schema + "/" + table,
	// 		headers: { Authorization: `Bearer ${props.token}` },
	// 	});

	// 	console.log("Get Table Data", res);
	// 	if (res.status) {
	// 		console.log("table Data", res.data);
	// 		setTableData(res.data);
	// 		setShowTableData(true);
	// 		var keys = Object.keys(res.data[0]);
	// 		setObjKeys([...keys]);
	// 	} else {
	// 		console.log("Get Table Data Error".res.data.detail);
	// 	}
	// };

	const TableListForDs = () => {
		if (tables !== undefined) {
			console.log(tables);

			return tables.map((table) => {
				console.log(
					table.id,
					selectedChartProp.selectedTable,
					selectedDataset.ds_uid,
					selectedChartProp.selectedDs
				);
				return (
					<div
						className={
							table.id === selectedChartProp.selectedTable
								? "dsIndiTableInTileSelected"
								: "dsIndiTableInTile"
						}
						key={table.id}
						onClick={() => {
							handleTableChange(table.id, table.schema_name);
						}}
					>
						{table.alias}
					</div>
				);
			});
		} else return null;
	};

	return (
		<div className="dataViewerBottom">
			<div className="dataSetAndTableList">
				<FormControl fullWidth size="small">
					<InputLabel id="selectDataSet">DataSet</InputLabel>
					<Select
						label="DataSet"
						labelId="selectDataSet"
						value={selectedChartProp.selectedDs}
						variant="outlined"
						onChange={(e) => {
							console.log(e.target.value);
							handleDataSetChange(e.target.value);
						}}
					>
						<MenuItem value="addNewDataset">Add Dataset</MenuItem>
						<Divider />
						{tabTileProps.selectedDataSetList.map((ds) => {
							return (
								<MenuItem value={ds.ds_uid} key={ds.ds_uid}>
									{ds.friendly_name}
								</MenuItem>
							);
						})}
					</Select>
				</FormControl>

				<div className="tileTableList">
					<TableListForDs />
				</div>
				<DatasetListPopover
					showCard={open}
					setShowCard={setOpen}
					popOverTitle="Select Dataset"
					setSelectedDataset={setSelectedDataset}
				/>
			</div>
			<div className="tileTableView">
				<DisplayTable />
			</div>

			{/* TODO: Priority 1 (Saravanan) - DS Select list and tableList 

				DONE: First div with width of 14.5rem to host the dropdown and list of tables
				
				DONE: Dropdown:
					Add Dataset option
						Popover the list of datasets from previous page. Once selected,
							See if the dataset is in already selected list
								if NO, save the dataset list in store
								if YES, Provide a warning saying Dataset was already selected
					List of already selected Datasets


				DONE: Tables List:
					List all tables for a selected dataset. 

			*/}

			{/* TODO: Priority 1 (Saravanan) - Table Selection and API call

				Table list Click actions:
					Set selected Table in chartPropsLeft in this tile. 
					Get sample columns
					Display table

				 When a table is selected, see if it is already on selected list and if the records are available.
				 get the sample records for this table and save in redux */}

			{/* TODO: Priority 1 (Saravanan) - Display the table that was just selected
				Use the previous table format and display the current selected table */}
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		token: state.isLogged.accessToken,
		tabTileProps: state.tabTileProps,
		chartProps: state.chartPropsLeft,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		setSelectedDataSetList: (dataset) => dispatch(setSelectedDataSetList(dataset)),
		setTablesForDs: (tablesObj) => dispatch(setTablesForSelectedDataSets(tablesObj)),

		setSelectedDs: (propKey, selectedDs) => dispatch(setSelectedDsInTile(propKey, selectedDs)),
		setSelectedTable: (propKey, selectedTable) =>
			dispatch(setSelectedTableInTile(propKey, selectedTable)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(DataViewerBottom);
