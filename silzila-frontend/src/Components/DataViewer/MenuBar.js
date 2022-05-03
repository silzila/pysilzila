import React, { useState } from "react";
import { connect } from "react-redux";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import {
	toggleDashMode,
	toggleDashModeInTab,
	toggleGraphSize,
} from "../../redux/TabTile/actionsTabTile";
import {
	Button,
	Dialog,
	FormControl,
	Menu,
	MenuItem,
	Modal,
	Popover,
	Select,
	TextField,
	Typography,
} from "@mui/material";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";

const MenuBar = ({
	// state
	tabTileProps,
	tabState,
	tileState,
	chartProperty,
	chartControl,

	// dispatch
	toggleGraphSize,
	toggleDashMode,
	toggleDashModeInTab,
}) => {
	const propKey = `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`;

	const menuStyle = { fontSize: "12px", padding: "2px 8px", margin: 0 };

	const [openFileMenu, setOpenFileMenu] = useState(false);
	const [anchorEl, setAnchorEl] = useState(null);

	const [saveModal, setSaveModal] = useState(false);
	const [playBookName, setPlayBookName] = useState("");

	const handleSave = () => {
		console.log("Open Popover to save playbook");
		setOpenFileMenu(false);

		// check if this playbook already has a name / id
		// if Yes, save in the same name
		// If no, open a popover to get a name for this Playbook

		setSaveModal(true);
	};

	var fileMenuStyle = { fontSize: "12px", padding: "2px 1rem" };

	const savePlaybook = () => {
		setSaveModal(false);
		// Get all data from redux store and export it as a JSON file.

		var playBookObj = {
			name: playBookName,
			data: {
				tabState,
				tileState,
				tabTileProps,
				chartProperty,
				// chartControl,
			},
		};
		var chartControlCopy = JSON.parse(JSON.stringify(chartControl));
		Object.keys(chartControlCopy.properties).forEach((property) => {
			console.log(property);
			chartControlCopy.properties[property].chartData = {};
		});

		playBookObj.data.chartControl = chartControlCopy;
		console.log(chartControlCopy);

		console.log(playBookObj);
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
						handleSave();
					}}
				>
					Save PlayBook
				</MenuItem>
				<MenuItem sx={fileMenuStyle}>Save As</MenuItem>
			</Menu>
		);
	};

	return (
		<div className="dataViewerMenu">
			<div className="menuHome">
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
				<div className="menuItem">Edit</div>
				<div className="menuItem">Data</div>
			</div>

			{tabState.tabs[tabTileProps.selectedTabId].showDash ? (
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
						console.log(e.target.value);
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

			<FileMenu />

			<Dialog open={saveModal}>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						padding: "5px",
						width: "350px",
						height: "auto",
						justifyContent: "center",
					}}
				>
					<div style={{ fontWeight: "bold", textAlign: "center" }}>
						Save playbook
						<p></p>
						<TextField
							size="small"
							id="standard-basic"
							label="Playbook Name"
							variant="outlined"
							onChange={(e) => setPlayBookName(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									savePlaybook();
								}
							}}
						/>
					</div>
					<div
						style={{ padding: "15px", justifyContent: "space-around", display: "flex" }}
					>
						<Button
							style={{ backgroundColor: "grey", float: "right" }}
							onClick={() => setSaveModal(false)}
							variant="contained"
						>
							Cancel
						</Button>
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
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
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
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(MenuBar);
