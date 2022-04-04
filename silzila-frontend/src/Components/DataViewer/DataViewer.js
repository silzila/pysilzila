import React, { useState } from "react";
import "./dataViewer.css";
import { connect } from "react-redux";
import Menu from "./Menu";
import TabRibbon from "../TabsAndTiles/TabRibbon";
import { setShowDashBoard, toggleColumnsOnlyDisplay } from "../../redux/TabTile/actionsTabTile";
import DataViewerMiddle from "./DataViewerMiddle.js";
import DataViewerBottom from "./DataViewerBottom";
import TableViewIcon from "@mui/icons-material/TableView";
import TableRowsIcon from "@mui/icons-material/TableRows";
import TableChartOutlinedIcon from "@mui/icons-material/TableChartOutlined";
import TileRibbon from "../TabsAndTiles/TileRibbon";
import DashBoard from "../DashBoard/DashBoard";

function DataViewer({
	// state
	tabTileProps,

	// dispatch
	showDashBoard,
	toggleColumns,
}) {
	const [displayDatViewBot, setDisplayDatViewBot] = useState(true);

	const handleTableDisplayToggle = () => {
		setDisplayDatViewBot((prevState) => {
			return !prevState;
		});
	};

	const handleColumnsOnlyDisplay = (col) => {
		toggleColumns(col);
		setDisplayDatViewBot(true);
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
				<div className="showTableColumns">
					{tabTileProps.columnsOnlyDisplay ? (
						<TableChartOutlinedIcon
							style={{ fontSize: "20px", color: "#404040" }}
							onClick={() => handleColumnsOnlyDisplay(false)}
							title="Show full table"
						/>
					) : (
						<TableRowsIcon
							style={{ fontSize: "20px", color: "#404040" }}
							onClick={() => handleColumnsOnlyDisplay(true)}
							title="Show Column Headers only"
						/>
					)}
				</div>
				<div
					className="tableDisplayToggle"
					onClick={handleTableDisplayToggle}
					title="Show / Hide table"
				>
					{displayDatViewBot ? (
						<TableViewIcon style={{ fontSize: "20px" }} />
					) : (
						<TableViewIcon style={{ fontSize: "20px", color: "#808080" }} />
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
		toggleColumns: (columns) => dispatch(toggleColumnsOnlyDisplay(columns)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(DataViewer);
