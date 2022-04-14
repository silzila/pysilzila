import React, { useState } from "react";
import "./dataViewer.css";
import { connect } from "react-redux";
import Menu from "./Menu";
import TabRibbon from "../TabsAndTiles/TabRibbon";
import {
	setShowDashBoard,
	toggleColumnsOnlyDisplay,
	toggleDashMode,
	toggleDashModeInTab,
} from "../../redux/TabTile/actionsTabTile";
import DataViewerMiddle from "./DataViewerMiddle.js";
import DataViewerBottom from "./DataViewerBottom";
import TableViewIcon from "@mui/icons-material/TableView";
import TableRowsIcon from "@mui/icons-material/TableRows";
import TableChartOutlinedIcon from "@mui/icons-material/TableChartOutlined";
import TileRibbon from "../TabsAndTiles/TileRibbon";
import DashBoard from "../DashBoard/DashBoard";
import { MenuItem, Select } from "@mui/material";

function DataViewer({
	// state
	tabTileProps,

	// dispatch
	showDashBoard,
	toggleColumns,
	toggleDashMode,
	toggleDashModeInTab,
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

	const menuStyle = { fontSize: "12px", padding: "2px", margin: 0 };
	return (
		<div className="dataViewer">
			<Menu />

			<div className="tabArea">
				<TabRibbon />

				{tabTileProps.showDash ? (
					<Select
						sx={{ height: "1.5rem", fontSize: "12px" }}
						value={tabTileProps.dashMode}
						onChange={(e) => {
							console.log(e.target.value);
							toggleDashMode(e.target.value);
							toggleDashModeInTab(tabTileProps.selectedTabId, e.target.value);
						}}
					>
						<MenuItem sx={menuStyle} value="Dev Mode">
							Dev Mode
						</MenuItem>
						<MenuItem sx={menuStyle} value="Presentation Mode">
							Presentation Mode
						</MenuItem>
					</Select>
				) : null}
			</div>

			{tabTileProps.showDash ? (
				<DashBoard showDash={tabTileProps.showDash} />
			) : (
				<React.Fragment>
					<DataViewerMiddle
						tabId={tabTileProps.selectedTabId}
						tileId={tabTileProps.selectedTileId}
					/>

					{displayDatViewBot ? <DataViewerBottom /> : null}
				</React.Fragment>
			)}

			{tabTileProps.dashMode === "Dev Mode" ? (
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

					{!tabTileProps.showDash ? (
						<>
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
						</>
					) : null}
				</div>
			) : null}
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
		toggleDashMode: (dashMode) => dispatch(toggleDashMode(dashMode)),
		toggleDashModeInTab: (tabId, dashMode) => dispatch(toggleDashModeInTab(tabId, dashMode)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(DataViewer);
