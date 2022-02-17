// =============================================================================
// Actions from Sidebar
// =============================================================================

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
