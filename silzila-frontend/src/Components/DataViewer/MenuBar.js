import React, { useState } from "react";
import { connect } from "react-redux";
import {
	resetAllStates,
	toggleDashMode,
	toggleDashModeInTab,
} from "../../redux/TabTile/actionsTabTile";
import { Button, Dialog, Menu, MenuItem, Select, TextField } from "@mui/material";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import { NotificationDialog } from "../CommonFunctions/DialogComponents";
import FetchData from "../../ServerCall/FetchData";
import { useNavigate } from "react-router-dom";
import { updatePlaybookUid } from "../../redux/Playbook/playbookActions";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CloseRounded from "@mui/icons-material/CloseRounded";
import { resetUser } from "../../redux/UserInfo/isLoggedActions";

const MenuBar = ({
	// props
	from,

	// state
	token,
	tabTileProps,
	tabState,
	tileState,
	chartProperty,
	chartControl,
	playBookState,

	// dispatch
	toggleDashMode,
	toggleDashModeInTab,
	updatePlayBookId,
	resetAllStates,
	resetUser,
}) => {
	const menuStyle = { fontSize: "12px", padding: "2px 8px", margin: 0 };

	const [openFileMenu, setOpenFileMenu] = useState(false);
	const [anchorEl, setAnchorEl] = useState(null);

	const [saveModal, setSaveModal] = useState(false);
	const [playBookName, setPlayBookName] = useState(playBookState.playBookName);
	const [playBookDescription, setPlayBookDescription] = useState(playBookState.description);

	const [severity, setSeverity] = useState("success");
	const [openAlert, setOpenAlert] = useState(false);
	const [testMessage, setTestMessage] = useState("");

	const [saveFromHomeIcon, setSaveFromHomeIcon] = useState(false);

	const [logoutModal, setLogoutModal] = useState(false);
	const [logoutAnchor, setLogoutAnchor] = useState(null);

	var navigate = useNavigate();

	const handleSave = async (fromHome) => {
		setOpenFileMenu(false);

		// check if this playbook already has a name / id

		if (playBookState.playBookUid !== null) {
			// if Yes, save in the same name
			var playBookObj = formatPlayBookData();

			var result = await FetchData({
				requestType: "withData",
				method: "PUT",
				url: `/pb/update-pb/${playBookState.playBookUid}`,
				data: playBookObj,
				headers: { Authorization: `Bearer ${token}` },
			});

			if (!result.status) {
				console.log(result.data.detail);
			} else {
				setSeverity("success");
				setOpenAlert(true);
				setTestMessage("Successfully saved playbook");
				setTimeout(() => {
					setOpenAlert(false);
					if (fromHome) {
						navigate("/datahome");
						resetAllStates();
					}
				}, 2000);
			}
		} else {
			setSaveModal(true);
		}
	};

	const formatPlayBookData = () => {
		var playBookObj = {
			name: playBookName.trim(),
			content: {
				tabState,
				tileState,
				tabTileProps,
				chartProperty,
				// chartControl,
			},
		};

		if (playBookDescription) playBookObj.description = playBookDescription;
		var chartControlCopy = JSON.parse(JSON.stringify(chartControl));
		Object.keys(chartControlCopy.properties).forEach((property) => {
			chartControlCopy.properties[property].chartData = {};
		});

		playBookObj.content.chartControl = chartControlCopy;

		return playBookObj;
	};

	var fileMenuStyle = { fontSize: "12px", padding: "2px 1rem" };

	const savePlaybook = async () => {
		if (playBookName) {
			var playBookObj = formatPlayBookData();

			var result = await FetchData({
				requestType: "withData",
				method: "POST",
				url: "pb/create-pb",
				data: playBookObj,
				headers: { Authorization: `Bearer ${token}` },
			});

			if (result.status) {
				updatePlayBookId({
					name: result.data.name,
					pb_uid: result.data.pb_uid,
					description: result.data.description,
				});

				setSaveModal(false);

				setSeverity("success");
				setOpenAlert(true);
				setTestMessage("Successfully saved playbook");
				setTimeout(() => {
					setOpenAlert(false);
				}, 2000);
			} else {
				setSeverity("error");
				setOpenAlert(true);
				setTestMessage(result.data.detail);
				setTimeout(() => {
					setOpenAlert(false);
				}, 2000);
			}
		} else {
			setSeverity("error");
			setOpenAlert(true);
			setTestMessage("Provide a Playbook name");

			setTimeout(() => {
				setOpenAlert(false);
			}, 2000);
		}
	};

	const LogOutMenu = () => {
		return (
			<Menu
				open={logoutModal}
				className="RelPopover"
				anchorEl={logoutAnchor}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "left",
				}}
				transformOrigin={{
					vertical: "top",
					horizontal: "left",
				}}
				onClose={() => {
					setAnchorEl(null);
					setOpenFileMenu(false);
				}}
			>
				<MenuItem
					sx={fileMenuStyle}
					onClick={() => {
						handleSave();
						resetUser();
						navigate("/login");
					}}
				>
					Logout
				</MenuItem>
			</Menu>
		);
	};

	const FileMenu = () => {
		return (
			<Menu
				open={openFileMenu}
				className="RelPopover"
				anchorEl={anchorEl}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "left",
				}}
				transformOrigin={{
					vertical: "top",
					horizontal: "left",
				}}
				onClose={() => {
					setAnchorEl(null);
					setOpenFileMenu(false);
				}}
			>
				<MenuItem
					sx={fileMenuStyle}
					onClick={() => {
						setSaveFromHomeIcon(false);
						handleSave();
					}}
				>
					Save PlayBook
				</MenuItem>
				<MenuItem
					sx={fileMenuStyle}
					onClick={() => {
						setOpenFileMenu(false);
						setSaveModal(true);
					}}
				>
					Save As
				</MenuItem>
			</Menu>
		);
	};

	return (
		<div className="dataViewerMenu">
			{from === "dataHome" ? (
				<>
					<div className="menuHome">
						<HomeRoundedIcon sx={{ color: "#666" }} />
					</div>
					<div className="menuItemsGroup">&nbsp;</div>
				</>
			) : null}
			{from === "dataSet" ? (
				<>
					<div
						className="menuHome"
						onClick={() => {
							navigate("/dataHome");
						}}
					>
						<HomeRoundedIcon sx={{ color: "#666" }} />
					</div>
					<div className="menuItemsGroup">&nbsp;</div>
				</>
			) : null}
			{from === "dataViewer" ? (
				<>
					<div
						className="menuHome"
						onClick={() => {
							setSaveFromHomeIcon(true);
							handleSave(true);
						}}
					>
						<HomeRoundedIcon sx={{ color: "#666" }} />
					</div>
					<div className="menuItemsGroup">
						<div
							className="menuItem"
							onClick={(e) => {
								setOpenFileMenu(!openFileMenu);
								setAnchorEl(e.currentTarget);
							}}
						>
							File
						</div>
					</div>

					<div className="playbookName" title={playBookState.description}>
						{playBookState.playBookName}
					</div>

					<div className="userInfo">
						{tabState.tabs[tabTileProps.selectedTabId].showDash ||
						tabTileProps.showDash ? (
							<Select
								size="small"
								sx={{
									height: "1.5rem",
									fontSize: "12px",
									width: "6rem",
									margin: "auto 0.5rem",
								}}
								value={tabTileProps.dashMode}
								onChange={(e) => {
									toggleDashMode(e.target.value);
									toggleDashModeInTab(tabTileProps.selectedTabId, e.target.value);
								}}
							>
								<MenuItem sx={menuStyle} value="Edit">
									Edit
								</MenuItem>
								<MenuItem sx={menuStyle} value="Present">
									Present
								</MenuItem>
							</Select>
						) : null}
					</div>
				</>
			) : null}
			<div
				className="menuHome"
				onClick={(e) => {
					setLogoutAnchor(e.currentTarget);
					setLogoutModal(!logoutModal);
				}}
			>
				<AccountCircleIcon sx={{ padding: "auto 1rem" }} />
			</div>

			<FileMenu />

			<LogOutMenu />

			<Dialog open={saveModal}>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						padding: "8px",
						width: "400px",
						height: "auto",
						justifyContent: "center",
					}}
				>
					<div style={{ fontWeight: "bold", textAlign: "center" }}>
						<div style={{ display: "flex" }}>
							<span style={{ flex: 1 }}>Save playbook</span>

							<CloseRounded
								style={{ margin: "0.25rem" }}
								onClick={() => setSaveModal(false)}
							/>
						</div>
						<p></p>
						<div style={{ padding: "0 50px" }}>
							<TextField
								required
								size="small"
								fullWidth
								id="standard-basic"
								label="Playbook Name"
								variant="outlined"
								onChange={(e) => setPlayBookName(e.target.value)}
								onKeyDown={(e) => {
									if (e.key === "Enter") {
										savePlaybook();
									}
								}}
								value={playBookName}
							/>
							<br />
							<br />
							<TextField
								label="Description"
								size="small"
								fullWidth
								onChange={(e) => setPlayBookDescription(e.target.value)}
								onKeyDown={(e) => {
									if (e.key === "Enter") {
										savePlaybook();
									}
								}}
							/>
						</div>
					</div>
					<div
						style={{ padding: "15px", justifyContent: "space-around", display: "flex" }}
					>
						{saveFromHomeIcon ? (
							<Button
								style={{ backgroundColor: "red", float: "right" }}
								onClick={() => navigate("/datahome")}
								variant="contained"
							>
								Discard
							</Button>
						) : null}

						<Button
							style={{ backgroundColor: "rgb(0,123,255)" }}
							variant="contained"
							onClick={() => savePlaybook()}
						>
							Save
						</Button>
					</div>
				</div>
			</Dialog>
			<NotificationDialog
				openAlert={openAlert}
				severity={severity}
				testMessage={testMessage}
				onCloseAlert={() => {
					setOpenAlert(false);
					setTestMessage("");
				}}
			/>
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		playBookState: state.playBookState,
		token: state.isLogged.accessToken,
		tabTileProps: state.tabTileProps,
		tabState: state.tabState,
		tileState: state.tileState,
		chartProperty: state.chartProperties,
		chartControl: state.chartControls,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		toggleDashMode: (dashMode) => dispatch(toggleDashMode(dashMode)),
		toggleDashModeInTab: (tabId, dashMode) => dispatch(toggleDashModeInTab(tabId, dashMode)),
		updatePlayBookId: (pbUid) => dispatch(updatePlaybookUid(pbUid)),
		resetAllStates: () => dispatch(resetAllStates()),
		resetUser: () => dispatch(resetUser()),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(MenuBar);
