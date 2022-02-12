import { CloseOutlined } from "@mui/icons-material";
import { Alert, Button, Dialog } from "@mui/material";
import { useDispatch } from "react-redux";

export const NotificationDialog = ({ openAlert, severity, testMessage, onNotifClose }) => {
	return (
		<>
			<Dialog
				open={openAlert}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
				onBackdropClick={onNotifClose}
			>
				<Alert
					style={{
						maxWidth: "auto",
						height: "100px",
						minWidth: "250px",
						alignItems: "center",
						justifyContent: "center",
					}}
					severity={severity}
				>
					{testMessage}
				</Alert>
			</Dialog>
		</>
	);
};

export const ChangeConnection = ({ open, setOpen }) => {
	const dispatch = useDispatch();

	return (
		<>
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
					{/* <div><CloseOutlined onClick={ () => setOpen(false) }/></div> */}
					<p>
						there are unsaved changes in your existing dataset, do you wand to save
						before changing the connection?
					</p>
					<div style={{ padding: "3px 15px 3px 15px" }}>
						<Button
							style={{ backgroundColor: "red" }}
							variant="contained"
							onClick={() => {
								dispatch({ type: "RESET_STATE" });
								setOpen(false);
							}}
						>
							discard anyway
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
		</>
	);
};
