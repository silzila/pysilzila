import React from "react";
import { Dialog } from "@mui/material";
import "./DataSetup.css";
import { TextField, Button } from "@mui/material";
import FetchData from "../../ServerCall/FetchData";

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

	//value
	token,
}) {
	// =================================================
	// Test DataConnection
	// =================================================
	const handleonTest = async () => {
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
	};

	// ==============================================================
	// Delete Dc
	// ==============================================================

	const deleteDc = async () => {
		var result = await FetchData({
			requestType: "noData",
			method: "DELETE",
			url: "dc/delete-dc/" + dataConnId,
			headers: { Authorization: `Bearer ${token}` },
		});
		if (result.status) {
			console.log("Delete Dc", result.data);
			setSeverity("success");
			setOpenAlert(true);
			setTestMessage("Deleted Successfully!");
			setTimeout(() => {
				setOpenAlert(false);
				setTestMessage("");
				showAndHideForm();
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

	// ================================================
	// Update DC
	// ================================================

	const handleonUpdate = async () => {
		console.log(regOrUpdate, "92");
		var data = {
			vendor: account.vendor,
			url: account.url,
			port: account.port,
			db_name: account.db_name,
			username: account.username,
			password: account.password,
			friendly_name: account.friendly_name,
		};

		var response = await FetchData({
			requestType: "withData",
			method: "PUT",
			url: "dc/update-dc/" + dataConnId,
			headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
			data: data,
		});

		if (response.status) {
			console.log("Update Dc Response", response.data);
			setSeverity("success");
			setOpenAlert(true);
			setTestMessage("Updated Successfully!");
			setTimeout(() => {
				setOpenAlert(false);
				setTestMessage("");
				showAndHideForm();
				getInformation();
			}, 3000);
		} else {
			console.log("Update Dc error", response);
			setSeverity("error");
			setOpenAlert(true);
			setTestMessage(response.data.detail);
			setTimeout(() => {
				setOpenAlert(false);
				setTestMessage("");
			}, 3000);
		}
	};

	return (
		<>
			<Dialog open={showForm} onClose={showAndHideForm}>
				<div style={{ padding: "10px", width: "380px" }}>
					<form
						style={{
							textAlign: "center",
							alignItems: "center",
							display: "flex",
							flexDirection: "column",
							rowGap: "1rem",
						}}
					>
						<h3>Data Connection</h3>
						<TextField
							style={{ width: "70%" }}
							label="Vendor"
							type="text"
							disabled={viewMode}
							onChange={(e) => setAccount({ ...account, vendor: e.target.value })}
							value={account.vendor}
							required={true}
						/>
						<TextField
							style={{ width: "70%" }}
							label="Url"
							type="text"
							disabled={viewMode}
							onChange={(e) => setAccount({ ...account, url: e.target.value })}
							value={account.url}
							required={true}
						/>
						<TextField
							style={{ width: "70%" }}
							label="Port"
							type="number"
							disabled={viewMode}
							onChange={(e) => setAccount({ ...account, port: e.target.value })}
							value={account.port}
							required={true}
						/>
						<TextField
							style={{ width: "70%" }}
							label="Database name"
							type="text"
							disabled={viewMode}
							onChange={(e) => setAccount({ ...account, db_name: e.target.value })}
							value={account.db_name}
							required={true}
						/>
						<TextField
							style={{ width: "70%" }}
							label="Username"
							type="text"
							disabled={viewMode}
							onChange={(e) => setAccount({ ...account, username: e.target.value })}
							value={account.username}
							required={true}
						/>
						<TextField
							style={{ width: "70%" }}
							label="friendly name"
							type="text"
							disabled={viewMode}
							onChange={(e) =>
								setAccount({ ...account, friendly_name: e.target.value })
							}
							value={account.friendly_name}
							required={true}
						/>
						<TextField
							style={{ width: "70%" }}
							label="Password"
							type="password"
							disabled={viewMode}
							onChange={(e) => setAccount({ ...account, password: e.target.value })}
							value={account.password}
							required={true}
						/>
						{viewMode ? (
							<div
								style={{
									margin: "8px auto",
									width: "70%",
									display: "flex",
									flexDirection: "row",
									columnGap: "10%",
								}}
							>
								<Button
									id="formButton"
									variant="contained"
									onClick={showAndHideForm}
								>
									Cancel
								</Button>
								<Button
									id="formButton"
									variant="contained"
									value="Edit"
									onClick={(e) => {
										setViewMode(false);
										handleMode(e);
									}}
								>
									Edit
								</Button>
								<Button id="formButton" variant="contained" onClick={deleteDc}>
									Delete
								</Button>
							</div>
						) : (
							<div
								style={{
									margin: "8px auto",
									width: "70%",
									display: "flex",
									flexDirection: "row",
									columnGap: "10%",
								}}
							>
								<Button id="formButton" variant="contained" onClick={handleonTest}>
									Test
								</Button>
								<Button
									id="formButton"
									variant="contained"
									onClick={
										regOrUpdate === "Update" ? handleonUpdate : handleRegister
									}
								>
									{regOrUpdate}
								</Button>
							</div>
						)}
					</form>
				</div>
			</Dialog>
		</>
	);
}
export default FormDialog;
