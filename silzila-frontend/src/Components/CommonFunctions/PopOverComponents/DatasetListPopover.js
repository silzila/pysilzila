import { Popover } from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import React from "react";
import { connect } from "react-redux";
import "./Popover.css";

const DatasetListPopover = ({
	// props
	popOverTitle,
	showCard,
	setShowCard,
	setSelectedDataset,

	// state
	dataSetList,
}) => {
	return (
		<Popover
			open={showCard}
			onClose={setShowCard}
			anchorReference="anchorEl"
			anchorOrigin={{
				vertical: "center",
				horizontal: "center",
			}}
			transformOrigin={{
				vertical: "center",
				horizontal: "center",
			}}
		>
			<div className="datasetListPopover">
				<div className="datasetListPopoverHeading">
					<div style={{ flex: 1 }}>{popOverTitle}</div>

					<CloseRoundedIcon
						style={{ marginLeft: "1rem" }}
						onClick={() => setShowCard(false)}
					/>
				</div>
				<div>
					{dataSetList.map((ds) => {
						return (
							<div
								className="dataSetNameIndi"
								onClick={() => setSelectedDataset(ds)}
								key={ds.ds_uid}
							>
								{ds.friendly_name}
							</div>
						);
					})}
				</div>
			</div>
		</Popover>
	);
};

const mapStateToProps = (state) => {
	return {
		dataSetList: state.dataSetState.dataSetList,
	};
};

export default connect(mapStateToProps, null)(DatasetListPopover);
