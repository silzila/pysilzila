import { Alert, Button, Dialog } from "@mui/material";
import { useDispatch } from "react-redux";
import { resetState } from "../../redux/Dataset/datasetActions";

export const NotificationDialog = ({ openAlert, severity, testMessage, onCloseAlert }) => {
	return (
		<>
			<Dialog
				open={openAlert}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
				onClose={onCloseAlert}
			>
				<Alert style={{ padding: "30px" }} severity={severity}>
					{testMessage}
				</Alert>
			</Dialog>
		</>
	);
};

export const ChangeConnection = ({ open, setOpen, setReset }) => {
	const dispatch = useDispatch();

	return (
		<Dialog open={open}>
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
					RESET DATASET
					<br />
					<br />
					<p style={{ fontWeight: "normal" }}>
						Changing connection will reset this dataset creation. Do you want to discard
						the progress?
					</p>
				</div>
				<div style={{ padding: "15px", justifyContent: "space-around", display: "flex" }}>
					<Button
						style={{ backgroundColor: "red" }}
						variant="contained"
						onClick={() => {
							dispatch(resetState());
							setOpen(false);
							setReset(true);
						}}
					>
						Discard
					</Button>
					<Button
						style={{ backgroundColor: "grey", float: "right" }}
						onClick={() => setOpen(false)}
						variant="contained"
					>
						Cancel
					</Button>
				</div>
			</div>
		</Dialog>
	);
};
