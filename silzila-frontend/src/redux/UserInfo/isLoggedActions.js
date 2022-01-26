export const userAuthentication = (payload) => {
    console.log("User Authentication");
    return { type: "USER_AUTHENTICATED", payload: payload };
};
