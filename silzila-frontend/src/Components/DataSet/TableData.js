import React from "react";
import {
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
			<Dialog
				open={showTableData}
				onClose={handleClose}
				style={{
					margin: "20px auto",
					maxHeight: "90vh",
					maxWidth: "90vw",
					minHeight: "auto",
					minWidth: "auto",
				}}
			>
				<DialogTitle>
					<div style={{ display: "flex", flexDirection: "row" }}>
						<p>View Product</p>
						<CloseOutlined onClick={handleClose} />
					</div>
					<div style={{ display: "flex", flexDirection: "row" }}>
						<p>{selectedTable}</p>
						<p>Rows : {tableData.length}</p>
					</div>
				</DialogTitle>
				<DialogContent>
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
									<TableRow key={i}>
										{objKeys.map((obj) => {
											return <TableCell>{data[obj]}</TableCell>;
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
