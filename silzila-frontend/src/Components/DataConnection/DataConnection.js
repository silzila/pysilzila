import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import FetchData from "../../ServerCall/FetchData";
import { SelectListItem } from "../CommonFunctions/SelectListItem";
import { VisibilitySharp } from "@mui/icons-material";

import { Alert, Button, TextField, Tooltip } from "@mui/material";
import Dialog from "@mui/material/Dialog";

const initialState = {
    vendor: "",
    vendorInputBorder: "form-control",
    url: "",
    urlInputBorder: "form-control",
    port: "",
    portInputBorder: "form-control",
    db_name: "",
    db_nameInputBorder: "form-control",
    username: "",
    usernameInputBorder: "form-control",
    friendly_name: "",
    friendly_nameInputBorder: "form-control",
    friendly_nameError: "",
    password: "",
    passwordError: "",
    passwordInputBorder: "form-control",
    passwordTextColor: "form-text text-muted",
};

const DataConnection = (props) => {
    const [dataConnectionList, setDataConnectionList] = useState([]);

    const [open, setOpen] = useState(false);
    const [account, setAccount] = useState(initialState);
    const [openAlert, setOpenAlert] = useState(false);
    const [RegOrUpdate, setRegOrUpdate] = useState("Register");
    const [RegisterStatus, setRegisterStatus] = useState(false);
    const [testMessage, setTestMessage] = useState("Testing alert");
    const [severity, setSeverity] = useState("success");

    useEffect(() => {
        getInformation();
        // eslint-disable-next-line
    }, []);

    const getInformation = async () => {
        var result = await FetchData({
            requestType: "noData",
            method: "GET",
            url: "dc/get-all-dc",
            headers: { Authorization: `Bearer ${props.token}` },
        });

        console.log(result);
        if (result.status) {
            setDataConnectionList(result.data);
        } else {
            console.log(result.data.detail);
        }
    };

    const handleOpen = () => {
        if (open === true) {
            setOpen(false);
            setAccount(initialState);
        } else {
            setOpen(true);
        }
    };

    const handleMode = (e) => {
        console.log(e.target.value);
        if (e.target.value === "New") {
            setRegOrUpdate("Register");
        } else if (e.target.value === "Edit") {
            setRegOrUpdate("Update");
        }
    };

    const handleonTest = async () => {
        let data = {
            friendly_name: account.friendly_name,
            vendor: account.vendor,
            url: account.url,
            port: account.port,
            db_name: account.db_name,
            username: account.username,
            password: account.password,
        };

        var response = await FetchData({
            requestType: "withData",
            method: "POST",
            url: "dc/test-dc",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${props.token}` },
            data: data,
        });

        if (response.status && response.data.message === "Test Seems OK") {
            setSeverity("success");
            setOpenAlert(true);
            setTestMessage("Test Seems Ok");
            setTimeout(() => {
                setOpenAlert(false);
                setTestMessage("");
            }, 3000);
        } else {
            setSeverity("error");
            setOpenAlert(true);
            setTestMessage(response.data.detail);
            setTimeout(() => {
                setOpenAlert(false);
                setTestMessage("");
            }, 4000);
        }
    };

    const handleRegister = async () => {
        // console.log(DSRecords);
        console.log("REGISTER BUTTON CLICKED");
        var data = {
            vendor: account.vendor,
            url: account.url,
            port: account.port,
            db_name: account.db_name,
            username: account.username,
            password: account.password,
            friendly_name: account.friendly_name,
        };

        var response = await FetchData({
            requestType: "withData",
            method: "POST",
            url: "dc/create-dc",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${props.token}` },
            data: data,
        });

        if (response.status) {
            if (response.data.message === "Friendlly Name is already used") {
                setAccount({
                    ...account,
                    friendly_nameError: "Friendlly Name is already used try any other Name",
                });
            } else {
                setRegisterStatus(true);
                setOpenAlert(true);
                setTestMessage("Data Connection successful");
                getInformation();
                setTimeout(() => {
                    setOpenAlert(false);
                    setTestMessage("");
                    setOpen(false);
                    setAccount(initialState);
                }, 3000);
            }
            setRegisterStatus(false);
        } else {
            console.log(response);
        }
    };

    return (
        <div className="dataConnectionContainer">
            <div className="containersHead">
                <div className="containerTitle">Data Connections</div>

                <input
                    className="containerButton"
                    type="button"
                    value="New"
                    onClick={(e) => {
                        handleOpen();
                        handleMode(e);
                    }}
                />
            </div>
            <div className="connectionListContainer">
                {dataConnectionList &&
                    dataConnectionList.map((dc) => {
                        return (
                            <SelectListItem
                                key={dc.friendly_name}
                                render={(xprops) => (
                                    <div
                                        className="dataConnectionList"
                                        onMouseOver={() => xprops.setOpen(true)}
                                        onMouseLeave={() => xprops.setOpen(false)}
                                    >
                                        <div className="dataConnectionName">
                                            {dc.friendly_name} (<i className="">{dc.db_name}</i>){" "}
                                        </div>
                                        {xprops.open ? (
                                            <Tooltip title="View / Edit Data Connection" arrow placement="right-start">
                                                <VisibilitySharp style={{ width: "1rem", height: "1rem", margin: "auto" }} />
                                            </Tooltip>
                                        ) : null}
                                    </div>
                                )}
                            />
                        );
                    })}
            </div>

            <Dialog open={open} onClose={handleOpen}>
                <div
                    style={{
                        height: "700px",
                        width: "400px",
                        padding: "20px",
                        overflowX: "hidden",
                    }}
                >
                    <form style={{ textAlign: "center" }}>
                        <div>
                            <h3>Data Connection</h3>
                        </div>
                        <div className="inputFieldStyle">
                            <TextField
                                label="Vendor"
                                type="text"
                                disabled={false}
                                onChange={(e) => setAccount({ ...account, vendor: e.target.value })}
                                value={account.vendor}
                                required={true}
                                variant="outlined"
                            />
                        </div>

                        <div className="inputFieldStyle">
                            <TextField
                                label="Url"
                                onChange={(e) => setAccount({ ...account, url: e.target.value })}
                                value={account.url}
                                required={true}
                                variant="outlined"
                            />
                        </div>

                        <div className="inputFieldStyle">
                            <TextField
                                label="Port"
                                type="number"
                                value={account.port}
                                disabled={false}
                                onChange={(e) => setAccount({ ...account, port: e.target.value })}
                                required={true}
                                variant="outlined"
                            />
                        </div>

                        <div className="inputFieldStyle">
                            <TextField
                                label="DataBase"
                                type="text"
                                value={account.db_name}
                                onChange={(e) => setAccount({ ...account, db_name: e.target.value })}
                                required={true}
                                variant="outlined"
                            />
                        </div>

                        <div className="inputFieldStyle">
                            <TextField
                                label="User Name"
                                type="text"
                                value={account.username}
                                onChange={(e) => setAccount({ ...account, username: e.target.value })}
                                required={true}
                                variant="outlined"
                            />
                        </div>

                        <div className="inputFieldStyle">
                            <TextField
                                label="Friendly Name"
                                type="text"
                                value={account.friendly_name}
                                onChange={(e) => setAccount({ ...account, friendly_name: e.target.value })}
                                required={true}
                                variant="outlined"
                            />
                        </div>
                        <small style={{ color: "red" }}>{account.friendly_nameError}</small>

                        <div className="inputFieldStyle">
                            <TextField
                                label="Password"
                                value={account.password}
                                type="password"
                                onChange={(e) => setAccount({ ...account, password: e.target.value })}
                                required={true}
                                variant="outlined"
                            />
                        </div>
                        <small className={account.passwordTextColor}>{account.passwordError}</small>
                        <Dialog
                            open={openAlert}
                            // onClose={handleAertClose}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                            // disableBackdropClick
                        >
                            <Alert severity={severity}>{testMessage}</Alert>
                        </Dialog>
                        {RegisterStatus ? (
                            <span className="loginSuccess">
                                <h3>Registered successfully!</h3>
                                <p>Redirecting....</p>
                            </span>
                        ) : (
                            <div
                                style={{
                                    width: "300px",
                                    height: "50px",
                                    padding: "40px",
                                    display: "grid",
                                    gridTemplateColumns: "50% 50%",
                                }}
                            >
                                <div>
                                    <Button variant="contained" onClick={handleonTest}>
                                        Test
                                    </Button>
                                </div>
                                <div>
                                    <Button variant="contained" onClick={handleRegister}>
                                        {RegOrUpdate}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </Dialog>
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        token: state.isLogged.accessToken,
    };
};
export default connect(mapStateToProps, null)(DataConnection);
