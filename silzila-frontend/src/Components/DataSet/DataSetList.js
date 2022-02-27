import ModeEditOutlineTwoTone from "@mui/icons-material/ModeEditOutlineTwoTone";
import { Tooltip } from "@mui/material";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import FetchData from "../../ServerCall/FetchData";
import { SelectListItem } from "../CommonFunctions/SelectListItem";

const DataSetList = (props) => {
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
			headers: { Authorization: `Bearer ${props.token}` },
		});

		console.log(result);
		if (result.status) {
			setDataSetList(result.data);
		} else {
			console.log(result.data.detail);
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
											// TODO: This icon must be view / edit icon. Implement edit dataset functionality.
											<Tooltip
												title="Edit Data Connection"
												arrow
												placement="right-start"
											>
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

export default connect(mapStateToProps, null)(DataSetList);
