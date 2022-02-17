import { Button, MenuItem, Popover, Select } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import JoinFullIcon from "@mui/icons-material/JoinFull";
import JoinLeftIcon from "@mui/icons-material/JoinLeft";
import JoinInnerIcon from "@mui/icons-material/JoinInner";
import JoinRightIcon from "@mui/icons-material/JoinRight";

// TODO PopOver must not go away when clicked outside.
// If it goes away, then no arrow should be added

const RelationShipPopover = ({
	// props
	showCard,
	setShowCard,
	// TODO: Add another props that captures whether this popover is opened by adding new arrow or by clicking already existing arrow
	// If it is from existing arrow, then all relationships must be already loaded
}) => {
	const state = useSelector((state) => state.dataSetState);
	const dispatch = useDispatch();

	const [rowUniqueId1, setRowUniqueId1] = useState();
	const [rowMatchId1, setRowMatchId1] = useState();
	const [rowUniqueId2, setRowUniqueId2] = useState();
	const [rowMatchId2, setRowMatchId2] = useState();

	// =================== select values =====================

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
	};

	// ===========================================
	// integrity
	// ===========================================
	const Integrity = () => {
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
	};

	// ====================================== other fnc================

	const onClose = () => {
		setShowCard(false);
		const newArrow = [...state.arrows].map((arr) => {
			arr.isSelected = false;
			return arr;
		});
		dispatch({ type: "CLICK_ON_ARROW", payload: newArrow });
		setRowUniqueId1();
		setRowMatchId1();
		setRowUniqueId2();
		setRowMatchId2();
	};

	// TODO Move all dispatch calls to actions file
	const onToggle = (ID, ity) => {
		const newType = [...state.arrowType].map((el, i) => {
			if (el.id === ID) {
				el.isSelected = true;
			} else if (el.id !== ID) {
				el.isSelected = false;
			}
			return el;
		});
		console.log(newType);

		// Where is the arrowType used?
		// TODO Looks like arrowType is used just to set some parameters in the actual 'arrow' state
		// This arrowType can be removed from state and only arrow can be used
		dispatch({ type: "SET_ARROW_TYPE", payload: newType });

		const newArray = [...state.arrows].map((arr) => {
			[...state.arrowType].map((item) => {
				if (ID === item.id && arr.isSelected === true) {
					arr.showHead = item.showHead;
					arr.showTail = item.showTail;
					arr.integrity = ity;
					arr.isSelected = false;
				}
			});
			return arr;
		});

		console.log(newArray);

		// TODO Two redux calls with same dispatch 'CLICK_ON_ARROW' with different payload
		//  going simultaneously here. Need to be modified.
		dispatch({ type: "CLICK_ON_ARROW", payload: newArray });
		onClose();

		const oldType = [...state.arrowType].map((el) => {
			el.isSelected = false;
			return el;
		});
		console.log(oldType);
		dispatch({ type: "SET_ARROW_TYPE", payload: oldType });
	};

	const setIntegrity = (ID) => {
		if (parseInt(rowMatchId1) === 1 && parseInt(rowMatchId2) === 1) {
			return "full";
		}
		if (parseInt(rowMatchId1) === 2 && parseInt(rowMatchId2) === 2) {
			return "inner";
		}
		if (parseInt(rowMatchId1) === 1 && parseInt(rowMatchId2) === 2) {
			return "left";
		}
		if (parseInt(rowMatchId1) === 2 && parseInt(rowMatchId2) === 1) {
			return "right";
		}
	};

	const onSet = () => {
		if (parseInt(rowUniqueId1) === 1 && parseInt(rowUniqueId2) === 1) {
			const ID = 1;
			const ity = setIntegrity();
			onToggle(ID, ity);
		}
		if (parseInt(rowUniqueId1) === 2 && parseInt(rowUniqueId2) === 2) {
			const ID = 4;
			const ity = setIntegrity();
			onToggle(ID, ity);
		}
		if (parseInt(rowUniqueId1) === 1 && parseInt(rowUniqueId2) === 2) {
			const ID = 2;
			const ity = setIntegrity();

			onToggle(ID, ity);
		}
		if (parseInt(rowUniqueId1) === 2 && parseInt(rowUniqueId2) === 1) {
			const ID = 3;
			const ity = setIntegrity();

			onToggle(ID, ity);
		}
	};
	return (
		// TODO Change styling of this popover card
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
			// TODO  set anchorEl={}
		>
			<div className="relpopoverContainer">
				<p id="selectRel">Select Relationship</p>
				<h5 className="selIntegerityandCadinality">Select Uniqueness (cardinality)</h5>
				{state.arrows.map((arr) => {
					if (arr.isSelected === true) {
						return (
							<div className="tbl_clm_name">
								<h5>{arr.startTableName}</h5>
								<h5>{arr.endTableName}</h5>
							</div>
						);
					}
				})}
				<div className="relpopoverItem">
					<Select onChange={(e) => handleRowUniqueId1(e)} className="relpopoverSelect">
						{state.rowUniqueness.map((el) => {
							return <MenuItem value={el.id}>{el.name}</MenuItem>;
						})}
					</Select>
					<div className="integrityAndcardinality">{Cordinality()}</div>
					<Select onChange={(e) => handleRowUniqueId2(e)} className="relpopoverSelect">
						{state.rowUniqueness.map((el) => {
							return <MenuItem value={el.id}>{el.name}</MenuItem>;
						})}
					</Select>
				</div>
				<h5 className="selIntegerityandCadinality">
					Select Row Match (referential Integrity)
				</h5>
				{state.arrows.map((arr) => {
					if (arr.isSelected === true) {
						return (
							<div className="tbl_clm_name">
								<h5>{arr.startColumnName}</h5>
								<h5>{arr.endColumnName}</h5>
							</div>
						);
					}
				})}
				<div className="relpopoverItem">
					<Select onChange={(e) => handleRowMatchId1(e)} className="relpopoverSelect">
						{state.rowMatch.map((el) => {
							return <MenuItem value={el.id}>{el.name}</MenuItem>;
						})}
					</Select>
					<div className="integrityAndcardinality">{Integrity()}</div>
					<Select onChange={(e) => handleRowMatchId2(e)} className="relpopoverSelect">
						{state.rowMatch.map((el) => {
							return <MenuItem value={el.id}>{el.name}</MenuItem>;
						})}
					</Select>
				</div>
				<div className="relpopoverItem">
					<Button onClick={onSet} id="setButton">
						set
					</Button>
					<Button onClick={onClose} id="cancelBtn">
						cancel
					</Button>
				</div>
			</div>
		</Popover>
	);
};
export default RelationShipPopover;
