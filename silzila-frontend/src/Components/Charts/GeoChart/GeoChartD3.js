import React, { useEffect, useRef, useState } from "react";
import { geoEquirectangular, geoMercator, geoPath, max, min, scaleLinear, select } from "d3";
import data from "./Data/world_low_res.json";
import data2 from "./Data/world_med_res.json";
import worldMap from "./Data/countries.json";
import usaMap from "./Data/USA.json";
import indiaMap from "./Data/india.json";
import "./geoMap.css";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const GeoChartD3 = ({
	// props
	propKey,
	graphDimension,
	chartArea,
	graphTileSize,
}) => {
	const svgRef = useRef();
	const wrapperRef = useRef();

	const [selectedArea, setSelectedArea] = useState("world");

	const selectedAreaMap = {
		// usa: usaMap,
		world: worldMap,
		india: indiaMap,
	};

	console.log(selectedArea);
	console.log(selectedAreaMap[selectedArea]);

	var property = "state_code";

	const [selectedCountry, setSelectedCountry] = useState(null);

	useEffect(() => {
		const svg = select(svgRef.current);
		console.log(svg);
		console.log(
			svg.selectAll(".country").data(selectedAreaMap[selectedArea].features).join("path")
		);

		const minProp = min(
			selectedAreaMap[selectedArea].features,
			(feature) => feature.properties[property]
		);
		const maxProp = max(
			selectedAreaMap[selectedArea].features,
			(feature) => feature.properties[property]
		);

		const colorScale = scaleLinear().domain([minProp, maxProp]).range(["green", "red"]);

		const { width, height } = wrapperRef.current.getBoundingClientRect();

		const projection = geoEquirectangular().fitSize(
			[width, height],
			selectedCountry || selectedAreaMap[selectedArea]
		);
		const pathGenerator = geoPath().projection(projection);

		svg.selectAll(".country")
			.data(selectedAreaMap[selectedArea].features)
			.join("path")
			.on("click", (event, feature) => {
				console.log(feature);
				setSelectedCountry(selectedCountry === feature ? null : feature);
			})
			.attr("class", "country")
			.transition()
			.attr("fill", (feature) => colorScale(feature.properties[property]))
			.attr("d", (feature) => pathGenerator(feature));

		svg.selectAll(".label")
			.data([selectedCountry])
			.join("text")
			.attr("class", "label")
			.text((feature) => feature && feature.properties.NAME)
			.attr("x", 10)
			.attr("y", 20);

		// svg.selectAll(".country")
		// 	.data(data2.features)
		// 	.join("path")
		// 	.attr("class", "country")
		// 	.transition()
		// 	.attr("fill", (feature) => colorScale(feature.properties[property]))
		// 	.attr("d", (feature) => pathGenerator(feature));
	}, [data, graphDimension, selectedCountry, selectedArea]);
	return (
		<>
			<FormControl size="small" sx={{ width: "16rem", margin: "0.5rem" }}>
				<InputLabel>Select Map</InputLabel>
				<Select
					label="Select Map"
					value={selectedArea}
					onChange={(e) => {
						setSelectedArea(e.target.value);
					}}
				>
					<MenuItem value="world">World</MenuItem>
					<MenuItem value="india">India</MenuItem>
					{/* <MenuItem value="usa">USA</MenuItem> */}
				</Select>
			</FormControl>
			<div
				ref={wrapperRef}
				style={{
					padding: "1rem",
					width: graphDimension.width,
					height: graphDimension.height - 80,
					overflow: "hidden",
					margin: "auto",
					border: chartArea
						? "none"
						: graphTileSize
						? "none"
						: "1px solid rgb(238,238,238)",
				}}
			>
				<svg
					style={{ height: "100%", width: "100%", backgroundColor: "white" }}
					ref={svgRef}
				></svg>
			</div>
		</>
	);
};

export default GeoChartD3;
