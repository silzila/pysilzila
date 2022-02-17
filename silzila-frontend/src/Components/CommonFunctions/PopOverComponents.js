import { Button, Popover } from "@mui/material";
import { useSelector } from "react-redux";

export const ActionPopover = (props) => {
	const { open, setOpen, selectAction } = props;
	const state = useSelector((state) => state.dataSet);
	return (
		<>
			<Popover
				open={open}
				anchorReference="anchorPosition"
				anchorPosition={{ top: 90, left: 700 }}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "right",
				}}
				transformOrigin={{
					vertical: "top",
					horizontal: "left",
				}}
				onClose={() => {
					setOpen(false);
				}}
			>
				{state.actions.map((act) => {
					return (
						<div style={{ margin: "10px" }}>
							<Button
								style={{ backgroundColor: "grey" }}
								variant="contained"
								onClick={selectAction}
								id={act.id}
							>
								{act.actionName}
							</Button>
						</div>
					);
				})}
			</Popover>
		</>
	);
};
