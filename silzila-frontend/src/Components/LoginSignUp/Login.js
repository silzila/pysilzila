import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { validateEmail, validatePassword } from "../CommonFunctions/CommonFunctions";
import { connect } from "react-redux";
import { userAuthentication } from "../../redux/UserInfo/isLoggedActions";
import FetchData from "../../ServerCall/FetchData";
import { Button, Input } from "@mui/material";
import "./LoginSignUp.css";
import LoadingPopover from "../CommonFunctions/PopOverComponents/LoadingPopover";

const initialState = {
	email: "",
	emailError: "",

	password: "",
	passwordError: "",
};

const Login = (props) => {
	const [account, setAccount] = useState(initialState);
	const [loginStatus, setLoginStatus] = useState(false);
	const [loginError, setLoginError] = useState(false);
	const [serverErrorMessage, setServerErrorMessage] = useState("");

	const [loading, setLoading] = useState(false);

	const inputRef = useRef(null);
	const navigate = useNavigate();

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

	const resetPwdError = () => {
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
		setLoading(true);

		var canLogin = false;
		if (
			account.email.length > 0 &&
			account.password.length > 0 &&
			account.emailError === "" &&
			account.passwordError === ""
		) {
			canLogin = true;
		}

		if (canLogin) {
			const form = new FormData();
			form.append("username", account.email);
			form.append("password", account.password);

			var response = await FetchData({
				requestType: "withData",
				method: "POST",
				url: "user/signin",
				data: form,
				headers: { "Content-Type": "multipart/form-data" },
			});

			if (response.status) {
				setLoginStatus(true);
				var payload = {
					isUserLogged: true,
					accessToken: response.data.access_token,
					tokenType: response.data.token_type,
				};
				props.userAuthentication(payload);
				setTimeout(() => {
					navigate("/datahome");
				}, 1000);
			} else {
				setLoginError(true);
				setServerErrorMessage(response.data.detail);
			}
		} else {
			setLoginError(true);
			setServerErrorMessage("Provide valid credentials");
		}
		setLoading(false);
	}

	return (
		<div id="container1">
			<h2>Welcome to Silzila!</h2>

			<form onSubmit={(e) => handleSubmit(e)} autoComplete="on">
				<div id="formElement">
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
						className="inputElement"
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
					<div id="error">{account.emailError}</div>
				</div>

				<div id="formElement">
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
						className="inputElement"
						onFocus={resetPwdError}
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
					<div id="error">{account.passwordError}</div>
				</div>

				<div className="buttonSuccess">
					{loginStatus ? (
						<span className="loginSuccess">
							<h4>Logged in successfully!</h4>
							<p>Redirecting....</p>
						</span>
					) : (
						<React.Fragment>
							{loginError ? <p className="loginFail">{serverErrorMessage}</p> : null}
							<div className="buttonText">
								<Button
									id="loginSignupButton"
									variant="contained"
									type="submit"
									value="Login"
									onClick={(e) => {
										console.log("Login button clicked");
										handleSubmit(e);
									}}
								>
									Login
								</Button>
								<br />
								<span id="emailHelp">
									Dont have an account yet? <Link to="/signup">Sign Up</Link>
								</span>
							</div>
						</React.Fragment>
					)}
				</div>
			</form>
			{loading ? <LoadingPopover /> : null}
		</div>
	);
};
const mapDispatchToProps = (dispatch) => {
	return {
		userAuthentication: (payload) => dispatch(userAuthentication(payload)),
	};
};
export default connect(null, mapDispatchToProps)(Login);
