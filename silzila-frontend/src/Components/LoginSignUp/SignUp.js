import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FetchData from "../../ServerCall/FetchData";
import { validateEmail, validateEqualValues, validateMandatory, validatePassword } from "../CommonFunctions";

const initialState = {
    name: "",
    nameError: "",

    email: "",
    emailError: "",

    password: "",
    passwordError: "",

    password2: "",
    password2Error: "",
};

const SignUp = () => {
    const navigate = useNavigate();

    const [account, setAccount] = useState(initialState);

    const [signUpStatus, setSignUpStatus] = useState(false);
    const [signUpError, setSignUpError] = useState(false);
    const [serverErrorMessage, setServerErrorMessage] = useState("");

    const resetNameError = () => {
        setAccount({
            ...account,
            nameError: "",
        });

        setSignUpError(false);
    };

    const resetEmailError = () => {
        setAccount({
            ...account,
            emailError: "",
        });

        setSignUpError(false);
    };

    const resetPasswordError = () => {
        setAccount({
            ...account,
            passwordError: "",
        });

        setSignUpError(false);
    };

    const resetPassword2Error = () => {
        setAccount({
            ...account,
            password2Error: "",
        });

        setSignUpError(false);
    };

    const handleSubmit = async () => {
        console.log("Handlesubmit function called", account);
        var canSignUp = false;

        if (
            account.name.length > 0 &&
            account.email.length > 0 &&
            account.password.length > 0 &&
            account.password2.length > 0 &&
            account.nameError === "" &&
            account.emailError === "" &&
            account.passwordError === "" &&
            account.password2Error === ""
        ) {
            canSignUp = true;
        }

        if (canSignUp) {
            var form = {
                name: account.name,
                email: account.email,
                password: account.password,
            };

            var response = await FetchData({
                requestType: "withData",
                method: "POST",
                url: "user/signup",
                data: form,
                headers: { "Content-Type": "application/json" },
            });

            console.log(response);

            if (response.status) {
                setSignUpStatus(true);

                setTimeout(() => {
                    navigate("/login");
                }, 1000);
            } else {
                setSignUpError(true);
                setServerErrorMessage(response.data.detail);
            }
        } else {
            setSignUpError(true);
            setServerErrorMessage("Provide all details above");
        }
    };

    const BottomMessage = () => {
        if (signUpStatus) {
            return (
                <span className="loginSuccess">
                    <h4>Signed in successfully!</h4>
                    <p>Redirecting to login page....</p>
                </span>
            );
        } else {
            return (
                <React.Fragment>
                    {signUpError ? <p className="loginFail">{serverErrorMessage}</p> : null}
                    <div className="buttonText">
                        <input type="submit" value="Sign Up" />
                        <br />
                        <span id="emailHelp">
                            Already have an account? <Link to="/login">Login</Link>
                        </span>
                    </div>
                </React.Fragment>
            );
        }
    };

    return (
        <div>
            <h3>Welcome to Silzila</h3>
            <form onSubmit={handleSubmit} autoComplete="on">
                <div>
                    <input
                        type="text"
                        placeholder="Name"
                        value={account.name}
                        onChange={(e) =>
                            setAccount({
                                ...account,
                                name: e.target.value,
                            })
                        }
                        onFocus={resetNameError}
                        onBlur={() => {
                            setSignUpError(false);
                            var valid = validateMandatory(account.name);
                            if (valid) {
                                setAccount({ ...account, nameError: "" });
                            } else {
                                setAccount({ ...account, nameError: "Enter your name" });
                            }
                        }}
                    />
                    <div>{account.nameError}</div>
                </div>

                <div>
                    <input
                        type="text"
                        placeholder="Email"
                        value={account.email}
                        onChange={(e) =>
                            setAccount({
                                ...account,
                                email: e.target.value,
                            })
                        }
                        onFocus={resetEmailError}
                        onBlur={() => {
                            setSignUpError(false);
                            var valid = validateEmail(account.email);
                            if (valid) {
                                setAccount({ ...account, emailError: "" });
                            } else {
                                setAccount({ ...account, emailError: "Provide a valid email" });
                            }
                        }}
                    />
                    <div>{account.emailError}</div>
                </div>

                <div>
                    <input
                        type="password"
                        placeholder="Password"
                        value={account.password}
                        onChange={(e) =>
                            setAccount({
                                ...account,
                                password: e.target.value,
                            })
                        }
                        onFocus={resetPasswordError}
                        onBlur={() => {
                            setSignUpError(false);
                            var valid = validatePassword(account.password);
                            if (valid) {
                                setAccount({ ...account, passwordError: "" });
                            } else {
                                setAccount({ ...account, passwordError: "Minimum 8 characters" });
                            }
                        }}
                    />
                    <div>{account.passwordError}</div>
                </div>

                <div>
                    <input
                        type="password"
                        placeholder="Re-enterPassword"
                        value={account.password2}
                        onChange={(e) =>
                            setAccount({
                                ...account,
                                password2: e.target.value,
                            })
                        }
                        onFocus={resetPassword2Error}
                        onBlur={() => {
                            setSignUpError(false);
                            var valid = validateEqualValues(account.password2, account.password);
                            if (valid) {
                                setAccount({ ...account, password2Error: "" });
                            } else {
                                setAccount({ ...account, password2Error: "Passwords don't match" });
                            }
                        }}
                    />
                    <div>{account.password2Error}</div>
                </div>
                <BottomMessage />
            </form>
        </div>
    );
};

export default SignUp;
