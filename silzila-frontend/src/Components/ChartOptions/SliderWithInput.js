// This is a slider component, with option to input values.
// Used in many chart control options

import { Slider } from "@mui/material";
import React, { useState } from "react";
import "./SliderWithInput.css";
import { debounce } from "lodash";

const SliderWithInput = ({
	sliderValue,
	sliderMinMax,
	changeValue,
	percent,
	degree,
	pointNumbers,
}) => {
	// console.log( sliderMinMax);

	const [showInputText, setShowInputText] = useState(false);
	return (
		<div className="sliderWithInput">
			{showInputText ? (
				<form
					onSubmit={evt => {
						evt.currentTarget.querySelector("input").blur();
						evt.preventDefault();
					}}
				>
					<input
						autoFocus
						className="inputValue"
						type="number"
						value={sliderValue}
						onBlur={() => setShowInputText(false)}
						onChange={e => {
							changeValue(Number(e.target.value));
						}}
					/>
				</form>
			) : (
				<span
					className="textValue"
					onClick={e => {
						// console.log(e.target);
						setShowInputText(true);
					}}
					title="Click to edit value"
				>
					{percent ? (
						`${sliderValue} %`
					) : degree ? (
						<span>{sliderValue} &#176;</span>
					) : pointNumbers ? (
						<span>{sliderValue}</span>
					) : (
						`${sliderValue} px`
					)}
				</span>
			)}
			<Slider
				sx={{
					flex: 3,
					height: "5px",
					alignSelf: "center",
					margin: "0px 4px 0px 2px",
					color: "rgb(157, 156, 156)",
					"& .MuiSlider-thumb": {
						boxShadow: "0 1px 2px 1px rgba(0,0,0,0.1)",

						height: "13px",
						width: "13px",
					},
				}}
				min={sliderMinMax.min}
				max={sliderMinMax.max}
				step={sliderMinMax.step}
				value={sliderValue}
				onChange={e => {
					changeValue(Number(e.target.value));
				}}
				title={sliderValue}
			/>
			{/* <input
				// className="inputRange"
				// style={{ backgroundColor: "red", color: "red", fill: "red", background: "red" }}
				type="range"
				min={sliderMinMax.min}
				max={sliderMinMax.max}
				step={sliderMinMax.step}
				value={sliderValue}
				onInput={(e) => {
					changeValue(Number(e.target.value));
				}}
				title={sliderValue}
			/> */}
		</div>
	);
};

export default SliderWithInput;
