import { Button } from "@mui/material";
import { useCallback } from "react";
import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { connect, useDispatch } from "react-redux";
import { updateRichText } from "../../redux/ChartProperties/actionsChartControls";
import { debounce } from "../ChartOptions/CommonFunctions/DebounceFunction";

const modules = {
	toolbar: [
		[{ font: [] }],
		[{ header: [1, 2, 3, 4, 5, 6, false] }],
		["bold", "italic", "underline", "strike"],
		[{ color: [] }, { background: [] }],
		[{ script: "sub" }, { script: "super" }],
		["blockquote", "code-block"],
		[{ list: "ordered" }, { list: "bullet" }],
		[{ indent: "-1" }, { indent: "+1" }, { align: [] }],
		// ["link", "image", "video"],
		["link"],
		["clean"],
	],
};

const TextEditor = ({
	propKey,
	updateRichText,
	tabTileProps,
	chartProp,
	graphDimension,
	chartArea,
	graphTileSize,
	chartDetail,
}) => {
	const [value, setValue] = useState(chartProp.properties[propKey].richText);

	console.log(JSON.stringify(value));
	console.log(JSON.stringify(chartProp.properties[propKey].richText));

	useEffect(() => {
		if (JSON.stringify(value) !== JSON.stringify(chartProp.properties[propKey].richText)) {
			updateRichText(propKey, value);
		}
	}, [value]);

	//debounce function to reduce no.of redux action call
	// const debounce = func => {
	// 	let timer;
	// 	return function (...args) {
	// 		const context = this;
	// 		if (timer) clearTimeout(timer);
	// 		timer = setTimeout(() => {
	// 			timer = null;
	// 			func.apply(context, args);
	// 		}, 500);
	// 	};
	// };

	const optimizedFn = useCallback(debounce(setValue), []);

	return (
		<>
			{!tabTileProps.showDash ? (
				<ReactQuill
					modules={modules}
					onChange={optimizedFn}
					value={value}
					style={{ height: "90%" }}
					theme="snow"
					placeholder="Content goes here..."
				/>
			) : (
				<ReactQuill
					readOnly="true"
					value={value}
					theme="bubble"
					style={{
						padding: "5px",
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
				/>
			)}
		</>
	);
};

const mapStateToProps = state => {
	return {
		chartProp: state.chartControls,
		tabTileProps: state.tabTileProps,
		chartDetail: state.chartProperties.properties,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		updateRichText: (propKey, value) => dispatch(updateRichText(propKey, value)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(TextEditor);
