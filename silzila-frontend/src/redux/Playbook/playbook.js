import update from "immutability-helper";

const initialState = {
	playBookName: null,
	playBookUid: null,
	description: null,
};

const PlayBookReducer = (state = initialState, action) => {
	switch (action.type) {
		case "ADD_PLAYBOOK_UID":
			return update(state, {
				playBookUid: { $set: action.payload.pb_uid },
				playBookName: { $set: action.payload.name },
				description: { $set: action.payload.description },
			});

		case "RESET_PLAYBOOK_DATA":
			return initialState;

		default:
			return state;
	}
};

export default PlayBookReducer;
