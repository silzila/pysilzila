// =============================================================================
// Actions from Sidebar
// =============================================================================

import { useSelector } from "react-redux";

export const setConnectionValue = (pl) => {
	return { type: "SET_CONNECTION_VALUE", payload: pl };
};

export const setDataSchema = (pl) => {
	return { type: "SET_DATA_SCHEMA", payload: pl };
};

export const setUserTable = (userTable) => {
	return { type: "SET_TABLES", payload: userTable };
};

export const addTable = (payload) => {
	return { type: "ADD_TABLE", payload: payload };
};

export const toggleOnChecked = (data) => {
	return { type: "ON_CHECKED", payload: data };
};

export const removeArrows = (pl) => {
	return { type: "REMOVE_ARROWS", payload: pl };
};
export const resetState = () => {
	return { type: "RESET_STATE" };
};

// =============================================================================
// Actions from Canvas
// =============================================================================
export const addArrows = (arrow) => {
	return { type: "ADD_ARROWS", payload: arrow };
};
export const clickOnArrow = (payload) => {
	return { type: "CLICK_ON_ARROW", payload: payload };
};
export const setArrowType = (payload) => {
	return { type: "SET_ARROW_TYPE", payload: payload };
};
export const setArrows = (pl) => {
	return { type: "SET_ARROWS", payload: pl };
};
export const resetArrows = () => {
	return { type: "RESET_ARROWS_ARRAY" };
};

// ===============================================================
// Actions from Tables
// =================================================================

export const AddItemInTableColumn = (pl) => {
	const state = useSelector((state) => state);
	const pld = state.relationships.map((el) => {
		if (el.table1 === pl.table1 && el.table2 === pl.table2) {
			el.table1_columns = [...el.table1_columns, ...pl.table1_columns];
			el.table2_columns = [...el.table2_columns, ...pl.table2_columns];
			return el;
		}
	});
	return { type: "ADD_OBJ_IN_TABLE_COLUMN", payload: pld };
};

export const addNewRelationship = (payload) => {
	return { type: "ADD_NEW_RELATIONSHIP", payload: payload };
};
