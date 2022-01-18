import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { serverEndPoint } from "../../ServerCall/EnvironmentVariables";

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
    const [canLogin, setCanLogin] = useState(false);

    const inputRef = useRef(null);
    const navigate = useNavigate();

    console.log(account);

    //  **************************************************************************************************************************
    //  Email
    //  **************************************************************************************************************************

    const validateEmail = (e) => {
        let emaill = account.email;
        if (emaill.length > 0) {
            var validEmail = false;
            var re = /\S+@\S+\.\S+/;
            validEmail = re.test(e.target.value);
            if (validEmail) {
                setAccount({
                    ...account,
                    emailError: "",
                });
            } else {
                setAccount({
                    ...account,
                    emailError: "Please enter a valid email address",
                });
            }
        }
    };

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

    const checkPwdLen = (e) => {
        console.log("blur pwd called");
        let pwd = e.target.value;
        if (pwd.length < 8) {
            setAccount({
                ...account,
                passwordError: "Incorrect password",
            });
        } else {
            setAccount({
                ...account,
                passwordError: "",
            });
        }
    };
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
            var token = await getToken();
            console.log(token);
            setTimeout(() => {
                navigate("/dataConnection");
            }, 1000);
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
                    resolve(response.data);
                })
                .catch(function (error) {
                    console.error(error);
                });
        });
    }

    const BottomMessage = () => {
        if (loginStatus) {
            return (
                <span className="loginSuccess">
                    <h3>Logged in successfully!</h3>
                    <p>Redirecting....</p>
                </span>
            );
        } else {
            return (
                <div className="buttonText">
                    <input type="submit" value="Login" />
                    <br />
                    <span id="emailHelp">
                        Already have an account? <Link to="signup">Sign Up</Link>
                    </span>
                </div>
            );
        }
    };

    const LoginError = () => {
        if (loginError) {
            return <p className="loginFail">Something went wrong! Please try again</p>;
        } else {
            return null;
        }
    };

    return (
        <div>
            <h3>Welcome to Silzila!</h3>

            <form onSubmit={handleSubmit} autoComplete="on">
                <div className="" draggable="true">
                    <input
                        ref={inputRef}
                        type="text"
                        className={account.emailInputBorder}
                        placeholder="Email"
                        onChange={(e) =>
                            setAccount({
                                ...account,
                                email: e.target.value,
                            })
                        }
                        onFocus={resetEmailError}
                        onBlur={validateEmail}
                        value={account.email}
                    />
                    <span className={account.emailErrorTextColor}>{account.emailError}</span>
                </div>

                <div className="">
                    <input
                        type="password"
                        className={account.pwd1InputBorder}
                        id="exampleInputPassword1"
                        placeholder="Password"
                        value={account.password}
                        onChange={(e) =>
                            setAccount({
                                ...account,
                                password: e.target.value,
                            })
                        }
                        onBlur={checkPwdLen}
                        onFocus={resetPwdLengthError}
                    />
                    <span id="emailHelp" className={account.pwd1TextColor}>
                        {account.passwordError}
                    </span>
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
