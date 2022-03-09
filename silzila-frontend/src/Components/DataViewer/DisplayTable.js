import React from "react";
import { connect } from "react-redux";
import { Box } from "./Box";

const DisplayTable = ({
	// props
	dsId,
	table,

	// state
	tableRecords,
}) => {
	var SampleRecords = tableRecords?.[dsId]?.[table];

	// Get the column names from first row of table data
	const getKeys = (record) => {
		return Object.keys(record);
	};

	// Get the column names from getKeys() and render the header for table
	const GetHeaders = () => {
		if (SampleRecords) {
			var keys = getKeys(SampleRecords[0]);
			return keys.map((key, index) => {
				return (
					<th
						key={`${index}_${key}`}
						className="tableHeadings"
						// draggable="true" onDragStart={(e) => handleDragStart(e, columnsData[index]) }
					>
						<Box name={key} type="card" fieldData={key} />
					</th>
				);
			});
		} else return null;
	};

	// Render a single row of the table
	const RenderRow = (props) => {
		return props.keys.map((key, index) => {
			return (
				<td className="tableValues" key={`${index}_${key}`}>
					{props.data[key]}
				</td>
			);
		});
	};

	// Get all rows data and pass it to RenderRow to display table data
	const getRowsData = () => {
		if (SampleRecords) {
			var keys = getKeys(SampleRecords[0]);

			return SampleRecords.map((row, index) => {
				return (
					<tr key={index} className="tableRows">
						<RenderRow key={index} data={row} keys={keys} />
					</tr>
				);
			});
		} else return null;
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

const mapStateToProps = (state) => {
	return { tableRecords: state.sampleRecords };
};

export default connect(mapStateToProps, null)(DisplayTable);
