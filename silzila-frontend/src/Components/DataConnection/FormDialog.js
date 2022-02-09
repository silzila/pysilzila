import React from "react";
import { Dialog } from "@mui/material";
import "./DataSetup.css";
import { TextField, Button } from "@mui/material";

function FormDialog(props) {
    const { account, setAccount, openFormDialog, setOpenFormDialog, viewMode, setViewMode, initialState, handleOpen, handleMode, regOrUpdate } =
        props;

    console.log(account);

    return (
        <>
            <Dialog open={openFormDialog} onClose={handleOpen}>
                <div className="formStyle">
                    <form style={{ textAlign: "center", display: "block" }}>
                        <h3>Data Connection</h3>
                        <TextField
                            style={{ margin: "8px auto", width: "70%" }}
                            label="Vendor"
                            type="text"
                            disabled={viewMode}
                            onChange={(e) => setAccount({ ...account, vendor: e.target.value })}
                            value={account.vendor}
                            required={true}
                        />
                        <TextField
                            style={{ margin: "8px auto", width: "70%" }}
                            label="Url"
                            type="text"
                            disabled={viewMode}
                            onChange={(e) => setAccount({ ...account, url: e.target.value })}
                            value={account.url}
                            required={true}
                        />
                        <TextField
                            style={{ margin: "8px auto", width: "70%" }}
                            label="Port"
                            type="number"
                            disabled={viewMode}
                            onChange={(e) => setAccount({ ...account, port: e.target.value })}
                            value={account.port}
                            required={true}
                        />
                        <TextField
                            style={{ margin: "8px auto", width: "70%" }}
                            label="Database name"
                            type="text"
                            disabled={viewMode}
                            onChange={(e) => setAccount({ ...account, db_name: e.target.value })}
                            value={account.db_name}
                            required={true}
                        />
                        <TextField
                            style={{ margin: "8px auto", width: "70%" }}
                            label="Username"
                            type="text"
                            disabled={viewMode}
                            onChange={(e) => setAccount({ ...account, username: e.target.value })}
                            value={account.username}
                            required={true}
                        />
                        <TextField
                            style={{ margin: "8px auto", width: "70%" }}
                            label="friendly name"
                            type="text"
                            disabled={viewMode}
                            onChange={(e) => setAccount({ ...account, friendly_name: e.target.value })}
                            value={account.friendly_name}
                            required={true}
                        />
                        <TextField
                            style={{ margin: "8px auto", width: "70%" }}
                            label="Password"
                            type="password"
                            disabled={viewMode}
                            onChange={(e) => setAccount({ ...account, password: e.target.value })}
                            value={account.password}
                            required={true}
                        />
                        {viewMode ? (
                            <div style={{ margin: "8px auto", width: "70%", display: "flex" }}>
                                <Button id="formButton" variant="contained" onClick={handleOpen}>
                                    Cancel
                                </Button>
                                <Button
                                    id="formButton"
                                    variant="contained"
                                    value="Edit"
                                    onClick={(e) => {
                                        setViewMode(false);
                                        handleMode(e);
                                    }}
                                >
                                    Edit
                                </Button>
                                <Button id="formButton" variant="contained">
                                    Delete
                                </Button>
                            </div>
                        ) : (
                            <div style={{ margin: "8px auto", width: "70%", display: "flex" }}>
                                <Button id="formButton" variant="contained">
                                    Test
                                </Button>
                                <Button id="formButton" variant="contained">
                                    {regOrUpdate}
                                </Button>
                            </div>
                        )}
                    </form>
                </div>
            </Dialog>
        </>
    );
}
export default FormDialog;
