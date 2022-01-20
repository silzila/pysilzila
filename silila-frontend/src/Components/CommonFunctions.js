export const validateEmail = (email) => {
    console.log(email);
    const res =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var result = res.test(String(email).toLowerCase());
    return result;
};

export const validatePassword = (password) => {
    return password.length >= 6 ? true : false;
};
