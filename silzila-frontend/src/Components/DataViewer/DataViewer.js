import React, { useState } from "react";
import "./dataViewer.css";
import { connect } from "react-redux";
import TabRibbon from "../TabsAndTiles/TabRibbon";
import {
	setShowDashBoard,
	toggleColumnsOnlyDisplay,
	toggleShowDataViewerBottom,
} from "../../redux/TabTile/actionsTabTile";
import DataViewerMiddle from "./DataViewerMiddle.js";
import DataViewerBottom from "./DataViewerBottom";
import TableViewIcon from "@mui/icons-material/TableView";
import TableRowsIcon from "@mui/icons-material/TableRows";
import TableChartOutlinedIcon from "@mui/icons-material/TableChartOutlined";
import TileRibbon from "../TabsAndTiles/TileRibbon";
import DashBoard from "../DashBoard/DashBoard";
import listOfTilesIcon from "../../assets/listoftilesIcon.svg";
import dashbordSizeIcon from "../../assets/screenSize.png";
import MenuBar from "./MenuBar";

function DataViewer({
	// state
	tabTileProps,

	// dispatch
	showDashBoard,
	toggleColumns,
	toggleDataViewerBottom,
}) {
	// const [tabTileProps.showDataViewerBottom, setDisplayDatViewBot] = useState(true);

	const [showListofTileMenu, setShowListofTileMenu] = useState(true);
	// const [showFilters, setShowFilters] = useState(false);
	const [dashboardResizeColumn, setDashboardResizeColumn] = useState(false);

	const handleTableDisplayToggle = () => {
		toggleDataViewerBottom(!tabTileProps.showDataViewerBottom);
	};

	const handleColumnsOnlyDisplay = (col) => {
		toggleColumns(col);
	};

	// ===========================================================================================
	//                                      UI Components
	// ===========================================================================================

	const menuIconStyle = {
		width: "26px",
		height: "26px",
		margin: "auto 10px auto 0",
		padding: "2px",
		borderBottom: "2px solid transparent",
	};
	const menuIconSelectedStyle = {
		width: "26px",
		height: "26px",
		margin: "auto 10px auto 0",
		padding: "2px",
		backgroundColor: "#ffffff",
		borderBottom: "2px solid rgb(0,128,255)",
	};

	return (
		<div className="dataViewer">
			<MenuBar from="dataViewer" />
			<div className="tabArea">
				<TabRibbon />
				{tabTileProps.showDash ? (
					<div style={{ display: "flex", alignItems: "center" }}>
						{tabTileProps.dashMode === "Edit" ? (
							<>
								<img
									key="List of Tiles"
									style={
										showListofTileMenu ? menuIconSelectedStyle : menuIconStyle
									}
									src={listOfTilesIcon}
									alt="List of Tiles"
									onClick={() => {
										if (tabTileProps.dashMode === "Edit") {
											setDashboardResizeColumn(false);
											setShowListofTileMenu(!showListofTileMenu);
										}
									}}
									title="List of Tiles"
								/>

								<img
									key="dashBoard Size"
									style={
										dashboardResizeColumn
											? menuIconSelectedStyle
											: menuIconStyle
									}
									src={dashbordSizeIcon}
									alt="dashBoard Size"
									onClick={() => {
										if (tabTileProps.dashMode === "Edit") {
											setShowListofTileMenu(false);
											setDashboardResizeColumn(!dashboardResizeColumn);
										}
									}}
									title="DashBoard Size"
								/>
							</>
						) : null}
						{/* <img
							key="Filter"
							style={menuIconStyle}
							src={filterIcon}
							alt="Filter"
							onClick={() => {
								setDashboardResizeColumn(false);
								setShowListofTileMenu(false);
								setShowFilters(!showFilters);
							}}
							title="Filter"
						/> */}
					</div>
				) : null}
			</div>

			{tabTileProps.showDash ? (
				// <DashBoard showDash={tabTileProps.showDash} />
				<DashBoard
					showListofTileMenu={showListofTileMenu}
					// showFilters={showFilters}
					dashboardResizeColumn={dashboardResizeColumn}
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
							onClick={() => showDashBoard(tabTileProps.selectedTabId, true)}
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
		toggleDataViewerBottom: (show) => dispatch(toggleShowDataViewerBottom(show)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(DataViewer);
