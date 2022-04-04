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
			{/* TODO: Priority 10 - Styling Fix
			 Dialog width have to be increased */}
			<Dialog
				open={showTableData}
				// onClose={handleClose}
				// sx={{ maxWidth: "80%" }}
			>
				{/* <div sx={{ maxWidth: "80%" }}> */}
				<DialogTitle
					sx={{
						display: "flex",
						flexDirection: "row",
						columnGap: "2rem",
						justifyContent: "space-between",
						fontSize: "16px",
					}}
				>
					<p style={{ float: "left" }}>{selectedTable}</p>
					<p>Rows Displayed: {tableData.length}</p>
					<CloseOutlined style={{ float: "rigth" }} onClick={handleClose} />
				</DialogTitle>
				<DialogContent sx={{ maxWidth: "80vw", overflow: "hidden" }}>
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
				{/* </div> */}
			</Dialog>
		</>
	);
}
export default TableData;
