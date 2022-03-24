import { Close } from "@mui/icons-material";
import { Button, Dialog, TextField } from "@mui/material";
import React, { useState } from "react";
import { connect } from "react-redux";
import ShortUniqueId from "short-unique-id";
import { resetState } from "../../redux/Dataset/datasetActions";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { NotificationDialog } from "../CommonFunctions/DialogComponents";

const BottomBar = ({
	// state
	tempTable,
	arrows,
	relationships,
	token,
	connection,
	dsId,

	// dispatch
	resetState,
}) => {
	const [fname, setFname] = useState("");
	const [sendOrUpdate, setSendOrUpdate] = useState("send");
	const [open, setOpen] = useState(false);

	const [openAlert, setOpenAlert] = useState(false);
	const [testMessage, setTestMessage] = useState("");
	const [severity, setSeverity] = useState("success");

	const [editMode, setEditMode] = useState(false);
	const navigate = useNavigate();

	const tablesWithoutRelation = [];

	const checkTableRelationShip = (tablesSelectedInSidebar, tablesWithRelation) => {
		if (tablesSelectedInSidebar.length > 1) {
			tablesSelectedInSidebar.map((el) => {
				if (tablesWithRelation.includes(el.table_name)) {
					console.log("----");
				} else {
					tablesWithoutRelation.push(el.table_name);
				}
			});
		}
		if (tablesWithoutRelation.length !== 0) {
			setSeverity("error");
			setOpenAlert(true);
			setTestMessage(
				"Error: Every table should have atleast one relationship.\n" +
					"tables with no Relationship\n" +
					tablesWithoutRelation.map((el) => el)
			);
			setTimeout(() => {
				setOpenAlert(false);
				setTestMessage("");
			}, 4000);
		}

		var relationshipServerObj = [];
		if (
			tablesWithoutRelation.length === 0 ||
			(tablesSelectedInSidebar.length === 1 && relationships.length === 0)
		) {
			relationships.forEach((relation) => {
				var relationObj = {
					table1: relation.startTableName,
					table2: relation.endTableName,
					cardinality: relation.cardinality,
					ref_integrity: relation.integrity,
					table1_columns: [],
					table2_columns: [],
				};

				var arrowsForRelation = [];
				arrowsForRelation = arrows.filter((arr) => arr.relationId === relation.relationId);
				console.log(arrowsForRelation);
				var tbl1 = [];
				var tbl2 = [];
				arrowsForRelation.forEach((arr) => {
					tbl1.push(arr.startColumnName);
					tbl2.push(arr.endColumnName);
				});

				console.log(tbl1, tbl2);
				relationObj.table1_columns = tbl1;
				relationObj.table2_columns = tbl2;

				console.log(relationObj);
				relationshipServerObj.push(relationObj);
			});

			console.log(relationshipServerObj);

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
						tables: [...tablesSelectedInSidebar],
						relationships: relationshipServerObj,
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

		if (tablesSelectedInSidebar.length > 1 && relationships.length === 0) {
			setSeverity("error");
			setOpenAlert(true);
			setTestMessage(
				"Error: Every table should have atleast one relationship.\n" +
					"tables with no Relationship\t" +
					tablesWithoutRelation.map((el) => el)
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
			const tablesSelectedInSidebar = tempTable.map((el) => {
				return {
					table_name: el.tableName,
					schema_name: el.schema,
					id: uid(),
					alias: el.alias,
				};
			});
			console.log(tablesSelectedInSidebar);
			const temp1 = [];
			const temp2 = [];
			arrows.forEach((el) => {
				temp1.push(el.startTableName);
				temp2.push(el.endTableName);
			});
			const tablesWithRelation = [...temp1, ...temp2];

			console.log(tablesSelectedInSidebar, tablesWithRelation);
			checkTableRelationShip(tablesSelectedInSidebar, tablesWithRelation);
		} else {
			setSeverity("error");
			setOpenAlert(true);
			setTestMessage("Please Enter A Dataset Name");
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
			<TextField
				size="small"
				label="Dataset Name"
				value={fname}
				onChange={(e) => setFname(e.target.value)}
				variant="outlined"
			/>
			<div>
				<Button variant="contained" onClick={onCancelOnDataset} id="cancelButton">
					cancel
				</Button>

				<Button variant="contained" onClick={onSendData} id="setButton">
					{sendOrUpdate}
				</Button>
			</div>

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
						<Close style={{ float: "right" }} onClick={() => setOpen(false)} />
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
		token: state.isLogged.accessToken,
		// schema: state.dataSetState.schema,
		tempTable: state.dataSetState.tempTable,
		arrows: state.dataSetState.arrows,
		relationships: state.dataSetState.relationships,
		connection: state.dataSetState.connection,
		// friendly_name: state.dataSetState.friendly_name,
		dsId: state.dataSetState.dsId,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		resetState: () => dispatch(resetState()),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(BottomBar);
