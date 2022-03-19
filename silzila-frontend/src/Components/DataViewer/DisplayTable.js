import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Box } from "./Box";

const DisplayTable = ({
	// props
	dsId,
	table,

	// state
	tableRecords,
	tabTileProps,
}) => {
	var SampleRecords = tableRecords?.[dsId]?.[table];
	const [columnsData, setColumnsData] = useState([]);

	const formatFieldsData = () => {
		let _fieldsData = [];
		if (SampleRecords) {
			var tableKeys = Object.keys(SampleRecords[0]);
			var schema = tableRecords.recordsColumnType[dsId][table];

			for (let i = 0; i < tableKeys.length; i++) {
				_fieldsData.push({
					fieldname: tableKeys[i],
					displayname: tableKeys[i],
					schema: schema.filter((sc) => sc.column_name === tableKeys[i])[0].data_type,
					tableId: table,
				});
			}
			return _fieldsData;
		}
		return _fieldsData;
	};

	const prepareInputs = () => {
		let _fields = formatFieldsData();
		setColumnsData(_fields);
	};

	useEffect(() => {
		prepareInputs();
	}, [SampleRecords]);

	// Get the column names from first row of table data
	const getKeys = (record) => {
		return Object.keys(record);
	};

	// Get the column names from getKeys() and render the header for table

	// TODO: Priority 5 - Table header row is not in position sticky!

	const GetHeaders = () => {
		if (SampleRecords) {
			var keys = getKeys(SampleRecords[0]);
			return keys.map((key, index) => {
				return (
					<th key={`${index}_${key}`}>
						<Box name={key} type="card" fieldData={columnsData[index]} />
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

	const RenderButtons = () => {
		if (SampleRecords) {
			var keys = getKeys(SampleRecords[0]);
			return keys.map((key, index) => {
				return (
					<button
						key={key}
						className="boxContainer"
						draggable="true"
						// onDragStart={(e) => handleDragStart(e, columnsData[index])}
					>
						<Box name={key} type="card" fieldData={columnsData[index]} />
					</button>
				);
			});
		} else return null;
	};

	return tabTileProps.columnsOnlyDisplay ? (
		<div className="showColumnsOnly">
			<RenderButtons />
		</div>
	) : (
		<div className="tableViewAndControls">
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
	return { tableRecords: state.sampleRecords, tabTileProps: state.tabTileProps };
};

export default connect(mapStateToProps, null)(DisplayTable);
