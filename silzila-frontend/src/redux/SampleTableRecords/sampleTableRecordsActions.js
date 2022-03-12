export const addTableRecords = (ds_uid, tableId, tableRecords) => {
	return { type: "ADD_TABLE_RECORDS", payload: { ds_uid, tableId, tableRecords } };
};
