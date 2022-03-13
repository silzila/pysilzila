import React from "react";
import { useDrop } from "react-dnd";
import { connect } from "react-redux";
import { editChartPropItem } from "../../redux/ChartProperties/actionsChartProps";
import Card from "./Card";
import ChartsInfo from "./ChartsInfo2";
import { setPrefix } from "./SetPrefix";

const Dustbin = ({
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
		console.log("Item Dropped", item, bIndex);

		var allowedNumbers = ChartsInfo[chartType].dropZones[bIndex].allowedNumbers;
		console.log("Allowed Numbers", allowedNumbers);

		if (item.bIndex === 99) {
			console.log("-------moving item from outside------");

			const uID = uIdGenerator();
			var fieldData = item.fieldData;
			console.log(fieldData);
			fieldData.uId = uID;
			console.log(fieldData);

			var newFieldData = JSON.parse(JSON.stringify(setPrefix(fieldData, name, chartType)));
			console.log(newFieldData);

			updateDropZoneItems(propKey, bIndex, newFieldData, allowedNumbers);
		}
	};

	return (
		<div ref={drop} className="chartAxis mt-2">
			<span className="axisTitle">{name}</span>

			<i>
				{bIndex === 0 ? <span className="axisInfo"> Drop (1) field(s) here</span> : null}
				{bIndex === 1 && ChartsInfo[chartType].dropZones[bIndex].allowedNumbers === 1 ? (
					<span className="axisInfo"> Drop (1) field(s) here</span>
				) : null}
				{bIndex === 1 && ChartsInfo[chartType].dropZones[bIndex].allowedNumbers > 1 ? (
					<span className="axisInfo">
						{" "}
						Drop (atleast 1 - max{" "}
						{ChartsInfo[chartType].dropZones[bIndex].allowedNumbers}) field(s) here
					</span>
				) : null}
				{bIndex === 2 ? (
					<span className="axisInfo">
						{" "}
						Drop (0 - max {ChartsInfo[chartType].dropZones[bIndex].allowedNumbers})
						field(s) here
					</span>
				) : null}
			</i>

			{chartProp.properties[propKey].chartAxes[bIndex].fields.map(
				({ fieldname, displayname, datatype, prefix, uId }, index) => (
					// <div> {fieldname} </div>
					<Card
						uId={uId}
						fieldname={fieldname}
						displayname={displayname}
						datatype={datatype}
						prefix={prefix}
						bIndex={bIndex}
						key={index}
						itemIndex={index}
						propKey={propKey}
					/>
				)
			)}
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		tabTileProps: state.tabTileProps,
		chartProp: state.chartPropsLeft,
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
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Dustbin);
