import React from "react";
import { Box } from "./Box";
import SampleRecords from "./SampleRecords.json";

const DisplayTable = () => {
	console.log(SampleRecords);

	// Get the column names from first row of table data
	const getKeys = () => {
		return Object.keys(SampleRecords[0]);
	};

	// Get the column names from getKeys() and render the header for table
	const GetHeaders = () => {
		var keys = getKeys();
		console.log("Keys ", keys);
		return keys.map((key, index) => {
			return (
				<th
					key={index}
					className="tableHeadings"
					// draggable="true" onDragStart={(e) => handleDragStart(e, columnsData[index]) }
				>
					<Box name={key} type="card" fieldData={key} />
					{/* : null} */}
				</th>
			);
		});
	};

	// Render a single row of the table
	const RenderRow = (props) => {
		return props.keys.map((key) => {
			return (
				<td className="tableValues" key={props.data[key]}>
					{props.data[key]}
				</td>
			);
		});
	};

	// Get all rows data and pass it to RenderRow to display table data
	const getRowsData = () => {
		var keys = getKeys();

		return SampleRecords.map((row, index) => {
			return (
				<tr key={index} className="tableRows">
					<RenderRow key={index} data={row} keys={keys} />
				</tr>
			);
		});
	};

	return (
		<div className="tableViewAndControls ">
			<table className="displayTable">
				<thead>
					<tr>
						<GetHeaders />
					</tr>
				</thead>
				<tbody>{getRowsData()}</tbody>
			</table>
		</div>
	);
};

export default DisplayTable;
