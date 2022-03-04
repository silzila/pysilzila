import { Button, MenuItem, Popover, Select } from "@mui/material";
import React, { useEffect, useState } from "react";
import { connect, useSelector } from "react-redux";
import JoinFullIcon from "@mui/icons-material/JoinFull";
import JoinLeftIcon from "@mui/icons-material/JoinLeft";
import JoinInnerIcon from "@mui/icons-material/JoinInner";
import JoinRightIcon from "@mui/icons-material/JoinRight";
import data from "./Data.json";
import {
	FindCardinality,
	FindIntegrity,
	FindRowMatchId,
	FindRowUniqueId,
} from "../CommonFunctions/FindIntegrityAndCordinality";
import {
	addArrows,
	clickOnArrow,
	setArrows,
	setArrowType,
} from "../../redux/Dataset/datasetActions";
import { NotificationDialog } from "../CommonFunctions/DialogComponents";
import { CloseOutlined } from "@mui/icons-material";

const RelationshipDefiningComponent = ({
	// Creating this comment for a new pull request

	// props
	showCard,
	setShowCard,
	arrowProp,
	setArrowProp,
	arrowPropexisting,
	existingArrow,
	setExistingArrow,
	addRelationship,

	//dispatch
	clickOnArrow,
	setArrowType,
	addArrows,
}) => {
	const [rowUniqueId1, setRowUniqueId1] = useState();
	const [rowMatchId1, setRowMatchId1] = useState();
	const [rowUniqueId2, setRowUniqueId2] = useState();
	const [rowMatchId2, setRowMatchId2] = useState();
	const [openAlert, setOpenAlert] = useState(false);
	const [severity, setSeverity] = useState("success");
	const [testMessage, setTestMessage] = useState("");

	// =================== select values =====================
	useEffect(() => {
		if (existingArrow) {
			let uniqueId = FindRowUniqueId(arrowPropexisting.cardinality);
			let MatchId = FindRowMatchId(arrowPropexisting.integrity);
			setRowUniqueId1(uniqueId.rowUniqueId1);
			setRowUniqueId2(uniqueId.rowUniqueId2);
			setRowMatchId1(MatchId.rowMatchId1);
			setRowMatchId2(MatchId.rowMatchId2);
		}
	});

	const handleRowUniqueId1 = (e) => {
		setRowUniqueId1(e.target.value);
	};
	const handleRowUniqueId2 = (e) => {
		setRowUniqueId2(e.target.value);
	};
	const handleRowMatchId1 = (e) => {
		setRowMatchId1(e.target.value);
	};
	const handleRowMatchId2 = (e) => {
		setRowMatchId2(e.target.value);
	};

	// ====================cardinality======================

	const Cordinality = () => {
		if (existingArrow === true) {
			return <h6 style={{ margin: "0px" }}>{arrowPropexisting.cardinality}</h6>;
		} else {
			if (rowUniqueId1 !== "undefined" && rowUniqueId2 !== "undefined") {
				if (parseInt(rowUniqueId1) === 1 && parseInt(rowUniqueId2) === 1) {
					return <h6 style={{ margin: "0px" }}>One to One</h6>;
				} else if (parseInt(rowUniqueId1) === 1 && parseInt(rowUniqueId2) === 2) {
					return <h6 style={{ margin: "0px" }}>One to Many</h6>;
				} else if (parseInt(rowUniqueId1) === 2 && parseInt(rowUniqueId2) === 1) {
					return <h6 style={{ margin: "0px" }}>Many to One</h6>;
				} else if (parseInt(rowUniqueId1) === 2 && parseInt(rowUniqueId2) === 2) {
					return <h6 style={{ margin: "0px" }}>Many to Many</h6>;
				}
			} else {
				return <p></p>;
			}
		}
	};

	// ===========================================
	// integrity
	// ===========================================
	const Integrity = () => {
		if (existingArrow === true) {
			switch (arrowPropexisting.integrity) {
				case "full":
					return <JoinFullIcon />;
				case "left":
					return <JoinLeftIcon />;
				case "right":
					return <JoinRightIcon />;
				case "inner":
					return <JoinInnerIcon />;
			}
		} else {
			if (parseInt(rowMatchId1) !== "undefined" && parseInt(rowMatchId2) !== "undefined") {
				if (parseInt(rowMatchId1) === 1 && parseInt(rowMatchId2) === 1) {
					return <JoinFullIcon />;
				}
				if (parseInt(rowMatchId1) === 1 && parseInt(rowMatchId2) === 2) {
					return <JoinLeftIcon />;
				}
				if (parseInt(rowMatchId1) === 2 && parseInt(rowMatchId2) === 1) {
					return <JoinRightIcon />;
				}
				if (parseInt(rowMatchId1) === 2 && parseInt(rowMatchId2) === 2) {
					return <JoinInnerIcon />;
				}
			} else {
				return <p></p>;
			}
		}
	};

	// ====================================== other fnc================

	const onClose = () => {
		setShowCard(false);
		setRowUniqueId1();
		setRowMatchId1();
		setRowUniqueId2();
		setRowMatchId2();
		setArrowProp([]);
		setExistingArrow(false);
		onCloseAlert();
	};

	const onCloseAlert = () => {
		setOpenAlert(false);
		setTestMessage("");
	};

	const FindShowHead = () => {
		if (rowUniqueId2 === 1) {
			return false;
		}
		if (rowUniqueId2 === 2) {
			return true;
		}
	};

	const FindShowTail = () => {
		if (rowUniqueId1 === 1) {
			return false;
		}
		if (rowUniqueId1 === 2) {
			return true;
		}
	};

	const onSet = () => {
		if (rowMatchId1 && rowMatchId2 && rowUniqueId1 && rowUniqueId2) {
			const refs = {
				...arrowProp,
				isSelected: false,
				integrity: FindIntegrity(rowMatchId1, rowMatchId2),
				cardinality: FindCardinality(rowUniqueId1, rowUniqueId2),
				showHead: FindShowHead(),
				showTail: FindShowTail(),
			};
			// const obj = {
			// 	startTableName: arrowProp.startTableName,
			// 	endTableName: arrowProp.endTableName,
			// 	cardinality: refs.cardinality,
			// 	integrity: refs.integrity,
			// 	startColumnName:arrowProp.startColumnName,
			// 	endColumnName: arrowProp.endColumnName,
			// };
			console.log(refs, "ref");
			addArrows(refs);
			addRelationship(refs);
			onClose();
		} else {
			setSeverity("error");
			setTestMessage("please select a value in all the fields");
			setOpenAlert(true);
			setTimeout(() => {
				setOpenAlert(false);
				setTestMessage("");
				setSeverity("");
			}, 3000);
		}
	};

	// =======================================UI Elements ==================================================
	const TableNames = () => {
		return (
			<React.Fragment>
				{arrowProp ? (
					<div className="tbl_clm_name">
						<h5>{arrowProp.startTableName}</h5>
						<h5>{arrowProp.endTableName}</h5>
					</div>
				) : arrowPropexisting ? (
					<div className="tbl_clm_name">
						<h5>{arrowPropexisting.startTableName}</h5>
						<h5>{arrowPropexisting.endTableName}</h5>
					</div>
				) : (
					""
				)}
			</React.Fragment>
		);
	};

	const ColumnNames = () => {
		return (
			<React.Fragment>
				{arrowProp ? (
					<div className="tbl_clm_name">
						<h5>{arrowProp.startColumnName}</h5>
						<h5>{arrowProp.endColumnName}</h5>
					</div>
				) : arrowPropexisting ? (
					<div className="tbl_clm_name">
						<h5>{arrowPropexisting.startColumnName}</h5>
						<h5>{arrowPropexisting.endColumnName}</h5>
					</div>
				) : (
					""
				)}
			</React.Fragment>
		);
	};

	return (
		// TODO: Priority 10 - Styling Fix required
		//  Layout doesn't have proper padding all around. Also, select width is not constant.
		<React.Fragment>
			<Popover
				open={showCard}
				anchorReference="anchorPosition"
				anchorPosition={{ top: 200, left: 400 }}
				anchorOrigin={{
					vertical: "top",
					horizontal: "left",
				}}
				transformOrigin={{
					vertical: "top",
					horizontal: "left",
				}}
				// anchorReference="anchorEl"

				// TODO Priority 5 - Kasthuri created. Positioning relationship popover
				// set anchorEl={}
			>
				<CloseOutlined style={{ float: "right" }} onClick={onClose} />
				<div className="relpopoverContainer">
					<p id="selectRel">Select Relationship</p>

					<h5 className="selIntegerityandCadinality">Select Uniqueness (cardinality)</h5>

					{/* --------------------Table Names----------------------------------- */}

					{TableNames()}

					{/* ----------------------------dropdown---------------------------------------- */}

					<div className="relpopoverItem">
						<Select
							onChange={(e) => handleRowUniqueId1(e)}
							className="relpopoverSelect"
							defaultValue={existingArrow ? rowUniqueId1 : ""}
						>
							{data.rowUniqueness.map((el) => {
								return (
									<MenuItem key={el.id} value={el.id}>
										{el.name}
									</MenuItem>
								);
							})}
						</Select>
						<div className="integrityAndcardinality">{Cordinality()}</div>
						<Select
							onChange={(e) => {
								handleRowUniqueId2(e);
								console.log(e.target.value);
							}}
							className="relpopoverSelect"
							defaultValue={existingArrow ? rowUniqueId2 : ""}
						>
							{data.rowUniqueness.map((el) => {
								return (
									<MenuItem key={el.id} value={el.id}>
										{el.name}
									</MenuItem>
								);
							})}
						</Select>
					</div>

					<h5 className="selIntegerityandCadinality">
						Select Row Match (referential Integrity)
					</h5>

					{/* ------------------------------------- column names---------------------------------- */}

					{ColumnNames()}

					{/* ------------------------------------- dropdown------------------------------------------ */}

					<div className="relpopoverItem">
						<Select
							onChange={(e) => handleRowMatchId1(e)}
							className="relpopoverSelect"
							defaultValue={existingArrow ? rowMatchId1 : ""}
						>
							{data.rowMatch.map((el) => {
								return (
									<MenuItem key={el.id} value={el.id}>
										{el.name}
									</MenuItem>
								);
							})}
						</Select>
						<div className="integrityAndcardinality">{Integrity()}</div>
						<Select
							onChange={(e) => handleRowMatchId2(e)}
							className="relpopoverSelect"
							defaultValue={existingArrow ? rowMatchId2 : ""}
						>
							{data.rowMatch.map((el) => {
								return (
									<MenuItem key={el.id} value={el.id}>
										{el.name}
									</MenuItem>
								);
							})}
						</Select>
					</div>

					{/*TODO: Priority 5 -  List al column pairs between both table.
							 Eg.,
							Table 1					Table2
							Column 1				Column 1
							Column 2				Column 2
						*/}

					{/* ------------------------------------- buutons-------------------------------------------------- */}

					<div className="relpopoverItem">
						<Button onClick={onSet} id="setButton">
							set
						</Button>
						{/* <Button onClick={onClose} id="cancelBtn">
							cancel
						</Button> */}
					</div>
				</div>
			</Popover>
			<NotificationDialog
				openAlert={openAlert}
				severity={severity}
				testMessage={testMessage}
				onCloseAlert={onCloseAlert}
			/>
		</React.Fragment>
	);
};
const mapDispatchToProps = (dispatch) => {
	return {
		clickOnArrow: (payload) => dispatch(clickOnArrow(payload)),
		setArrowType: (payload) => dispatch(setArrowType(payload)),
		addArrows: (payload) => dispatch(addArrows(payload)),
	};
};

export default connect(null, mapDispatchToProps)(RelationshipDefiningComponent);
