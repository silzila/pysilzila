import React, { useState } from "react";

const InputNumber = ({ value, updateValue }) => {
	const [inputValue, setInputValue] = useState(value);

	const checkInput = (inputValue) => {
		console.log(inputValue);

		if (Number.isInteger(20)) console.log("20 is Integer");
		if (Number.isInteger(Number(inputValue))) {
			console.log("Update to redux");
			updateValue(Number(inputValue));
		} else {
			console.log("Not a number");
			setInputValue(" ");
		}
	};
	return (
		<form
			style={{ margin: "0 10px" }}
			onSubmit={(evt) => {
				evt.currentTarget.querySelector("input").blur();
				evt.preventDefault();
				// checkInput();
			}}
		>
			<input
				autoFocus
				className="inputValue"
				type="text"
				value={inputValue}
				onBlur={() => checkInput(inputValue)}
				onChange={(e) => {
					setInputValue(e.target.value);
				}}
			/>
		</form>
	);
};

export default InputNumber;
