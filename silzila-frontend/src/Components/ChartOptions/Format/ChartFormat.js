import React from "react";
import LabelFormatting from "./LabelFormatting";
import TooltipFormat from "./TooltipFormat";
import XAxisFormat from "./XAxisFormat";
import YAxisFormat from "./YAxisFormat";

const ChartFormat = () => {
	return (
		<div className="optionsInfo">
			{/* TODO: Priority 1 - Include formatting in all graphs
			Right now only multiBar chart works */}
			<LabelFormatting />
			<div style={{ borderTop: "1px solid rgb(211,211,211)", margin: "0.5rem 6%" }}></div>

			{/* These two formats can be conditionally rendered for bar, area, line, etc */}
			{/* Donut, Pie, Gauge, Rose & Funnel charts might not have these */}
			<XAxisFormat />
			<div style={{ borderTop: "1px solid rgb(211,211,211)", margin: "0.5rem 6%" }}></div>
			<YAxisFormat />
			<div style={{ borderTop: "1px solid rgb(211,211,211)", margin: "0.5rem 6%" }}></div>
			<TooltipFormat />
		</div>
	);
};

export default ChartFormat;
