import update from "immutability-helper";

const SampleRecordsReducer = (state = { recordsColumnType: {} }, action) => {
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

		// case "ADD_TABLE_RECORDS_TYPE":
		// 	console.log(state.recordsColumnType[action.payload.ds_uid]);
		// 	if (state.recordsColumnType[action.payload.ds_uid] !== undefined) {
		// 		return update(state, {
		// 			recordsColumnType: {
		// 				[action.payload.ds_uid]: {
		// 					[action.payload.tableId]: { $set: action.payload.columnType },
		// 				},
		// 			},
		// 		});
		// 	} else {
		// 		console.log("Setting Records Template");
		// 		var stateCopy2 = Object.assign(state);
		// 		var dsObj2 = { [action.payload.ds_uid]: {} };
		// 		stateCopy2 = update(stateCopy, { recordsColumnType: { $merge: dsObj2 } });
		// 		console.log(stateCopy2);

		// 		return update(state, {
		// 			recordsColumnType: {
		// 				[action.payload.ds_uid]: {
		// 					[action.payload.tableId]: { $set: action.payload.columnType },
		// 				},
		// 			},
		// 		});
		// 	}

		default:
			return state;
	}
};

export default SampleRecordsReducer;
