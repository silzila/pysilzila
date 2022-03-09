import React, { useState } from "react";
import "./dataViewer.css";
import { connect } from "react-redux";
import Menu from "./Menu";
import TabRibbon from "../TabsAndTiles/TabRibbon";
import { setShowDashBoard } from "../../redux/TabTile/actionsTabTile";
import DataViewerMiddle from "./DataViewerMiddle.js";
import DataViewerBottom from "./DataViewerBottom";
import TableViewIcon from "@mui/icons-material/TableView";
import TileRibbon from "../TabsAndTiles/TileRibbon";
import DashBoard from "../DashBoard/DashBoard";

function DataViewer({
	// state
	tabTileProps,

	// dispatch
	showDashBoard,
}) {
	const [displayDatViewBot, setDisplayDatViewBot] = useState(true);

	const handleTableDisplayToggle = () => {
		setDisplayDatViewBot((prevState) => {
			return !prevState;
		});
	};

	// ===========================================================================================
	//                                      UI Components
	// ===========================================================================================

	return (
		<div className="dataViewer">
			<Menu />

			<TabRibbon />

			{tabTileProps.showDash ? (
				<DashBoard showDash={tabTileProps.showDash} />
			) : (
				<React.Fragment>
					<DataViewerMiddle
						tabId={tabTileProps.selectedTabId}
						tileId={tabTileProps.selectedTileId}
						selectedFile={tabTileProps.selectedTable}
					/>

					{displayDatViewBot ? <DataViewerBottom /> : null}
				</React.Fragment>
			)}

			<div className="tilearea">
				<div className="tileItems">
					<span
						title="Dashboard"
						className={
							tabTileProps.showDash
								? "plusTile commonTile indiItemHighlightTile"
								: "plusTile commonTile indiItemTile"
						}
						onClick={() => {
							showDashBoard(tabTileProps.selectedTabId, true);
						}}
					>
						Dashboard
					</span>

					<TileRibbon />
				</div>

				<div
					className="tableDisplayToggle"
					onClick={handleTableDisplayToggle}
					title="Show / Hide table"
				>
					{displayDatViewBot ? (
						// TODO: Priority 10 - Style changes
						// Give proper padding, choose a good Icon and color
						<TableViewIcon style={{ fontSize: "20px" }} />
					) : (
						<TableViewIcon style={{ color: "#808080", fontSize: "20px" }} />
					)}
				</div>
			</div>
		</div>
	);
}

// ===========================================================================================
//                                 REDUX MAPPING STATE AND DISPATCH TO PROPS
// ===========================================================================================

const mapStateToProps = (state) => {
	return {
		tabTileProps: state.tabTileProps,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		showDashBoard: (tabId, showDash) => dispatch(setShowDashBoard(tabId, showDash)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(DataViewer);
