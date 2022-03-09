import { Button, Dialog, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { NotificationDialog } from "../CommonFunctions/DialogComponents";
import ShortUniqueId from "short-unique-id";
import { connect } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import { resetState } from "../../redux/Dataset/datasetActions";
// TODO: Priority 1 - Reset dataset values - completed
// Cleanup redux after new dataset is created, or when going back to data home and coming here again

const BottomBar = ({
	//state
	schema,
	tempTable,
	arrows,
	connection,
	token,
	relationships,
	friendly_name,
	dsId,
}) => {
	const [fname, setFname] = useState("");
	const [openAlert, setOpenAlert] = useState(false);
	const [testMessage, setTestMessage] = useState("");
	const [severity, setSeverity] = useState("success");
	const [sendOrUpdate, setSendOrUpdate] = useState("send");
	const [open, setOpen] = useState(false);
	const [editMode, setEditMode] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		if (friendly_name) {
			setFname(friendly_name);
			setSendOrUpdate("update");
			setEditMode(true);
		}
	}, []);
	console.log(fname);

	const tbs = [];

	const checkTableRelationShip = (data_schema_tables, tableWithRelation) => {
		if (data_schema_tables.length > 1) {
			data_schema_tables.map((el) => {
				if (tableWithRelation.includes(el.table_name)) {
					console.log("----");
				} else {
					tbs.push(el.table_name);
				}
			});
		}
		if (tbs.length !== 0) {
			setSeverity("error");
			setOpenAlert(true);
			setTestMessage(
				"Error: Every table should have atleast one relationship.\n" +
					"tables with no Relationship\t" +
					tbs.map((el) => el)
			);
			setTimeout(() => {
				setOpenAlert(false);
				setTestMessage("");
			}, 4000);
		}
		if (tbs.length === 0 || (data_schema_tables.length === 1 && relationships.length === 0)) {
			var meth;
			var apiurl;
			if (editMode) {
				meth = "PUT";
				apiurl = "https://silzila.org/api/ds/update-ds/" + dsId;
			} else {
				meth = "POST";
				apiurl = "https://silzila.org/api/ds/create-ds";
			}
			const options = {
				method: meth,
				url: apiurl,
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				data: {
					dc_uid: connection,
					friendly_name: fname,
					data_schema: {
						tables: [...data_schema_tables],
						relationships: [...relationships],
					},
				},
			};
			console.log(options.data);
			axios
				.request(options)
				.then(function (response) {
					console.log(response.data);
					setSeverity("success");
					setOpenAlert(true);
					setTestMessage("Saved Successfully!");
					setTimeout(() => {
						setOpenAlert(false);
						setTestMessage("");
						navigate("/datahome");
					}, 2000);
				})
				.catch(function (error) {
					console.log(error.response.data.detail);
					setSeverity("error");
					setOpenAlert(true);
					setTestMessage(error.response.data.detail);
					setTimeout(() => {
						setOpenAlert(false);
						setTestMessage("");
					}, 4000);
				});
		}
		if (data_schema_tables.length > 1 && relationships.length === 0) {
			setSeverity("error");
			setOpenAlert(true);
			setTestMessage(
				"Error: Every table should have atleast one relationship.\n" +
					"tables with no Relationship\t" +
					tbs.map((el) => el)
			);
			setTimeout(() => {
				setOpenAlert(false);
				setTestMessage("");
			}, 4000);
		}
	};

	const onSendData = () => {
		if (fname !== "") {
			const uid = new ShortUniqueId({ length: 8 });
			const data_schema_tables = tempTable.map((el) => {
				return {
					table_name: el.tableName,
					schema_name: schema,
					id: uid(),
					alias: el.alias,
				};
			});
			console.log(data_schema_tables);
			const temp1 = [];
			const temp2 = [];
			arrows.forEach((el) => {
				temp1.push(el.startTableName);
				temp2.push(el.endTableName);
			});
			const tableWithRelation = [...temp1, ...temp2];
			checkTableRelationShip(data_schema_tables, tableWithRelation);
		} else {
			setSeverity("error");
			setOpenAlert(true);
			setTestMessage("Please Enter Friendly Name");
			setTimeout(() => {
				setOpenAlert(false);
				setTestMessage("");
			}, 4000);
		}
	};

	const onCancelOnDataset = () => {
		setOpen(true);
	};

	return (
		<div className="bottomBar">
			<div style={{ float: "left" }}>
				<label>Friendly name</label>
				<TextField
					value={fname}
					onChange={(e) => setFname(e.target.value)}
					variant="outlined"
				/>
			</div>
			<Button variant="contained" onClick={onSendData}>
				{sendOrUpdate}
			</Button>
			<Button variant="contained" onClick={onCancelOnDataset}>
				cancel
			</Button>
			<NotificationDialog
				onCloseAlert={() => {
					setOpenAlert(false);
					setTestMessage("");
				}}
				severity={severity}
				testMessage={testMessage}
				openAlert={openAlert}
			/>
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
						CANCEL DATASET CREATION
						<CloseIcon style={{ float: "right" }} onClick={() => setOpen(false)} />
						<br />
						<br />
						<p style={{ fontWeight: "normal" }}>
							Cancel will reset this dataset creation. Do you want to discard the
							progress?
						</p>
					</div>
					<div
						style={{ padding: "15px", justifyContent: "space-around", display: "flex" }}
					>
						<Button
							style={{ backgroundColor: "red" }}
							variant="contained"
							onClick={() => {
								resetState();
								setOpen(false);
								// setReset(true);
							}}
						>
							Ok
						</Button>
					</div>
				</div>
			</Dialog>
		</div>
	);
};
const mapStateToProps = (state) => {
	return {
		schema: state.dataSetState.schema,
		tempTable: state.dataSetState.tempTable,
		arrows: state.dataSetState.arrows,
		connection: state.dataSetState.connection,
		token: state.isLogged.accessToken,
		relationships: state.dataSetState.relationships,
		friendly_name: state.dataSetState.friendly_name,
		dsId: state.dataSetState.dsId,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		resetState: () => dispatch(resetState()),
	};
};
export default connect(mapStateToProps, mapDispatchToProps)(BottomBar);
