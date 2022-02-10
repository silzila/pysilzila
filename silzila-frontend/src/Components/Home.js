import React from "react";
import { connect } from "react-redux";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import DataHome from "./DataConnection/DataHome";
import NewDataSet from "./DataSet/NewDataSet";

import Login from "./LoginSignUp/Login";
import SignUp from "./LoginSignUp/SignUp";

const Home = (props) => {
	return (
		<React.Fragment>
			{props.isUserLogged ? (
				<Router>
					<Routes>
						<Route exact path="/" element={<Login />} />
						<Route exact path="/login" element={<Login />} />
						<Route exact path="/signup" element={<SignUp />} />

						<Route exact path="/datahome" element={<DataHome />} />
						<Route exact path="/newdataset" element={<NewDataSet />} />
					</Routes>
				</Router>
			) : (
				<Router>
					<Routes>
						<Route exact path="/" element={<Login />} />
						<Route exact path="/login" element={<Login />} />
						<Route exact path="/signup" element={<SignUp />} />
					</Routes>
				</Router>
			)}
		</React.Fragment>
	);
};

const mapStateToProps = (state) => {
	return {
		isUserLogged: state.isLogged.isUserLogged,
	};
};

export default connect(mapStateToProps, null)(Home);
