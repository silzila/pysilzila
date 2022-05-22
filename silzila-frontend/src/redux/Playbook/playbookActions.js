export const updatePlaybookUid = (playBookObj) => {
	return { type: "ADD_PLAYBOOK_UID", payload: playBookObj };
};

export const resetPlayBookData = () => {
	return { type: "RESET_PLAYBOOK_DATA" };
};
