import { Divider, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
	setSelectedDsInTile,
	setSelectedTableInTile,
} from "../../redux/ChartProperties/actionsChartProps";
import { addTableRecords } from "../../redux/SampleTableRecords/sampleTableRecordsActions";
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
	sampleRecords,

	// dispatch
	setSelectedDataSetList,
	setSelectedDs,
	setSelectedTable,
	setTablesForDs,
	addRecords,
}) => {
	var propKey = `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`;
	var selectedChartProp = chartProps.properties[propKey];
	var tables = tabTileProps?.tablesForSelectedDataSets?.[selectedChartProp?.selectedDs?.ds_uid];

	const [open, setOpen] = useState(false);
	const [selectedDataset, setSelectedDataset] = useState("");

	// When a new dataset is added to the tile for work,
	// set it in SelectedDataSet of tabTileProps
	useEffect(async () => {
		if (selectedDataset !== "") {
			var isAlready = tabTileProps.selectedDataSetList.filter((ds) => ds === selectedDataset);
			if (isAlready.length > 0) {
				window.alert("Dataset already in selected list");
			} else {
				// TODO: Priority 1 - Open in new tab if any of the column by default for now
				// Later in left already has a field in it.
				setSelectedDataSetList(selectedDataset);
				setSelectedDs(propKey, selectedDataset);
				setOpen(false);
			}
		}
	}, [selectedDataset]);

	// When a Dataset is selected, make sure the tables for that dataset is present in store.
	// If not, get it from server and save in store
	useEffect(async () => {
		if (
			tabTileProps?.tablesForSelectedDataSets?.[selectedChartProp?.selectedDs?.ds_uid] ===
			undefined
		) {
			var tablesFromServer = await getTables(selectedChartProp.selectedDs?.ds_uid);

			setTablesForDs({ [selectedDataset.ds_uid]: tablesFromServer });
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
		} else {
			var dsObj = tabTileProps.selectedDataSetList.filter((ds) => ds.ds_uid === value)[0];
			setSelectedDs(propKey, dsObj);
		}
	};

	const handleTableChange = async (table, dsUid) => {
		if (table.id !== selectedChartProp.selectedTable) {
			setSelectedTable(propKey, { [selectedChartProp.selectedDs.ds_uid]: table.id });

			if (sampleRecords?.[selectedChartProp.selectedDs?.ds_uid]?.[table.id]) {
			} else {
				var dc_uid = selectedChartProp.selectedDs?.dc_uid;
				var tableRecords = await getTableData(dc_uid, table.schema_name, table.table_name);

				var ds_uid = selectedChartProp.selectedDs?.ds_uid;

				addRecords(ds_uid, table.id, tableRecords);
			}
		}
	};

	const getTableData = async (dc_uid, schema_name, table_name) => {
		var res = await FetchData({
			requestType: "noData",
			method: "GET",
			url: "dc/sample-records/" + dc_uid + "/" + schema_name + "/" + table_name,
			headers: { Authorization: `Bearer ${token}` },
		});

		if (res.status) {
			return res.data;
		} else {
			console.log("Get Table Data Error".res.data.detail);
		}
	};

	const TableListForDs = () => {
		if (tables !== undefined) {
			return tables.map((table) => {
				return (
					<div
						className={
							table.id ===
							selectedChartProp.selectedTable?.[selectedChartProp.selectedDs?.ds_uid]
								? "dsIndiTableInTileSelected"
								: "dsIndiTableInTile"
						}
						key={table.id}
						onClick={() => {
							handleTableChange(table);
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
						value={selectedChartProp.selectedDs?.ds_uid}
						variant="outlined"
						onChange={(e) => {
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
				{selectedChartProp.selectedTable?.[selectedChartProp.selectedDs.ds_uid] ? (
					<DisplayTable
						dsId={selectedChartProp.selectedDs?.ds_uid}
						table={
							selectedChartProp.selectedTable[selectedChartProp.selectedDs?.ds_uid]
						}
					/>
				) : null}
			</div>
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		token: state.isLogged.accessToken,
		tabTileProps: state.tabTileProps,
		chartProps: state.chartPropsLeft,
		sampleRecords: state.sampleRecords,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		setSelectedDataSetList: (dataset) => dispatch(setSelectedDataSetList(dataset)),
		setTablesForDs: (tablesObj) => dispatch(setTablesForSelectedDataSets(tablesObj)),

		setSelectedDs: (propKey, selectedDs) => dispatch(setSelectedDsInTile(propKey, selectedDs)),
		setSelectedTable: (propKey, selectedTable) =>
			dispatch(setSelectedTableInTile(propKey, selectedTable)),
		addRecords: (ds_uid, tableId, tableRecords) =>
			dispatch(addTableRecords(ds_uid, tableId, tableRecords)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(DataViewerBottom);
