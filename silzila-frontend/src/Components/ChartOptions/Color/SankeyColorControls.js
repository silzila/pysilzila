import { FormControl, InputLabel, MenuItem, Popover, Select, Switch } from "@mui/material";
import React, { useEffect, useState } from "react";
import { SketchPicker } from "react-color";
import { connect } from "react-redux";
import { updateSankeyStyleOptions } from "../../../redux/ChartProperties/actionsChartControls";
import SliderWithInput from "../SliderWithInput";
import { ColorSchemes } from "./ColorScheme";

const SankeyColorControls = ({
	// state
	chartProp,
	tabTileProps,
	chartProperties,

	// dispatch
	updateSankeyStyleOptions,
}) => {
	var propKey = `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`;
	let chartData = chartProp.properties[propKey].chartData
		? chartProp.properties[propKey].chartData.result
		: "";

	var colorSchemes = ColorSchemes[6].colors;

	const [isColorPopoverOpen, setColorPopOverOpen] = useState(false);
	const [selectedItem, setSelectedItem] = useState("");
	const [dims, setdims] = useState([]);
	const [indexOfNode, setindexOfNode] = useState();
	const [nameOfNode, setnameOfNode] = useState();

	useEffect(() => {
		if (chartData) {
			if (chartProp.properties[propKey].sankeyControls.nodesAndColors.length === 0) {
				let values = [];
				values = chartProperties.properties[propKey].chartAxes[1].fields.map((el, i) => {
					console.log(i);
					return { nodeName: el.fieldname, nodeColor: colorSchemes[i] };
				});
				setdims(values);
				console.log("🚀 ~ file: SankeyColorControls.js ~ line 30 ~ useEffect ~ dims", dims);
				updateSankeyStyleOptions(propKey, "nodesAndColors", values);
			} else {
				setdims(chartProp.properties[propKey].sankeyControls.nodesAndColors);
			}
		}
	}, [chartData]);

	const renderNodesAndColors = () => {
		console.log(dims);
		if (dims.length !== 0) {
			return dims.map((item, i) => {
				return (
					<div className="optionDescription">
						<label style={{ width: "40%" }}>{item.nodeName}</label>
						<div
							style={{
								height: "1.25rem",
								width: "50%",
								marginLeft: "20px",
								backgroundColor: item.nodeColor,
								color: item.nodeColor,
								border: "2px solid darkgray",
								margin: "auto",
							}}
							onClick={e => {
								setSelectedItem("nodeColor");
								setindexOfNode(i);
								setnameOfNode(item.nodeName);
								setColorPopOverOpen(!isColorPopoverOpen);
							}}
						></div>
					</div>
				);
			});
		}
	};

	const setColorsToIndNodes = color => {
		var values = chartProp.properties[propKey].sankeyControls.nodesAndColors;
		values = values.map((el, i) => {
			if (el.nodeName === nameOfNode && i === indexOfNode) {
				el.nodeColor = color;
			}
			return el;
		});

		updateSankeyStyleOptions(propKey, "nodesAndColors", values);
	};

	return (
		<div className="optionsInfo">
			<div>{renderNodesAndColors()}</div>
			<div
				style={{ borderTop: "1px solid rgb(211,211,211)", margin: "0.5rem 6% 1rem" }}
			></div>
			<div className="optionDescription">
				<label style={{ width: "40%" }}>Link Color</label>
				<div
					style={{
						height: "1.25rem",
						width: "50%",
						marginLeft: "20px",
						backgroundColor: chartProp.properties[propKey].sankeyControls.linkColor,
						color: chartProp.properties[propKey].sankeyControls.linkColor,
						border: "2px solid darkgray",
						margin: "auto",
					}}
					onClick={e => {
						setSelectedItem("linkColor");
						setColorPopOverOpen(!isColorPopoverOpen);
					}}
				></div>
			</div>
			<Popover
				open={isColorPopoverOpen}
				onClose={() => setColorPopOverOpen(false)}
				onClick={() => setColorPopOverOpen(false)}
				anchorReference="anchorPosition"
				anchorPosition={{ top: 350, left: 1300 }}
			>
				<div>
					<SketchPicker
						color={chartProp.properties[propKey].sankeyControls[selectedItem]}
						className="sketchPicker"
						width="16rem"
						styles={{ padding: "0" }}
						onChangeComplete={color => {
							if (selectedItem === "linkColor") {
								updateSankeyStyleOptions(propKey, selectedItem, color.hex);
							} else {
								setColorsToIndNodes(color.hex);
							}
						}}
						onChange={color => {
							if (selectedItem === "linkColor") {
								updateSankeyStyleOptions(propKey, selectedItem, color.hex);
							} else {
								setColorsToIndNodes(color.hex);
							}
						}}
						disableAlpha
					/>
				</div>
			</Popover>
		</div>
	);
};

const mapStateToProps = state => {
	return {
		chartProp: state.chartControls,
		tabTileProps: state.tabTileProps,
		chartProperties: state.chartProperties,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		updateSankeyStyleOptions: (propKey, option, value) =>
			dispatch(updateSankeyStyleOptions(propKey, option, value)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(SankeyColorControls);
