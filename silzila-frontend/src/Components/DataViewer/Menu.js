import React, { useState } from "react";
import { connect } from "react-redux";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import {
	toggleDashMode,
	toggleDashModeInTab,
	toggleGraphSize,
} from "../../redux/TabTile/actionsTabTile";
import { MenuItem, Select } from "@mui/material";

const Menu = ({
	// state
	tabTileProps,
	tabState,
	tileState,

	// dispatch
	toggleGraphSize,
	toggleDashMode,
	toggleDashModeInTab,
}) => {
	const propKey = `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`;

	const menuStyle = { fontSize: "12px", padding: "2px 8px", margin: 0 };

	const RenderScreenOption = () => {
		return (
			<>
				<div
					className={
						tileState.tiles[propKey].graphSizeFull
							? "quickSettingSelected"
							: "quickSetting"
					}
					title="Fit Tile Size"
					onClick={() => toggleGraphSize(propKey, true)}
				>
					<FullscreenIcon sx={{ color: "#404040" }} />
				</div>

				<div
					className={
						!tileState.tiles[propKey].graphSizeFull
							? "quickSettingSelected"
							: "quickSetting"
					}
					title="Match Dashboard Size"
					style={
						tabState.tabs[tabTileProps.selectedTabId].tilesInDashboard.includes(propKey)
							? {}
							: { cursor: "not-allowed" }
					}
					onClick={() => {
						if (
							tabState.tabs[tabTileProps.selectedTabId].tilesInDashboard.includes(
								propKey
							)
						)
							toggleGraphSize(propKey, false);
					}}
				>
					<FullscreenExitIcon sx={{ color: "#404040" }} />
				</div>
			</>
		);
	};

	return (
		<div className="dataViewerMenu">
			<div className="menuItemsGroup">
				<div className="menuItem">File</div>
				<div className="menuItem">Edit</div>
				<div className="menuItem">Data</div>
			</div>

			{/* Other elements that could come here */}
			{/* - control buttons  */}
			{/* - user account information */}

			{tabState.tabs[tabTileProps.selectedTabId].showDash ? null : (
				<React.Fragment>
					<div className="quickSettingsGroup">
						<RenderScreenOption />
						{/* <div style={{ borderLeft: "2px solid #999" }}>&nbsp;</div> */}
					</div>
				</React.Fragment>
			)}

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
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		tabTileProps: state.tabTileProps,
		tabState: state.tabState,
		tileState: state.tileState,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		toggleGraphSize: (tileKey, graphSize) => dispatch(toggleGraphSize(tileKey, graphSize)),

		toggleDashMode: (dashMode) => dispatch(toggleDashMode(dashMode)),
		toggleDashModeInTab: (tabId, dashMode) => dispatch(toggleDashModeInTab(tabId, dashMode)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Menu);
