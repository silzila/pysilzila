import React from "react";
import { Rnd } from "react-rnd";
import { connect } from "react-redux";
import {
	updateDashGraphPosition,
	updateDashGraphSize,
	updateGraphHighlight,
} from "../../redux/TabTile/actionsTabTile";
import DashGraph from "./DashGraph";

const GraphRNDDash = ({
	style,
	setStyle,
	style2,

	tabId,
	boxDetails,

	updateDashGraphPos,
	updateDashGraphSz,

	chartProp,
	tabTileProps,
}) => {
	const gridSize = tabTileProps.dashGridSize;
	const dragGridX = gridSize;
	const dragGridY = gridSize;
	const resizeGridX = gridSize;
	const resizeGridY = gridSize;

	// const [graphDimension, setGraphDimension] = useState({});
	console.log(gridSize);
	console.log(boxDetails);
	console.log("x:", boxDetails.x * gridSize, "y:", boxDetails.y * gridSize);

	console.log();

	return (
		<Rnd
			bounds="parent"
			dragGrid={[dragGridX, dragGridY]}
			resizeGrid={[resizeGridX, resizeGridY]}
			style={boxDetails.highlight ? style2 : style}
			size={{ width: boxDetails.width * gridSize, height: boxDetails.height * gridSize }}
			position={{ x: boxDetails.x * gridSize, y: boxDetails.y * gridSize }}
			onDragStart={(e, d) => {
				console.log(d);
			}}
			onDrag={(e, d) => {
				console.log(d);
				setStyle({ ...style, border: "1px solid gray" });
			}}
			onDragStop={(e, d) => {
				console.log(gridSize, d);
				updateDashGraphPos(
					tabId,
					boxDetails.propKey,
					(d.lastX - 5) / gridSize,
					(d.lastY - 60) / gridSize
				);
				setStyle({ ...style, border: "1px solid transparent" });
			}}
			onResize={(e, direction, ref, position) => {
				var width = ref.style.width.replace("px", "");
				var widthInt = Number(width);

				var height = ref.style.height.replace("px", "");
				var heightInt = Number(height);

				updateDashGraphSz(
					tabId,
					boxDetails.propKey,
					position.width / gridSize,
					position.height / gridSize,
					widthInt / gridSize,
					heightInt / gridSize
				);
				setStyle({ ...style, border: "1px solid gray" });
			}}
			onResizeStop={(e, direction, ref, delta, position) => {
				var width = ref.style.width.replace("px", "");
				var widthInt = Number(width);

				var height = ref.style.height.replace("px", "");
				var heightInt = Number(height);

				updateDashGraphSz(
					tabId,
					boxDetails.propKey,
					position.x / gridSize,
					position.y / gridSize,
					widthInt / gridSize,
					heightInt / gridSize
				);
				setStyle({ ...style, border: "1px solid transparent" });
			}}
			dragHandleClassName="dragHeader"
		>
			<div className="rndObject" propKey={boxDetails.propKey}>
				<div
					className="dragHeader"
					style={{ whiteSpace: "nowrap", overflow: "hidden", texOverflow: "ellipsis" }}
					propKey={boxDetails.propKey}
				>
					{chartProp.properties[boxDetails.propKey].titleOptions.chartTitle}
				</div>

				<div className="dashChart" id="dashChart" propKey={boxDetails.propKey}>
					<DashGraph propKey={boxDetails.propKey} tabId={tabId} gridSize={gridSize} />
				</div>
			</div>
		</Rnd>
	);
};

const mapStateToProps = (state) => {
	return {
		tabTileProps: state.tabTileProps,
		chartProp: state.chartProperties,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		updateDashGraphPos: (tabId, propKey, x, y) =>
			dispatch(updateDashGraphPosition(tabId, propKey, x, y)),
		updateDashGraphSz: (tabId, propKey, x, y, width, height) =>
			dispatch(updateDashGraphSize(tabId, propKey, x, y, width, height)),
		graphHighlight: (tabId, propKey) => dispatch(updateGraphHighlight(tabId, propKey)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(GraphRNDDash);
