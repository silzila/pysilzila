import { Popover } from "@mui/material";
import React from "react";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

const AboutPopover = ({ openAbout, setOpenAbout }) => {
	return (
		<Popover
			open={openAbout}
			onClose={setOpenAbout}
			anchorReference="anchorEl"
			anchorOrigin={{
				vertical: "center",
				horizontal: "center",
			}}
			transformOrigin={{
				vertical: "center",
				horizontal: "center",
			}}
		>
			<div
				className="datasetListPopover"
				style={{
					// backgroundColor: "rgb(255,255,255)",
					border: "3px solid rgba(0,123,255,0.75)",
				}}
			>
				<div className="datasetListPopoverHeading">
					<div style={{ flex: 1, textAlign: "center", fontSize: "20px" }}>
						About Silzila
					</div>

					<CloseRoundedIcon onClick={() => setOpenAbout(false)} />
				</div>
				<div>
					Silzila is an Open Source data viaualization tool.
					<br /> Add more text and content to see how it looks
				</div>
			</div>
		</Popover>
	);
};

export default AboutPopover;
