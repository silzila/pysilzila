export const addTableRecords = (ds_uid, tableId, tableRecords, columnType) => {
	console.log("Adding records");
	return { type: "ADD_TABLE_RECORDS", payload: { ds_uid, tableId, tableRecords, columnType } };
};
