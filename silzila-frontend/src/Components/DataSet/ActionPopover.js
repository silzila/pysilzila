import { Button, Popover } from "@mui/material";
import data from "../DataSet/Data.json";
import { CloseOutlined, CloseTwoTone } from "@mui/icons-material";

// TODO:(c) Priority 2 - Action button functions
// Functions like remove & rename are to be implemented

const ActionPopover = (props) => {
	const { open, setOpen, anchorEl, selectAction } = props;
	return (
		<>
			<Popover
				open={open}
				anchorEl={anchorEl}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "left",
				}}
				onClose={() => setOpen(false)}
			>
				<div style={{ padding: "10px 0", fontSize: "14px", minWidth: "5rem" }}>
					{/* <CloseOutlined
						onClick={() => setOpen(false)}
						sx={{
							cursor: "pointer",
							borderRadius: "4px",
							color: "grey",
							float: "right",
							"&:hover": { backgroundColor: "rgba(0,0,0,0.2)", color: "red" },
						}}
					/> */}
					{data.actions.map((act, i) => {
						return (
							<div key={i}>
								<Button
									sx={{
										textTransform: "none",
										backgroundColor: "transparent",
										cursor: "pointer",
										color: "black",
										fontSize: "13px",
										width: "100%",
										borderRadius: "0",

										"&:hover": { backgroundColor: "rgba(0,0,0,0.1)" },
									}}
									size="small"
									onClick={selectAction}
									id={act.id}
								>
									{act.actionName}
								</Button>
							</div>
						);
					})}
				</div>
			</Popover>
		</>
	);
};
export default ActionPopover;
