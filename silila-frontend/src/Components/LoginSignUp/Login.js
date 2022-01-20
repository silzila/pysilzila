import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { serverEndPoint } from "../../ServerCall/EnvironmentVariables";
import { validateEmail, validatePassword } from "../CommonFunctions";

const initialState = {
    email: "",
    emailError: "",

    password: "",
    passwordError: "",
};

const Login = () => {
    const [account, setAccount] = useState(initialState);
    const [loginStatus, setLoginStatus] = useState(false);
    const [loginError, setLoginError] = useState(false);
    const [serverErrorMessage, setServerErrorMessage] = useState("");

    const inputRef = useRef(null);
    const navigate = useNavigate();

    console.log(account);

    //  **************************************************************************************************************************
    //  Email
    //  **************************************************************************************************************************

    const resetEmailError = () => {
        setAccount({
            ...account,
            emailError: "",
        });

        setLoginError(false);
    };

    //  **************************************************************************************************************************
    //  Password
    //  **************************************************************************************************************************

    const resetPwdLengthError = () => {
        setAccount({
            ...account,
            passwordError: "",
        });
    };

    //  **************************************************************************************************************************
    //  Submit actions
    //  **************************************************************************************************************************

    async function handleSubmit(e) {
        e.preventDefault();

        console.log(account);

        var canLogin = false;
        if (account.email.length > 0 && account.password.length > 0) {
            if (account.passwordError === "") {
                console.log("Changed login status");
                canLogin = true;
            } else {
                console.log("Some error in account password");
            }
        } else {
            setAccount({
                ...account,
                emailError: "Please enter a valid email",
            });
        }

        if (canLogin) {
            var response = await getToken();
            console.log(response);
            if (response.status) {
                setTimeout(() => {
                    navigate("/dataConnection");
                }, 1000);
            }
        }
    }

    function getToken() {
        return new Promise((resolve) => {
            const form = new FormData();
            form.append("username", account.email);
            form.append("password", account.password);

            const options = {
                method: "POST",
                url: `${serverEndPoint}user/signin`,
                headers: { "Content-Type": "multipart/form-data" },
                data: form,
            };

            axios
                .request(options)
                .then(function (response) {
                    setLoginStatus(true);
                    resolve({ status: true, token: response.data });
                })
                .catch(function (error) {
                    console.error("==================", error, "\n\n-----", error.response);
                    setLoginError(true);
                    setServerErrorMessage(error.response.data.detail);
                    resolve({ status: false });
                });
        });
    }

    const BottomMessage = () => {
        if (loginStatus) {
            return (
                <span className="loginSuccess">
                    <h4>Logged in successfully!</h4>
                    <p>Redirecting....</p>
                </span>
            );
        } else {
            return (
                <div className="buttonText">
                    <input type="submit" value="Login" />
                    <br />
                    <span id="emailHelp">
                        Already have an account? <Link to="/signup">Sign Up</Link>
                    </span>
                </div>
            );
        }
    };

    const LoginError = () => {
        if (loginError) {
            return <p className="loginFail">{serverErrorMessage}</p>;
        } else {
            return null;
        }
    };

    return (
        <div>
            <h3>Welcome to Silzila!</h3>

            <form onSubmit={handleSubmit} autoComplete="on">
                <div draggable="true">
                    <input
                        ref={inputRef}
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
                            setLoginError(false);
                            var valid = validateEmail(account.email);
                            if (valid) {
                                setAccount({ ...account, emailError: "" });
                            } else {
                                setAccount({ ...account, emailError: "Enter valid email address" });
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
                        onFocus={resetPwdLengthError}
                        onBlur={() => {
                            setLoginError(false);
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

                <div className="buttonSuccess">
                    <LoginError />
                    <BottomMessage />
                </div>
            </form>
        </div>
    );
};

export default Login;
