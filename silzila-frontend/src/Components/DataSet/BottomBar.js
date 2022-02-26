import { Button, TextField } from "@mui/material";
import React, { useState } from "react";
import { NotificationDialog } from "../CommonFunctions/DialogComponents";
import ShortUniqueId from "short-unique-id";
import { connect } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BottomBar = () => {
	// TODO Parse dataSet info and make api call to create Dataset
	return <div className="bottomBar">BottomBar</div>;
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
