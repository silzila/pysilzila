import { Button, Popover } from "@mui/material";
import data from "../DataSet/Data.json";

// TODO: Priority 2 - Action button functions
// Functions like remove & rename are to be implemented
const ActionPopover = (props) => {
	const { open, setOpen, anchorEl } = props;
	return (
		<>
			<Popover
				open={open}
				anchorEl={anchorEl}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "left",
				}}
			>
				{data.actions.map((act, i) => {
					return (
						<div key={i}>
							<Button
								style={{ backgroundColor: "grey" }}
								variant="contained"
								// onClick={selectAction}
								id={act.id}
							>
								{act.actionName}
							</Button>
						</div>
					);
				})}
				<Button
					style={{ backgroundColor: "grey" }}
					variant="contained"
					onClick={() => setOpen(false)}
				>
					cancel
				</Button>
			</Popover>
		</>
	);
};
export default ActionPopover;
