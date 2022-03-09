import ModeEditOutlineTwoTone from "@mui/icons-material/ModeEditOutlineTwoTone";
import { Tooltip } from "@mui/material";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setDatasetList } from "../../redux/Dataset/datasetActions";
import FetchData from "../../ServerCall/FetchData";
import { SelectListItem } from "../CommonFunctions/SelectListItem";

const DataSetList = ({
	// state
	token,

	// dispatch
	setDataSetListToStore,
}) => {
	var navigate = useNavigate();

	const [dataSetList, setDataSetList] = useState([]);

	useEffect(() => {
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

	return (
		<div className="dataSetContainer">
			<div className="containersHead">
				<div className="containerTitle">Datasets</div>

				{/* TODO: Priority 1 - Reset dataset values (Same from BottomBar.js) 
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
												title="Edit Dataset"
												arrow
												placement="right-start"
											>
												{/* TODO: Priority 10 - This icon must be view / edit icon. */}
												<ModeEditOutlineTwoTone
													style={{
														width: "1rem",
														height: "1rem",
														margin: "auto",
													}}
												/>
											</Tooltip>
										) : null}
									</div>
								)}
							/>
						);
					})}
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
		setDataSetListToStore: (dataSetList) => dispatch(setDatasetList(dataSetList)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(DataSetList);
