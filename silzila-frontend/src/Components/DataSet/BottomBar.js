import { Button, TextField } from "@mui/material";
import React, { useState } from "react";
import { NotificationDialog } from "../CommonFunctions/DialogComponents";
import ShortUniqueId from "short-unique-id";
import { connect } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// TODO: Priority 1 - Reset dataset values
// Cleanup redux after new dataset is created, or when going back to data home and coming here again

const BottomBar = ({
	//state
	schema,
	tempTable,
	arrows,
	connection,
	token,
	relationships,
}) => {
	const [fname, setFname] = useState("");
	const [openAlert, setOpenAlert] = useState(false);
	const [testMessage, setTestMessage] = useState("");
	const [severity, setSeverity] = useState("success");
	const navigate = useNavigate();

	const tbs = [];

	const checkTableRelationShip = (data_schema_tables, tableWithRelation) => {
		if (data_schema_tables.length > 1) {
			data_schema_tables.map((el) => {
				if (tableWithRelation.includes(el.table_name)) {
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

		// TODO: Priority 2 - Tables array should also include friendlyTableName / alias
		//
		// 	Eg.,	{
		// 				table_name: "category",
		// 				schema_name: "pos",
		// 				id: "sLBuiJCY",
		// 				alias: "My Category",
		// 			};

		if (tbs.length === 0 || (data_schema_tables.length === 1 && relationships.length === 0)) {
			// TODO: Priority 5 - Change the below method to use FetchData function like other API calls
			const options = {
				method: "POST",
				url: "https://silzila.org/api/ds/create-ds",
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
			axios
				.request(options)
				.then(function (response) {
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
				return { table_name: el.tableName, schema_name: schema, id: uid() };
			});
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

	return (
		<div className="bottomBar">
			<label>Friendly name</label>
			<TextField onChange={(e) => setFname(e.target.value)} variant="outlined" />
			<Button variant="contained" onClick={onSendData}>
				Send
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
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		// addArrows: (arrow) => dispatch(addArrows(arrow)),
		// clickOnArrow: (payload) => dispatch(clickOnArrow(payload)),
		// setArrowType: (payload) => dispatch(setArrowType(payload)),
		// resetState: () => dispatch(resetState()),
	};
};
export default connect(mapStateToProps, mapDispatchToProps)(BottomBar);
