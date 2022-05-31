import React from "react";
import LabelFormatting from "./LabelFormatting";
import TooltipFormat from "./TooltipFormat";
import XAxisFormat from "./XAxisFormat";
import YAxisFormat from "./YAxisFormat";

const ChartFormat = ({ chartType }) => {
	return (
		<div className="optionsInfo">
			{/* TODO: Priority 1 - Include formatting in all graphs
			Right now only multiBar chart works */}
			<LabelFormatting />

			{chartType !== "pie" &&
			chartType !== "donut" &&
			chartType !== "gauge" &&
			chartType !== "rose" &&
			chartType !== "crossTab" &&
			chartType !== "funnel" ? (
				<>
					<div
						style={{ borderTop: "1px solid rgb(211,211,211)", margin: "1rem 6% 1rem" }}
					></div>
					<YAxisFormat />
				</>
			) : null}
		</div>
	);
};

export default ChartFormat;
