import React, { useEffect, useState } from "react";
import { registerMap } from "echarts";
import ReactEcharts from "echarts-for-react";
import { connect, useSelector } from "react-redux";

import worldMap from "./Data/world_low_res.json";

import indiaMap from "./Data/india1_gadm.json";
import germanyMap from "./Data/germany1_gadm.json";
import usa1Map from "./Data/usa1_gadm.json";
import chinaMap from "./Data/china1_gadm.json";
import franceMap from "./Data/france1_gadm.json";
import ukMap from "./Data/uk1_gadm.json";
import japanMap from "./Data/japan1_gadm.json";
import southAfricaMap from "./Data/southAfrica1_gadm.json";
import nigeriaMap from "./Data/nigeria1_gadm.json";
import brazilMap from "./Data/brazil1_gadm.json";

import countryCodes from "./Data/country-codes.json";
import indiaCodes from "./Data/india-codes.json";
import usaCodes from "./Data/usa-codes.json";

var usaAcc = {
	Alaska: {
		left: -131,
		top: 25,
		width: 15,
	},
	Hawaii: {
		left: -110,
		top: 25,
		width: 10,
	},
	"Puerto Rico": {
		left: -76,
		top: 26,
		width: 2,
	},
};

const GeoChart = ({
	// props
	propKey,
	graphDimension,
	chartArea,
	graphTileSize,

	// state
	chartProp,
	chartControls,
}) => {
	var locAggregator = chartProp.properties[propKey].chartAxes[1].fields[0]
		? chartProp.properties[propKey].chartAxes[1].fields[0].agg
		: "";
	console.log(locAggregator);

	var chartControl = chartControls.properties[propKey];
	let chartData = chartControl.chartData ? chartControl.chartData.result : "";

	const geoLocation = useSelector(
		(state) => state.chartProperties.properties[propKey].geoLocation
	);

	var formattedData = [];
	var dataValues = []; // used for computing min max values

	var dataKeys = chartData && Object.keys(chartData[0]);
	// console.log(dataKeys);
	chartData &&
		chartData.forEach((dt) => {
			dataValues.push(dt[dataKeys[1]]);

			switch (geoLocation) {
				case "india":
					var indObj = indiaCodes.filter(
						(obj) => obj[locAggregator] === dt[dataKeys[0]]
					)[0];
					if (indObj) {
						// console.log(indObj);
						var indiaData = { name: indObj.stateName, value: dt[dataKeys[1]] };
						formattedData.push(indiaData);
					}
					break;

				case "usa":
					var usaObj = usaCodes.filter(
						(obj) => obj[locAggregator] === dt[dataKeys[0]]
					)[0];
					// console.log(usaObj);
					if (usaObj) {
						var usaData = { name: usaObj.stateName, value: dt[dataKeys[1]] };
						formattedData.push(usaData);
					}
					break;

				case "world":
				default:
					var cntrObj = countryCodes.filter(
						(obj) => obj[locAggregator] === dt[dataKeys[0]]
					)[0];

					if (cntrObj) {
						var cntData = { name: cntrObj.shortName, value: dt[dataKeys[1]] };
						formattedData.push(cntData);
					} else {
						console.log("Unmatched location", dt[dataKeys[0]]);
					}
					break;
			}
		});

	const [minMax, setMinMax] = useState({ min: 0, max: 1 });

	useEffect(() => {
		if (chartData) {
			console.log("Setting min max");
			var min = Math.min.apply(null, dataValues);
			var max = Math.max.apply(null, dataValues);
			setMinMax({ min, max });
		}
	}, [chartData]);

	// console.log(formattedData);

	const selectedAreaMap = {
		usa: usa1Map,
		world: worldMap,
		india: indiaMap,
		germany: germanyMap,
		china: chinaMap,
		france: franceMap,
		uk: ukMap,
		japan: japanMap,
		southAfrica: southAfricaMap,
		nigeria: nigeriaMap,
		brazil: brazilMap,
	};

	registerMap(geoLocation, selectedAreaMap[geoLocation], geoLocation === "usa" ? usaAcc : null);

	return (
		<>
			<ReactEcharts
				style={{
					padding: "1rem",
					width: graphDimension.width,
					height: graphDimension.height,
					overflow: "hidden",
					margin: "auto",
					border: chartArea
						? "none"
						: graphTileSize
						? "none"
						: "1px solid rgb(238,238,238)",
				}}
				option={{
					tooltip: {
						show: chartControl.mouseOver.enable,
						trigger: "item",
						formatter: (value) => {
							console.log(value);
							console.log(value.value, value.name, chartControl.mouseOver.formatter);

							if (!isNaN(value.value)) {
								switch (chartControl.mouseOver.formatter) {
									case "value":
										return value.value.toString();

									case "location":
										return value.name;

									case "both":
										return `${value.name} : ${value.value}`;

									case "none":
										return "";
								}
							} else {
								switch (chartControl.mouseOver.formatter) {
									case "both":
									case "location":
										return value.name;

									case "value":
									case "none":
										return "";
								}
							}
						},
					},

					visualMap: {
						min:
							chartControl.colorScaleGeo.colorScaleType === "Manual"
								? chartControl.colorScaleGeo.min !== ""
									? parseInt(chartControl.colorScaleGeo.min)
									: 0
								: minMax.min,
						max:
							chartControl.colorScaleGeo.colorScaleType === "Manual"
								? chartControl.colorScaleGeo.max !== ""
									? parseInt(chartControl.colorScaleGeo.max)
									: 0
								: minMax.max,
						text: ["High", "Low"],
						realtime: false,
						calculable: true,
						inRange: {
							color: [
								chartControl.colorScaleGeo.minColor,
								chartControl.colorScaleGeo.maxColor,
							],
						},
					},

					series: [
						{
							name: "foo",
							type: "map",
							map: geoLocation,
							geoIndex: 0,
							data: formattedData,
							nameProperty: "NAME_1",
							// roam: true,
							label: {
								show: chartControl.labelOptions.showLabel,
								fontSize: chartControl.labelOptions.fontSize,
								color: chartControl.labelOptions.labelColorManual
									? chartControl.labelOptions.labelColor
									: null,
								rotate: chartControl.labelOptions.geoRotation,
								position: "bottom",
								formatter: (value) => {
									if (!isNaN(value.value)) {
										switch (chartControl.labelOptions.geoFormatter) {
											case "value":
												return value.value;

											case "location":
												return value.name;

											case "both":
												return `${value.name} : ${value.value}`;

											case "none":
												return "";
										}
									} else {
										switch (chartControl.labelOptions.geoFormatter) {
											case "location":
												return value.name;

											case "both":
											case "none":
											case "value":
												return "";
										}
									}
								},
							},
							zoom: 1,
							selectedMode: "single",
						},
					],
				}}
			/>
		</>
	);
};

const mapStateToProps = (state) => {
	return {
		chartProp: state.chartProperties,
		chartControls: state.chartControls,
	};
};

export default connect(mapStateToProps, null)(GeoChart);
