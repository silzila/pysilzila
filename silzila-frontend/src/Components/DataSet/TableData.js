import React from "react";
import {
	autocompleteClasses,
	Dialog,
	DialogContent,
	DialogTitle,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
} from "@mui/material";
import { CloseOutlined } from "@mui/icons-material";
import "./Dataset.css";

function TableData({
	showTableData,
	setShowTableData,
	selectedTable,
	setSelectedTable,
	tableData,
	setTableData,
	objKeys,
}) {
	const handleClose = () => {
		setShowTableData(false);
		setSelectedTable("");
		setTableData([]);
	};
	return (
		<>
			{/* TODO:(c) Priority 10 - Styling Fix
			 Dialog width have to be increased */}
			<Dialog open={showTableData} maxWidth="lg">
				<DialogTitle
					sx={{
						display: "flex",
						padding: "0 0.5rem 0 2rem",
						fontSize: "16px",
						fontWeight: "bold",
					}}
				>
					<p style={{ flex: 1 }}>{selectedTable}</p>
					<p style={{ flex: 1 }}>Rows Displayed: {tableData.length}</p>

					<CloseOutlined sx={{ margin: "5px " }} onClick={handleClose} />
				</DialogTitle>
				<DialogContent sx={{ overflow: "auto" }}>
					<Table stickyHeader>
						<TableHead>
							<TableRow>
								{objKeys &&
									objKeys.map((el, i) => {
										return (
											<TableCell
												style={{
													fontWeight: "bold",
													backgroundColor: "#e8eaf6",
												}}
												key={i}
											>
												{el}
											</TableCell>
										);
									})}
							</TableRow>
						</TableHead>
						<TableBody style={{ width: "auto" }}>
							{tableData.map((data, i) => {
								return (
									<TableRow key={i} id="TRow">
										{objKeys.map((obj) => {
											return <TableCell id="TColumn">{data[obj]}</TableCell>;
										})}
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</DialogContent>
			</Dialog>
		</>
	);
}
export default TableData;
