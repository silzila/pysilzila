import React from "react";
import { useDrop } from "react-dnd";
import { connect } from "react-redux";
import { editChartPropItem } from "../../redux/ChartProperties/actionsChartProperties";
import Card from "./Card";
import ChartsInfo from "./ChartsInfo2";
import { setPrefix } from "./SetPrefix";

const DropZone = ({
	// props
	bIndex,
	name,
	propKey,

	// state
	token,
	tabTileProps,
	chartProp,

	// dispatch
	updateDropZoneItems,
	moveItemChartProp,
}) => {
	const [, drop] = useDrop({
		accept: "card",
		drop: (item) => handleDrop(item, bIndex),
		collect: (monitor) => ({
			isOver: monitor.isOver(),
			canDrop: monitor.canDrop(),
		}),
	});

	const uIdGenerator = () => {
		return Math.floor((1 + Math.random()) * 0x10000)
			.toString(16)
			.substring(1);
	};

	var chartType = chartProp.properties[propKey].chartType;

	const handleDrop = (item, bIndex) => {
		var allowedNumbers = ChartsInfo[chartType].dropZones[bIndex].allowedNumbers;

		if (item.bIndex === 99) {
			const uID = uIdGenerator();
			var fieldData = item.fieldData;
			fieldData.uId = uID;

			var newFieldData = JSON.parse(JSON.stringify(setPrefix(fieldData, name, chartType)));

			updateDropZoneItems(propKey, bIndex, newFieldData, allowedNumbers);
		} else if (item.bIndex !== bIndex) {
			var newFieldData = JSON.parse(JSON.stringify(setPrefix(item, name, chartType)));
			["type", "bIndex"].forEach((e) => delete newFieldData[e]);
			moveItemChartProp(propKey, item.bIndex, item.uId, newFieldData, bIndex, allowedNumbers);
		}
	};

	return bIndex === 0 ? null : (
		<div ref={drop} className="chartAxis mt-2">
			<span className="axisTitle">{name}</span>

			{bIndex === 0 ? (
				<span className="axisInfo">
					{" "}
					Drop (0 - max {ChartsInfo[chartType].dropZones[bIndex].allowedNumbers}) field(s)
					here
				</span>
			) : null}
			{bIndex === 1 && ChartsInfo[chartType].dropZones[bIndex].allowedNumbers === 1 ? (
				<span className="axisInfo"> Drop (1) field(s) here</span>
			) : null}
			{bIndex === 1 && ChartsInfo[chartType].dropZones[bIndex].allowedNumbers > 1 ? (
				<span className="axisInfo">
					{" "}
					Drop (atleast {ChartsInfo[chartType].dropZones[bIndex].min} - max{" "}
					{ChartsInfo[chartType].dropZones[bIndex].allowedNumbers}) field(s) here
				</span>
			) : null}
			{bIndex === 2 && ChartsInfo[chartType].dropZones[bIndex].allowedNumbers === 1 ? (
				<span className="axisInfo"> Drop (1) field(s) here</span>
			) : null}
			{bIndex === 2 && ChartsInfo[chartType].dropZones[bIndex].allowedNumbers > 1 ? (
				<span className="axisInfo">
					{" "}
					Drop (atleast {ChartsInfo[chartType].dropZones[bIndex].min} - max{" "}
					{ChartsInfo[chartType].dropZones[bIndex].allowedNumbers}) field(s) here
				</span>
			) : null}
			{bIndex === 3 && ChartsInfo[chartType].dropZones[bIndex].allowedNumbers === 1 ? (
				<span className="axisInfo"> Drop (1) field(s) here</span>
			) : null}

			{chartProp.properties[propKey].chartAxes[bIndex].fields.map((field, index) => (
				<Card
					field={field}
					bIndex={bIndex}
					axisTitle={name}
					key={index}
					itemIndex={index}
					propKey={propKey}
				/>
			))}
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		tabTileProps: state.tabTileProps,
		chartProp: state.chartProperties,
		token: state.isLogged.access_token,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		updateDropZoneItems: (propKey, bIndex, item, allowedNumbers) =>
			dispatch(
				editChartPropItem({
					action: "update",
					details: { propKey, bIndex, item, allowedNumbers },
				})
			),

		moveItemChartProp: (propKey, fromBIndex, fromUID, item, toBIndex, allowedNumbers) =>
			dispatch(
				editChartPropItem({
					action: "move",
					details: { propKey, fromBIndex, fromUID, item, toBIndex, allowedNumbers },
				})
			),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(DropZone);
