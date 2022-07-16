import React, { useEffect, useState } from "react";
import { registerMap } from "echarts";
import ReactEcharts from "echarts-for-react";
import worldMap from "./Data/world_low_res.json";
import usaMap from "./Data/USA.json";
import indiaMap from "./Data/india.json";
import hongKongMap from "./Data/HongKong.json";
import { usaData, indiaData } from "../data";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { connect, useSelector } from "react-redux";

var usaAcc = {
	Alaska: {
		left: -131,
		top: 25,
		width: 15,
	},
	Hawaii: {
		left: -110,
		top: 25,
		width: 5,
	},
	"Puerto Rico": {
		left: -76,
		top: 26,
		width: 2,
	},
};

var locationCodesMapping = {
	world: { name: "name", iso2: "", iso3: "", isoNum: "" },
	india: { name: "name", iso2: "", iso3: "", isoNum: "" },
	usa: { name: "name", iso2: "", iso3: "", isoNum: "" },
};

// // "scalerank": 1,
// // "featurecla": "Admin-0 country",
// // "labelrank": 2,
// // "sovereignt": "India",
// // "sov_a3": "IND",
// // "adm0_dif": 0,
// // "level": 2,
// // "type": "Sovereign country",
// "admin": "India",
// // "adm0_a3": "IND",
// // "geou_dif": 0,
// // "geounit": "India",
// // "gu_a3": "IND",
// // "su_dif": 0,
// // "subunit": "India",
// // "su_a3": "IND",
// // "brk_diff": 0,
// "name": "India",
// "name_long": "India",
// // "brk_a3": "IND",
// // "brk_name": "India",
// // "brk_group": null,
// "abbrev": "India",
// // "postal": "IND",
// "formal_en": "Republic of India",
// // "formal_fr": null,
// // "note_adm0": null,
// // "note_brk": null,
// // "name_sort": "India",
// // "name_alt": null,
// // "mapcolor7": 1,
// // "mapcolor8": 3,
// // "mapcolor9": 2,
// // "mapcolor13": 2,
// // "pop_est": 1166079220,
// // "gdp_md_est": 3297000,
// // "pop_year": -99,
// // "lastcensus": 2011,
// // "gdp_year": -99,
// // "economy": "3. Emerging region: BRIC",
// // "income_grp": "4. Lower middle income",
// // "wikipedia": -99,
// // "fips_10": null,
// "iso_a2": "IN",
// "iso_a3": "IND",
// "iso_n3": "356",
// // "un_a3": "356",
// // "wb_a2": "IN",
// // "wb_a3": "IND",
// // "woe_id": -99,
// // "adm0_a3_is": "IND",
// // "adm0_a3_us": "IND",
// // "adm0_a3_un": -99,
// // "adm0_a3_wb": -99,
// "continent": "Asia",
// // "region_un": "Asia",
// "subregion": "Southern Asia",
// "region_wb": "South Asia",
// // "name_len": 5,
// // "long_len": 5,
// // "abbrev_len": 5,
// // "tiny": -99,
// // "homepart": 1,
// // "filename": "IND.geojson"

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
	// var locAggregator = chartProp.properties[propKey].chartAxes[1].fields[0].agg;
	// console.log(locAggregator);

	var chartControl = chartControls.properties[propKey];
	let chartData = chartControl.chartData ? chartControl.chartData.result : "";
	console.log(chartData);

	const geoLocation = useSelector(
		(state) => state.chartProperties.properties[propKey].geoLocation
	);

	// console.log(worldCovidData);
	var formattedData = [];
	var dataValues = [];
	var dataKeys = chartData && Object.keys(chartData[0]);
	console.log(dataKeys);
	chartData &&
		chartData.forEach((dt) => {
			var cntData = { name: dt[dataKeys[0]], value: dt[dataKeys[1]] };
			formattedData.push(cntData);
			dataValues.push(dt[dataKeys[1]]);
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

	console.log(formattedData);

	const selectedAreaMap = {
		usa: usaMap,
		world: worldMap,
		india: indiaMap,
		hongKong: hongKongMap,
	};

	registerMap(geoLocation, selectedAreaMap[geoLocation], geoLocation === "usa" ? usaAcc : null);

	// Get first three features from geomap
	var geoFeature = selectedAreaMap[geoLocation].features.slice(0, 3);

	// Get properties of first three features in a new array
	var geoProperties = [];
	geoFeature.forEach((ftr) => {
		geoProperties.push(ftr.properties);
	});
	console.log(geoProperties);

	// Get all the key values of a geoProperty
	var unfilteredGeoPropKeys = Object.keys(geoProperties[0]);
	unfilteredGeoPropKeys.forEach((key) => {
		var tempPropValuesArray = [];
		tempPropValuesArray.push(geoProperties[0][key]);
		tempPropValuesArray.push(geoProperties[1][key]);
		tempPropValuesArray.push(geoProperties[2][key]);
		// console.log(key, tempPropValuesArray);
		let unique = [...new Set(tempPropValuesArray)];
		if (unique.length > 1) {
			console.log(key, unique);
		}
	});

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
					geo: {
						map: geoLocation,
						selectMode: "multiple",
						roam: true,
						zoom: 1.2,
						itemStyle: {},
						zlevel: 1,
						// regions: { emphasis: { itemStyle: { areaColor: "red" } } },
					},

					tooltip: {
						trigger: "item",
						formatter: "{b}<br/>{c} ",
					},

					visualMap: {
						min: minMax.min,
						max: minMax.max,
						text: ["High", "Low"],
						realtime: false,
						calculable: true,
						inRange: {
							color: ["#22c1c3", "#155799"],
						},
					},

					series: [
						{
							name: "foo",
							type: "map",
							geoIndex: 0,
							label: { show: true },
							data: formattedData,

							zlevel: 3,
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
