import React, { useState, useEffect } from "react";
import { Dialog, Popover } from "@mui/material";
import "./DataSetup.css";
import { TextField, Button } from "@mui/material";
import FetchData from "../../ServerCall/FetchData";
import TextFieldComponent from "../../Components/CommonFunctions/TextFieldComponent";
import CloseIcon from "@mui/icons-material/Close";

function FormDialog({
	//state
	account,
	setAccount,
	viewMode,
	setViewMode,
	showForm,
	regOrUpdate,
	setSeverity,
	setOpenAlert,
	setTestMessage,
	dataConnId,

	//function
	showAndHideForm,
	handleMode,
	handleRegister,
	getInformation,
	handleonUpdate,

	//value
	token,
}) {
	const [dcDel, setDcDel] = useState(false);
	const [dcDelMeg, setDcDelMeg] = useState("");
	let dsList = [];
	const [btnEnable, setBtnEnable] = useState(false);

	const btnEnabelDisable = () => {
		if (
			account.vendor !== "" &&
			account.url !== "" &&
			account.port !== "" &&
			account.db_name !== "" &&
			account.username !== "" &&
			account.friendly_name !== "" &&
			account.password !== ""
		) {
			setBtnEnable(false);
		} else {
			setBtnEnable(true);
		}
	};

	// =================================================
	// Test DataConnection
	// =================================================
	const handleonTest = async () => {
		if (
			account.vendor !== "" &&
			account.url !== "" &&
			account.port !== "" &&
			account.db_name !== "" &&
			account.username !== "" &&
			account.friendly_name !== "" &&
			account.password !== ""
		) {
			let data = {
				friendly_name: account.friendly_name,
				vendor: account.vendor,
				url: account.url,
				port: account.port,
				db_name: account.db_name,
				username: account.username,
				password: account.password,
			};

			var response = await FetchData({
				requestType: "withData",
				method: "POST",
				url: "dc/test-dc",
				headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
				data: data,
			});

			if (response.status && response.data.message === "Test Seems OK") {
				setSeverity("success");
				setOpenAlert(true);
				setTestMessage("Test Seems Ok");
				setTimeout(() => {
					setOpenAlert(false);
					setTestMessage("");
				}, 3000);
			} else {
				setSeverity("error");
				setOpenAlert(true);
				setTestMessage(response.data.detail);
				setTimeout(() => {
					setOpenAlert(false);
					setTestMessage("");
				}, 4000);
			}
		} else {
			setSeverity("error");
			setOpenAlert(true);
			setTestMessage("Please Fillout All the fields");
			setTimeout(() => {
				setOpenAlert(false);
				setTestMessage("");
			}, 4000);
		}
	};

	// ==============================================================
	// Delete Dc
	// ==============================================================

	const deleteDcWarning = async () => {
		var result = await FetchData({
			requestType: "noData",
			method: "GET",
			url: "ds/get-all-ds",
			headers: { Authorization: `Bearer ${token}` },
		});

		console.log(result);
		if (result.status) {
			result.data.map((ds) => {
				if (ds.dc_uid === account.dc_uid) {
					dsList.push(ds.friendly_name);
				}
			});
			if (dsList.length !== 0) {
				setDcDel(true);
				setDcDelMeg(
					"Following Datasets are using this dataConnection," +
						"\n" +
						dsList.map((ds) => <p>{ds}</p>) +
						"\n" +
						"are you sure you want to delete this Connection?"
				);
			} else {
				setDcDel(true);
				setDcDelMeg("Are you sure you want to delete this connection?");
			}
		} else {
			console.log(result.data.detail);
			dsList = [];
			setDcDel(true);
		}
	};

	const deleteDc = async () => {
		var result = await FetchData({
			requestType: "noData",
			method: "DELETE",
			url: "dc/delete-dc/" + dataConnId,
			headers: { Authorization: `Bearer ${token}` },
		});
		if (result.status) {
			setDcDel(false);
			console.log("Delete Dc", result.data);
			setSeverity("success");
			setOpenAlert(true);
			setTestMessage("Deleted Successfully!");
			setTimeout(() => {
				setOpenAlert(false);
				setTestMessage("");
				showAndHideForm();
				setDcDelMeg("");
				getInformation();
			}, 3000);
		} else {
			console.log("Delete Dc", result.data.detail);
			setSeverity("error");
			setOpenAlert(true);
			setTestMessage(result.data.detail);
			setTimeout(() => {
				setOpenAlert(false);
				setTestMessage("");
			}, 3000);
		}
	};
	// =========================================================================
	// On Form Submit (register Or update)
	// =========================================================================

	const onSubmit = () => {
		if (
			account.vendor !== "" &&
			account.url !== "" &&
			account.port !== "" &&
			account.db_name !== "" &&
			account.username !== "" &&
			account.friendly_name !== "" &&
			account.password !== ""
		) {
			console.log(regOrUpdate);
			if (regOrUpdate === "Update") {
				handleonUpdate();
			}
			if (regOrUpdate === "Register") {
				handleRegister();
			}
		}
	};

	return (
		<>
			<Dialog
				open={showForm}
				// onClose={showAndHideForm}
			>
				<div style={{ padding: "10px", width: "400px" }}>
					<form
						style={{
							// textAlign: "center",
							alignItems: "center",
							display: "flex",
							flexDirection: "column",
							rowGap: "10px",
						}}
					>
						<div
							style={{
								display: "grid",
								gridTemplateColumns: "95% 5%",
								textAlign: "center",
								width: "100%",
							}}
						>
							{viewMode ? (
								<h3>Data Connection</h3>
							) : regOrUpdate === "Update" ? (
								<h3>Edit Data Connection</h3>
							) : (
								<h3>Create Data Connection</h3>
							)}

							<CloseIcon onClick={showAndHideForm} />
						</div>
						{/*========================== Reusable Component from ../CommonFunctions/TextFieldComponents========================= */}
						<TextFieldComponent
							onChange={(e) => {
								setAccount({ ...account, vendor: e.target.value });
								btnEnabelDisable();
							}}
							onFocus={() => setAccount({ ...account, vendorError: "" })}
							onBlur={() => {
								if (account.vendor.length === 0) {
									setAccount({
										...account,
										vendorError: "vendor should not be Empty",
									});
									btnEnabelDisable();
								}
							}}
							{...{ viewMode, value: account.vendor, lable: "Vendor" }}
						/>
						<small style={{ color: "red" }}>{account.vendorError}</small>
						<TextFieldComponent
							onChange={(e) => {
								setAccount({ ...account, url: e.target.value });
								btnEnabelDisable();
							}}
							onFocus={() => setAccount({ ...account, urlError: "" })}
							onBlur={() => {
								if (account.url.length === 0) {
									setAccount({
										...account,
										urlError: "url should not be Empty",
									});
									btnEnabelDisable();
								}
							}}
							{...{ viewMode, value: account.url, lable: "Url" }}
						/>
						<small style={{ color: "red" }}>{account.urlError}</small>
						<TextFieldComponent
							onChange={(e) => {
								setAccount({ ...account, port: e.target.value });
								btnEnabelDisable();
							}}
							onFocus={() => setAccount({ ...account, portError: "" })}
							onBlur={() => {
								if (account.port.length === 0) {
									setAccount({
										...account,
										portError: "port should not be Empty",
									});
									btnEnabelDisable();
								}
							}}
							{...{ viewMode, value: account.port, lable: "Port", type: "number" }}
						/>
						<small style={{ color: "red" }}>{account.portError}</small>
						<TextFieldComponent
							onChange={(e) => {
								setAccount({ ...account, db_name: e.target.value });
								btnEnabelDisable();
							}}
							onFocus={() => setAccount({ ...account, db_nameError: "" })}
							onBlur={() => {
								if (account.db_name.length === 0) {
									setAccount({
										...account,
										db_nameError: "Database should not be Empty",
									});
									btnEnabelDisable();
								}
							}}
							{...{ viewMode, value: account.db_name, lable: "Database" }}
						/>
						<small style={{ color: "red" }}>{account.db_nameError}</small>
						<TextFieldComponent
							onChange={(e) => {
								setAccount({ ...account, username: e.target.value });
								btnEnabelDisable();
							}}
							onFocus={() => setAccount({ ...account, usernameError: "" })}
							onBlur={() => {
								if (account.username.length === 0) {
									setAccount({
										...account,
										usernameError: "Username should not be Empty",
									});
									btnEnabelDisable();
								}
							}}
							{...{ viewMode, value: account.username, lable: "Usename" }}
						/>
						<small style={{ color: "red" }}>{account.usernameError}</small>
						<TextFieldComponent
							onChange={(e) => {
								setAccount({ ...account, friendly_name: e.target.value });
								btnEnabelDisable();
							}}
							onFocus={() => setAccount({ ...account, friendly_nameError: "" })}
							onBlur={() => {
								if (account.friendly_name.length === 0) {
									setAccount({
										...account,
										friendly_nameError: "Friendly Name should not be Empty",
									});
									btnEnabelDisable();
								}
							}}
							{...{ viewMode, value: account.friendly_name, lable: "Friendly name" }}
						/>
						<small style={{ color: "red" }}>{account.friendly_nameError}</small>
						<TextFieldComponent
							onChange={(e) => {
								setAccount({ ...account, password: e.target.value });
								btnEnabelDisable();
							}}
							onFocus={() => setAccount({ ...account, passwordError: "" })}
							onBlur={() => {
								if (account.password.length === 0) {
									setAccount({
										...account,
										passwordError: "Password should not be Empty",
									});
									btnEnabelDisable();
								}
							}}
							{...{
								viewMode,
								value: account.password,
								lable: "Password",
								type: "password",
							}}
						/>
						<small style={{ color: "red" }}>{account.passwordError}</small>
						{viewMode ? (
							<div
								style={{
									margin: "10px auto",
									display: "flex",
									columnGap: "40px",
								}}
							>
								<Button
									id="formButton"
									variant="contained"
									value="Edit"
									onClick={(e) => {
										setViewMode(false);
										setBtnEnable(true);
										handleMode(e);
									}}
								>
									Edit
								</Button>
								<Button
									id="formButton"
									variant="contained"
									style={{ backgroundColor: "red" }}
									onClick={deleteDcWarning}
								>
									Delete
								</Button>
							</div>
						) : (
							<div
								style={{
									margin: "10px auto",
									display: "flex",
									columnGap: "40px",
								}}
							>
								<Button
									id="formButton"
									variant="contained"
									onClick={handleonTest}
									disabled={btnEnable}
								>
									Test
								</Button>
								<Button
									id="formButton"
									type="submit"
									variant="contained"
									style={{ backgroundColor: "green" }}
									onClick={onSubmit}
									disabled={btnEnable}
								>
									{regOrUpdate}
								</Button>
							</div>
						)}
					</form>
				</div>
			</Dialog>
			<Popover
				anchorOrigin={{
					vertical: "center",
					horizontal: "center",
				}}
				anchorReference="anchorPosition"
				anchorPosition={{ top: 300, left: 530 }}
				open={dcDel}
				// onClose={() => {
				// 	setDcDel(false);
				// }}
			>
				<p>{dcDelMeg}</p>
				<div style={{ margin: "0px 0px 0px auto", display: "flex", columnGap: "20px" }}>
					<Button
						id="formButton"
						variant="contained"
						style={{ backgroundColor: "black", float: "left" }}
						onClick={() => {
							setDcDel(false);
						}}
					>
						Cancel
					</Button>
					<Button
						onClick={deleteDc}
						id="formButton"
						variant="contained"
						style={{ backgroundColor: "red" }}
					>
						Delete
					</Button>
				</div>
			</Popover>
		</>
	);
}
export default FormDialog;
