import ModeEditOutlineTwoTone from "@mui/icons-material/ModeEditOutlineTwoTone";
import DeleteIcon from "@mui/icons-material/Delete";
import { Tooltip } from "@mui/material";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { resetState, setDatasetList, setDsId } from "../../redux/Dataset/datasetActions";
import FetchData from "../../ServerCall/FetchData";
import { SelectListItem } from "../CommonFunctions/SelectListItem";
import { NotificationDialog } from "../CommonFunctions/DialogComponents";

const DataSetList = ({
	// state
	token,

	// dispatch
	setDataSetListToStore,
	resetState,
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

	const getInformation = async () => {
		var result = await FetchData({
			requestType: "noData",
			method: "GET",
			url: "ds/get-all-ds",
			headers: { Authorization: `Bearer ${token}` },
		});

		if (result.status) {
			setDataSetList(result.data);
			setDataSetListToStore(result.data);
		} else {
			console.log(result.data.detail);
		}
	};
	const editDs = async (dsuid) => {
		setDsId(dsuid);
		setTimeout(() => {
			navigate("/editdataset");
		}, 1000);
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
		<div className="dataSetContainer">
			<div className="containersHead">
				<div className="containerTitle">Datasets</div>

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
												title="Edit Dataset"
												arrow
												placement="right-start"
											>
												<>
													<ModeEditOutlineTwoTone
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
																"are you sure you want to Delete this Dataset?"
															);
															if (yes) {
																deleteDs(dc.ds_uid);
															}
														}}
													/>
												</>
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

const mapStateToProps = (state) => {
	return {
		token: state.isLogged.accessToken,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		resetState: () => dispatch(resetState()),
		setDsId: (pl) => dispatch(setDsId(pl)),
		setDataSetListToStore: (dataSetList) => dispatch(setDatasetList(dataSetList)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(DataSetList);