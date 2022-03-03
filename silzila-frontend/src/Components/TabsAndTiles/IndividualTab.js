import React, { useState } from "react";
import "./individualTab.css";

function IndividualTab({
	// props from Parent
	tabName,
	editing,
	selectedTab,
	tabId,

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
				onDoubleClick={() => renameTabBegin(tabId)}
				title={`${tabName}. Double click to edit name`}
			>
				<span onClick={() => selectTab(tabName, tabId)}>{tabName}</span>
				<span
					title="Delete Tab"
					className="closeTab"
					onClick={() => removeTab(tabName, tabId)}
				>
					X
				</span>
			</span>
		);
	}
}

export default IndividualTab;
