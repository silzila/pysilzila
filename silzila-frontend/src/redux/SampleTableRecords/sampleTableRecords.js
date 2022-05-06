import update from "immutability-helper";

const initialRecords = { recordsColumnType: {} };

const SampleRecordsReducer = (state = initialRecords, action) => {
	switch (action.type) {
		case "ADD_TABLE_RECORDS":
			console.log(action.payload.ds_uid, action.payload.tableId, action.payload.columnType);

			console.log(state[action.payload.ds_uid] !== undefined);

			if (state[action.payload.ds_uid] !== undefined) {
				return update(state, {
					[action.payload.ds_uid]: {
						[action.payload.tableId]: { $set: action.payload.tableRecords },
					},
					recordsColumnType: {
						[action.payload.ds_uid]: {
							[action.payload.tableId]: { $set: action.payload.columnType },
						},
					},
				});
			} else {
				var stateCopy = Object.assign(state);
				var dsObj = { [action.payload.ds_uid]: {} };

				console.log(dsObj);
				stateCopy = update(stateCopy, { $merge: dsObj });
				stateCopy = update(stateCopy, { recordsColumnType: { $merge: dsObj } });

				console.log(stateCopy);

				return update(stateCopy, {
					[action.payload.ds_uid]: {
						[action.payload.tableId]: { $set: action.payload.tableRecords },
					},
					recordsColumnType: {
						[action.payload.ds_uid]: {
							[action.payload.tableId]: { $set: action.payload.columnType },
						},
					},
				});
			}

		case "RESET_SAMPLE_RECORDS":
			return initialRecords;

		default:
			return state;
	}
};

export default SampleRecordsReducer;
