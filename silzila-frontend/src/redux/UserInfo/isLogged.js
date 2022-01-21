let signedInObj = {
    isUserLogged: false,
    accessToken: "",
};

const loggedReducer = (state = signedInObj, action) => {
    switch (action.type) {
        case "USER_AUTHENTICATED":
            console.log("User authenticated");
            return action.payload;

        default:
            return state;
    }
};

export default loggedReducer;
