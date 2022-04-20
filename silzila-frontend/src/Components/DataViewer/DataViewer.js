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
	toggleShowDataViewerBottom,
} from "../../redux/TabTile/actionsTabTile";
import DataViewerMiddle from "./DataViewerMiddle.js";
import DataViewerBottom from "./DataViewerBottom";
import TableViewIcon from "@mui/icons-material/TableView";
import TableRowsIcon from "@mui/icons-material/TableRows";
import TableChartOutlinedIcon from "@mui/icons-material/TableChartOutlined";
import TileRibbon from "../TabsAndTiles/TileRibbon";
import DashBoard from "../DashBoard/DashBoard";
import { MenuItem, Select } from "@mui/material";
import listOfTilesIcon from "../../assets/listoftilesIcon.svg";
import filterIcon from "../../assets/filter_icon.svg";
import dashbordSizeIcon from "../../assets/dashbordSize.svg";

function DataViewer({
	// state
	tabTileProps,

	// dispatch
	showDashBoard,
	toggleColumns,
	toggleDashMode,
	toggleDashModeInTab,
	toggleDataViewerBottom,
}) {
	// const [tabTileProps.showDataViewerBottom, setDisplayDatViewBot] = useState(true);
	const [showListofTileMenu, setShowListofTileMenu] = useState(false);
	const [showFilters, setShowFilters] = useState(false);
	const [dashbordResizeColumn, setDashbordResizeColumn] = useState(false);
	const handleTableDisplayToggle = () => {
		toggleDataViewerBottom(!tabTileProps.showDataViewerBottom);
	};

	const handleColumnsOnlyDisplay = (col) => {
		toggleColumns(col);
	};

	// ===========================================================================================
	//                                      UI Components
	// ===========================================================================================

	const menuStyle = { fontSize: "12px", padding: "2px 8px", margin: 0 };
	const menuIconStyle = { width: "20px", height: "20px", margin: "0px 2px 0px 8px" };
	return (
		<div className="dataViewer">
			<Menu />

			<div className="tabArea">
				<TabRibbon />
				{tabTileProps.showDash ? (
					<div>
						{tabTileProps.dashMode === "Edit" ? (
							<>
								<img
									key="List of Tiles"
									style={menuIconStyle}
									src={listOfTilesIcon}
									alt="List of Tiles"
									onClick={() => {
										if (tabTileProps.dashMode === "Edit") {
											setDashbordResizeColumn(false);
											setShowFilters(false);
											setShowListofTileMenu(!showListofTileMenu);
										}
									}}
									title="List of Tiles"
								/>

								<img
									key="dashBoard Size"
									style={menuIconStyle}
									src={dashbordSizeIcon}
									alt="dashBoard Size"
									onClick={() => {
										if (tabTileProps.dashMode === "Edit") {
											setShowListofTileMenu(false);
											setShowFilters(false);
											setDashbordResizeColumn(!dashbordResizeColumn);
										}
									}}
									title="dashBoard Size"
								/>
							</>
						) : null}
						<img
							key="Filter"
							style={menuIconStyle}
							src={filterIcon}
							alt="Filter"
							onClick={() => {
								setDashbordResizeColumn(false);
								setShowListofTileMenu(false);
								setShowFilters(!showFilters);
							}}
							title="Filter"
						/>
						<Select
							sx={{
								height: "1.5rem",
								fontSize: "12px",
								width: "6rem",
							}}
							value={tabTileProps.dashMode}
							onChange={(e) => {
								console.log(e.target.value);
								toggleDashMode(e.target.value);
								toggleDashModeInTab(tabTileProps.selectedTabId, e.target.value);
							}}
						>
							<MenuItem sx={menuStyle} value="Edit">
								Edit
							</MenuItem>
							<MenuItem sx={menuStyle} value="Present">
								Present
							</MenuItem>
						</Select>
					</div>
				) : null}
			</div>

			{tabTileProps.showDash ? (
				// <DashBoard showDash={tabTileProps.showDash} />
				<DashBoard
					showListofTileMenu={showListofTileMenu}
					showFilters={showFilters}
					dashbordResizeColumn={dashbordResizeColumn}
				/>
			) : (
				<React.Fragment>
					<DataViewerMiddle
						tabId={tabTileProps.selectedTabId}
						tileId={tabTileProps.selectedTileId}
					/>

					{tabTileProps.showDataViewerBottom ? <DataViewerBottom /> : null}
				</React.Fragment>
			)}

			{tabTileProps.dashMode === "Edit" ? (
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
						tabTileProps.showDataViewerBottom ? (
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
									<TableViewIcon style={{ fontSize: "20px" }} />
								</div>
							</>
						) : (
							<div
								className="tableDisplayToggle"
								onClick={handleTableDisplayToggle}
								title="Show / Hide table"
							>
								<TableViewIcon style={{ fontSize: "20px", color: "#808080" }} />
							</div>
						)
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
		toggleDataViewerBottom: (show) => dispatch(toggleShowDataViewerBottom(show)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(DataViewer);
