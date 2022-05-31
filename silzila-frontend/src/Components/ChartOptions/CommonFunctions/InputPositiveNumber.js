import React, { useEffect, useState } from "react";

const InputPositiveNumber = ({ value, updateValue, disabled }) => {
	const [inputValue, setInputValue] = useState(value);

	useEffect(() => {
		checkInput();
	}, [inputValue]);

	const checkInput = () => {
		if (Number.isInteger(Number(inputValue))) {
			updateValue(Number(inputValue));
		} else {
			setInputValue("");
		}
	};
	return (
		<form
			style={{ margin: "0 10px" }}
			onSubmit={(evt) => {
				evt.currentTarget.querySelector("input").blur();
				evt.preventDefault();
			}}
		>
			<input
				disabled={disabled}
				autoFocus
				className="inputValue"
				type="number"
				value={inputValue}
				onBlur={() => checkInput(inputValue)}
				onChange={(e) => {
					if (Number(e.target.value) >= 0) setInputValue(e.target.value);
					else setInputValue(0);
				}}
			/>
		</form>
	);
};

export default InputPositiveNumber;
