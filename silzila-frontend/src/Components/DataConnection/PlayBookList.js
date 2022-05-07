import { VisibilitySharp } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Tooltip } from "@mui/material";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSelectedDsInTile } from "../../redux/ChartProperties/actionsChartProperties";
import { updatePlaybookUid } from "../../redux/Playbook/playbookActions";
import {
	loadPlaybook,
	setSelectedDataSetList,
	setTablesForSelectedDataSets,
} from "../../redux/TabTile/actionsTabTile";
import FetchData from "../../ServerCall/FetchData";
import { getChartData } from "../ChartAxes/ChartAxes";
import { NotificationDialog } from "../CommonFunctions/DialogComponents";
import DatasetListPopover from "../CommonFunctions/PopOverComponents/DatasetListPopover";
import LoadingPopover from "../CommonFunctions/PopOverComponents/LoadingPopover";
import { SelectListItem } from "../CommonFunctions/SelectListItem";

const PlayBookList = ({
	// state
	token,

	// dispatch
	setSelectedDataSetList,
	setTablesForDs,
	setSelectedDs,
	loadPlayBook,
	updatePlayBookId,
}) => {
	const [playBookList, setPlayBookList] = useState([]);

	const [openPopOver, setOpenPopOver] = useState(false);
	const [selectedDataset, setSelectedDataset] = useState("");
	const [loading, setLoading] = useState(false);

	const [openAlert, setOpenAlert] = useState(false);
	const [testMessage, setTestMessage] = useState("");
	const [severity, setSeverity] = useState("success");

	var navigate = useNavigate();

	useEffect(() => {
		getInformation();
		// eslint-disable-next-line
	}, []);

	const getInformation = async () => {
		var result = await FetchData({
			requestType: "noData",
			method: "GET",
			url: "pb/get-all-pb",
			headers: { Authorization: `Bearer ${token}` },
		});

		if (result.status) {
			setPlayBookList(result.data);
		} else {
			console.log(result.data.detail);
		}
	};

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

	const getPlayBookDataFromServer = async (pbUid) => {
		var result = await FetchData({
			requestType: "noData",
			method: "GET",
			url: `pb/get-pb/${pbUid}`,
			headers: { Authorization: `Bearer ${token}` },
		});

		console.log(result);

		if (result.status) {
			var pb = result.data;
			var newChartControl = JSON.parse(JSON.stringify(pb.content.chartControl));

			setLoading(true);

			await Promise.all(
				Object.keys(pb.content.chartControl.properties).map(async (property) => {
					var axesValue = pb.content.chartProperty.properties[property].chartAxes;
					var data = await getChartData(
						axesValue,
						pb.content.chartProperty,
						property,
						token
					);
					console.log(data);
					newChartControl.properties[property].chartData = data;
				})
			);

			// var tableRecords = [];

			// await Promise.all(
			// 	Object.keys(pb.content.chartProperty.properties).map(async (prop) => {
			// 		var tableInfo = pb.content.chartProperty.properties[prop];
			// 		console.log(tableInfo);

			// 		var dc_uid = tableInfo.selectedDs?.dc_uid;
			// 		var ds_uid = tableInfo.selectedDs?.ds_uid;

			// 		var selectedTableForThisDataset = tableInfo.selectedTable[ds_uid];
			// 		console.log("Selected Table : ", selectedTableForThisDataset);
			// 		console.log("DC_UID : ", dc_uid, "\nDS_UID : ", ds_uid);
			// 		console.log(pb.content.tabTileProps.tablesForSelectedDataSets[ds_uid]);
			// 		// var tableRecords = await getTableData(
			// 		// 	dc_uid,
			// 		// 	table.schema_name,
			// 		// 	table.table_name,
			// 		// 	token
			// 		// );
			// 		// var recordsType = await getColumnTypes(
			// 		// 	dc_uid,
			// 		// 	table.schema_name,
			// 		// 	table.table_name,
			// 		// 	token
			// 		// );

			// 		// addRecords(ds_uid, table.id, tableRecords, recordsType);
			// 	})
			// );

			setLoading(false);

			pb.content.chartControl = newChartControl;
			console.log(JSON.stringify(pb.content, null, 4));
			loadPlayBook(pb.content);
			updatePlayBookId({ name: pb.name, pb_uid: pb.pb_uid, description: pb.description });
			navigate("/dataviewer");
		}
	};

	const deletePlayBook = async (pbUid) => {
		var result = await FetchData({
			requestType: "noData",
			method: "DELETE",
			url: "pb/delete-pb/" + pbUid,
			headers: { Authorization: `Bearer ${token}` },
		});
		if (result.status) {
			setSeverity("success");
			setOpenAlert(true);
			setTestMessage("Deleted Successfully!");
			getInformation();
			setTimeout(() => {
				setOpenAlert(false);
				setTestMessage("");
			}, 2000);
		} else {
			console.log(result.detail);
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
				{playBookList &&
					playBookList.map((pb) => {
						return (
							<SelectListItem
								key={pb.name}
								render={(xprops) => (
									<div
										className={
											xprops.open
												? "dataConnectionListSelected"
												: "dataConnectionList"
										}
										onMouseOver={() => xprops.setOpen(true)}
										onMouseLeave={() => xprops.setOpen(false)}
										onClick={() => getPlayBookDataFromServer(pb.pb_uid)}
									>
										<div className="dataConnectionName">{pb.name}</div>
										{xprops.open ? (
											<Tooltip
												title="Delete playbook"
												arrow
												placement="right-start"
											>
												<div
													className="dataHomeDeleteIcon"
													onClick={(e) => {
														e.stopPropagation();

														var yes = window.confirm(
															"Are you sure you want to Delete this Playbook?"
														);
														if (yes) {
															deletePlayBook(pb.pb_uid);
														}
													}}
												>
													<DeleteIcon
														style={{
															width: "1rem",
															height: "1rem",
															margin: "auto",
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

				<NotificationDialog
					openAlert={openAlert}
					severity={severity}
					testMessage={testMessage}
					onCloseAlert={() => {
						setOpenAlert(false);
						setTestMessage("");
					}}
				/>
			</div>

			{loading ? <LoadingPopover /> : null}
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
		updatePlayBookId: (pbUid) => dispatch(updatePlaybookUid(pbUid)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(PlayBookList);
