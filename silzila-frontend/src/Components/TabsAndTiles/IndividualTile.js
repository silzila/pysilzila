// This component returns one single tile within the tabRibbon.
// Each tile has actions to rename the tile & delete the tile

import React, { useState } from "react";
import "./individualTile.css";

function IndividualTile({
	// props from Parent
	tabName,
	tileName,
	editing,
	selectedTile,
	tabId,
	tileId,
	showDash,

	// functions in parent
	renameTileBegin,
	renameTileComplete,
	selectTile,
	removeTile,
}) {
	const [renameValue, setRenameValue] = useState(tileName);

	const handleTileNameValue = (e) => {
		setRenameValue(e.target.value);
	};

	if (selectedTile === tileId && editing) {
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
					onChange={handleTileNameValue}
					className="editTileSelected"
					onBlur={() => renameTileComplete(renameValue, tabId, tileId)}
					title="Press enter or click away to save"
				/>
			</form>
		);
	} else {
		return (
			<span
				className={
					selectedTile === tileId && !showDash
						? "commonTile indiItemHighlightTile"
						: "commonTile indiItemTile"
				}
				onDoubleClick={() => renameTileBegin(tabId, tileId)}
				onClick={() => selectTile(tileId, tileName, tabId, tabName)}
				title={`${tileName}. Double click to edit name`}
			>
				<span>{tileName}</span>
				<span
					title="Delete Tile"
					className="closeTile"
					onClick={(e) => {
						e.stopPropagation();
						removeTile(tabId, tileId);
					}}
				>
					X
				</span>
			</span>
		);
	}
}

export default IndividualTile;
