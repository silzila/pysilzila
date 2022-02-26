import update from "immutability-helper";

const initialState = {
	connection: "",
	schema: "",
	tables: [],
	arrows: [],
	tempTable: [],
	relationships: [],
};

const DataSetReducer = (state = initialState, action) => {
	// console.log(action.type, action.payload);

	switch (action.type) {
		// sets DC id to state
		case "SET_CONNECTION_VALUE":
			return update(state, {
				connection: {
					$set: action.payload,
				},
			});

		// sets Friendly name to state
		case "SET_FRIENDLY_NAME":
			return update(state, {
				friendly_name: {
					$set: action.payload,
				},
			});

		// sets Schema Name to state
		case "SET_DATA_SCHEMA":
			return update(state, {
				schema: {
					$set: action.payload,
				},
			});

		// sets list of tables for a selected schema to state
		case "SET_TABLES":
			return update(state, {
				tables: {
					$set: action.payload,
				},
			});

		// When a table in sidebar is checked / unchecked, update state accordingly
		case "ON_CHECKED":
			console.log(action.payload);
			const x = state.tables.map((tab) => {
				if (tab.tableName === action.payload) {
					if (tab.isSelected === true) {
						var yes = window.confirm("are you sure you want to remove this table");
						if (yes) {
							tab.isSelected = !tab.isSelected;
							state.tempTable.map((el) => {
								if (el.tableName === tab.tableName) {
									el.isSelected = false;
								}
							});
						}
					} else {
						tab.isSelected = !tab.isSelected;
					}
				}
				return tab;
			});
			console.log("X", x);

			const tempArray = state.tempTable.filter((item) => {
				return item.isSelected === true;
			});
			console.log(tempArray);

			return update(state, {
				tables: {
					$set: [...x],
				},
				tempTable: {
					$set: [...tempArray],
				},
			});

		// Tables that are selected in sidebar and to be displayed in canvas
		case "ADD_TABLE":
			return update(state, {
				tempTable: {
					$push: [action.payload],
				},
			});

		// Remove all arrows belonging to a particular table (whether the arrow starts or ends in this table)
		case "REMOVE_ARROWS":
			const y = state.arrows.filter((arr) => {
				return arr.startTableName !== action.payload;
			});
			const z = y.filter((arr) => {
				return arr.endTableName !== action.payload;
			});
			return update(state, {
				arrows: {
					$set: [...z],
				},
			});

		// bring to Initial state. Used when dataconnection is changed from sidebar
		case "RESET_STATE":
			return initialState;

		//
		case "ADD_OBJ_IN_TABLE_COLUMN":
			return update(state, {
				relationships: {
					$set: [...action.payload],
				},
			});

		case "ADD_NEW_RELATIONSHIP":
			return update(state, {
				relationships: {
					$push: [action.payload],
				},
			});

		// Adding information required to draw an arrow
		case "ADD_ARROWS":
			return update(state, {
				arrows: {
					$push: [action.payload],
				},
			});

		case "CLICK_ON_ARROW":
			return update(state, {
				arrows: {
					$set: [...action.payload],
				},
			});

		case "SET_ARROW_TYPE":
			return update(state, {
				arrowType: {
					$set: [...action.payload],
				},
			});

		default:
			return state;
	}
};

export default DataSetReducer;
