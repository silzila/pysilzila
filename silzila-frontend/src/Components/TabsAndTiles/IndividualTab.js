import { width } from "@mui/system";
import React, { useState } from "react";
import "./individualTab.css";

function IndividualTab({
	// props from Parent
	tabName,
	editing,
	selectedTab,
	tabId,
	showDash,
	dashMode,

	// functions in parent
	selectTab,
	removeTab,
	renameTabBegin,
	renameTabComplete,
}) {
	const [renameValue, setRenameValue] = useState(tabName);

	const handleTabNameValue = (e) => {
		setRenameValue(e.target.value);
	};

	console.log(selectedTab, tabId);

	// TODO: Priority 5 - Tab Max width
	// 		- Set Tab max width to 250px
	// 		- Tooltip shows tile name and the text "Double click to edit". Show the latter in next line in a custom tooltip

	if (selectedTab === tabId && editing) {
		return (
			<form
				style={{ display: "inline" }}
				onSubmit={(evt) => {
					evt.currentTarget.querySelector("input").blur();
					evt.preventDefault();
				}}
			>
				<input
					autoFocus
					value={renameValue}
					onChange={handleTabNameValue}
					className="editTabSelected"
					onBlur={() => renameTabComplete(renameValue, tabId)}
					title="Press enter or click away to save"
				/>
			</form>
		);
	} else {
		return (
			<span
				className={
					selectedTab === tabId
						? "commonTab indiItemHighlightTab"
						: "commonTab indiItemTab"
				}
				onDoubleClick={() => {
					if (dashMode !== "Present") {
						renameTabBegin(tabId);
					}
				}}
				title={`${tabName}. Double click to edit name`}
			>
				<span
					className="tabText"
					onClick={() => {
						selectTab(tabName, tabId);
					}}
				>
					{tabName}
				</span>

				{/* If dashboard in the presentation mode the 'X'(closing tab icon) will be disappear */}
				{dashMode !== "Present" ? (
					<span
						title="Delete Tab"
						className="closeTab"
						onClick={() => removeTab(tabName, tabId)}
					>
						X
					</span>
				) : null}
			</span>
		);
	}
}

export default IndividualTab;
