// This component returns one single tab within the tabRibbon.
// Each tab has actions to rename the tab & delete the tab

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

				{/* If dashboard is in presentation mode, the 'X'(close tab icon) will disappear */}

				<span
					title="Delete Tab"
					className="closeTab"
					onClick={() => removeTab(tabName, tabId)}
					style={
						dashMode !== "Present"
							? { visibility: "visible" }
							: { visibility: "hidden" }
					}
				>
					X
				</span>
			</span>
		);
	}
}

export default IndividualTab;
