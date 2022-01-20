let signedInObj = {
    isUserLogged: "false",
    accessToken: "",
    email: "",
};

const loggedReducer = (state = signedInObj, action) => {
    switch (action.type) {
        default:
            return state;
    }
};

export default loggedReducer;
