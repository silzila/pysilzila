import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import ChartAxes from "../ChartAxes/ChartAxes";
import GraphArea from "../GraphArea/GraphArea";
import "./dataViewerMiddle.css";
import chartControlIcon from "../../assets/chart-control-icon.svg";
import settingsIcon from "../../assets/charts_theme_settings_icon.svg";
import FilterIcon from "../../assets/filter_icon.svg";
import ChartControlObjects from "../ChartOptions/ChartControlObjects";
import ControlDetail from "../ChartOptions/ControlDetail";
import ChartTypes from "../ChartOptions/ChartTypes";
import { setSelectedControlMenu } from "../../redux/TabTile/actionsTabTile";

const DataViewerMiddle = ({
	// props
	tabId,
	tileId,

	// state
	chartProp,
	tabTileProps,

	// dispatch
	setMenu,
}) => {
	var propKey = `${tabId}.${tileId}`;
	const rmenu = [
		{ name: "Charts", icon: chartControlIcon },
		{ name: "Chart controls", icon: settingsIcon },
		// { name: "Filter", icon: FilterIcon },
	];

	// const [tabTileProps.selectedControlMenu, setMenu] = useState("");

	const renderMenu = rmenu.map((rm) => {
		return (
			<img
				key={rm.name}
				className={
					rm.name === tabTileProps.selectedControlMenu
						? "controlsIcon selectedIcon"
						: "controlsIcon"
				}
				src={rm.icon}
				alt={rm.name}
				onClick={() => {
					if (tabTileProps.selectedControlMenu === rm.name) {
						setMenu("");
					} else {
						setMenu(rm.name);
					}
				}}
				title={rm.name}
			/>
		);
	});

	const controlDisplayed = () => {
		switch (tabTileProps.selectedControlMenu) {
			case "Charts":
				return (
					<div className="rightColumnControlsAndFilters">
						<div className="axisTitle">Charts</div>
						<ChartTypes propKey={propKey} />
					</div>
				);

			case "Chart controls":
				return (
					<div className="rightColumnControlsAndFilters">
						<div className="axisTitle">Charts Controls</div>
						<ChartControlObjects />
						<ControlDetail />
					</div>
				);

			case "Filter":
				return (
					<div className="rightColumnControlsAndFilters">
						<div className="axisTitle">Filters</div>
					</div>
				);
			default:
				return null;
		}
	};

	return (
		<div className="dataViewerMiddle">
			<ChartAxes tabId={tabId} tileId={tileId} />

			<GraphArea />

			<div className="rightColumn">
				{controlDisplayed()}
				<div className="rightColumnMenu">{renderMenu}</div>
			</div>
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		chartProp: state.chartProperties,
		tabTileProps: state.tabTileProps,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		setMenu: (menu) => dispatch(setSelectedControlMenu(menu)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(DataViewerMiddle);
