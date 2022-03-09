import update from "immutability-helper";

const SampleRecordsReducer = (state = {}, action) => {
	switch (action.type) {
		case "ADD_TABLE_RECORDS":
			if (state[action.payload.ds_uid] !== undefined) {
				return update(state, {
					[action.payload.ds_uid]: {
						[action.payload.tableId]: { $set: action.payload.tableRecords },
					},
				});
			} else {
				var stateCopy = Object.assign(state);
				var dsObj = { [action.payload.ds_uid]: {} };

				stateCopy = update(stateCopy, { $merge: dsObj });
				return update(stateCopy, {
					[action.payload.ds_uid]: {
						[action.payload.tableId]: { $set: action.payload.tableRecords },
					},
				});
			}

		default:
			return state;
	}
};

export default SampleRecordsReducer;
