import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSelectedDsInTile } from "../../redux/ChartProperties/actionsChartProperties";
import {
	loadPlaybook,
	setSelectedDataSetList,
	setTablesForSelectedDataSets,
} from "../../redux/TabTile/actionsTabTile";
import FetchData from "../../ServerCall/FetchData";
import DatasetListPopover from "../CommonFunctions/PopOverComponents/DatasetListPopover";
import { playBookData } from "../DataViewer/samplePlaybookData";

const PlayBookList = ({
	// state
	token,

	// dispatch
	setSelectedDataSetList,
	setTablesForDs,
	setSelectedDs,
	loadPlayBook,
}) => {
	const [openPopOver, setOpenPopOver] = useState(false);
	const [selectedDataset, setSelectedDataset] = useState("");

	var navigate = useNavigate();

	useEffect(async () => {
		if (selectedDataset !== "") {
			setSelectedDataSetList(selectedDataset);

			var datasetFromServer = await getTables(selectedDataset.ds_uid);
			setTablesForDs({ [selectedDataset.ds_uid]: datasetFromServer });
			setSelectedDs(selectedDataset);

			navigate("/dataviewer");
		}
	}, [selectedDataset]);

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

	return (
		<div className="dashboardsContainer">
			<div className="containersHead">
				<div className="containerTitle">Playbooks</div>

				<DatasetListPopover
					showCard={openPopOver}
					setShowCard={setOpenPopOver}
					setSelectedDataset={setSelectedDataset}
					popOverTitle="Select a Dataset to use with PlayBook"
				/>
				<input
					className="containerButton"
					type="button"
					value="New"
					onClick={(e) => {
						setOpenPopOver(true);
					}}
				/>
			</div>
			<div className="connectionListContainer">
				<div className="dataConnectionList">
					<div
						className="dataConnectionName"
						onClick={() => {
							console.log("Open Sample Playbook");

							var pB = playBookData;
							console.log(pB.name);
							console.log(pB.data);

							// Read Sample playbook
							// Set current dataset
							// set selected table
							// set tabState, tileState, tabTileProps, chartProperty & ChartControl
							loadPlayBook(pB.data);
							navigate("/dataviewer");
						}}
					>
						Sample PlayBook
					</div>
				</div>
			</div>
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		token: state.isLogged.accessToken,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		setSelectedDataSetList: (dataset) => dispatch(setSelectedDataSetList(dataset)),
		setTablesForDs: (tablesObj) => dispatch(setTablesForSelectedDataSets(tablesObj)),
		setSelectedDs: (selectedDs) => dispatch(setSelectedDsInTile("1.1", selectedDs)),
		loadPlayBook: (playBook) => dispatch(loadPlaybook(playBook)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(PlayBookList);
