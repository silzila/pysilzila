import React from "react";
import { connect } from "react-redux";
import { HashRouter as Router, Route, Routes } from "react-router-dom";

import Login from "./LoginSignUp/Login";

const Home = (props) => {
    return (
        <React.Fragment>
            {props.isUserLogged ? (
                <Router>
                    <Routes>
                        <Route exact path="/" element={<Login />} />
                    </Routes>
                </Router>
            ) : (
                <Router>
                    <Routes>
                        <Route exact path="/" element={<Login />} />
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
