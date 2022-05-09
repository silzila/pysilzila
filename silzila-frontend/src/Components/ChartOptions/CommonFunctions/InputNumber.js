import React, { useState } from "react";

const InputNumber = ({ value, updateValue, disabled }) => {
	const [inputValue, setInputValue] = useState(value);

	const checkInput = (inputValue) => {
		if (Number.isInteger(Number(inputValue))) {
			updateValue(Number(inputValue));
		} else {
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
				disabled={disabled}
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
