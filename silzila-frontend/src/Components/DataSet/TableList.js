import React, { useState } from "react";
import { Checkbox, Tooltip } from "@mui/material";

import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import FetchData from "../../ServerCall/FetchData";
import { connect } from "react-redux";
import { removeArrows, toggleOnChecked } from "../../redux/Dataset/datasetActions";

const TableList = (props) => {
    const [selectedTable, setSelectedTable] = useState();

    const getTableColumns = async (tableName) => {
        console.log(tableName);
        var result = await FetchData({
            requestType: "noData",
            method: "GET",
            url: "dc/columns/" + props.connectionId + "/" + props.schema + "/" + tableName,
            headers: { Authorization: `Bearer ${props.token}` },
        });
        if (result.status) {
            console.log("res.data.columns", result.data);
            let obj;
            props.tableList.map((el) => {
                if (el.tableName === tableName && el.isSelected === true) {
                    const arrayWithUid = result.data.map((data) => {
                        return { uid: tableName.concat(data.column_name), ...data };
                    });
                    console.log(arrayWithUid);
                    obj = {
                        tableName: tableName,
                        isSelected: el.isSelected,
                        alias: tableName,
                        columns: arrayWithUid,
                        dcId: props.connectionId,
                        schema: props.schema,
                    };
                }
            });
            console.log(obj);
            props.addTable(obj);
        }
    };

    const handleOpen = (table) => {
        console.log(table);
        setSelectedTable(table);
    };

    const checkAndUncheck = (e) => {
        console.log(e.target.value);
        props.onChecked(e.target.value);

        if (e.target.checked) {
            getTableColumns(e.target.value);
        } else {
            if (props.tempTable.length !== 0) {
                props.tempTable.map((el) => {
                    if (el.tableName === e.target.value) {
                        props.removeArrows(e.target.value);
                    }
                });
            }
        }
    };

    return (
        <React.Fragment>
            <Checkbox
                style={{ width: "1rem", height: "1rem", margin: "auto 5px auto 0" }}
                size="1rem"
                checked={props.table.isSelected ? true : false}
                onChange={checkAndUncheck}
                value={props.table.tableName}
            />

            <span className="tableName" title={props.table.tableName}>
                {props.table.tableName}
            </span>

            {props.xprops.open ? (
                <Tooltip
                    title="View Table"
                    arrow
                    placement="right-start"
                    style={{ float: "right" }}
                    onClick={() => {
                        handleOpen(props.table.tableName);
                    }}
                >
                    <VisibilityOutlinedIcon
                        className="tableIcon"
                        style={{ width: "1rem", height: "1rem", margin: "auto 5px" }}
                    />
                </Tooltip>
            ) : (
                ""
            )}
        </React.Fragment>
    );
};

const mapStateToProps = (state) => {
    return {
        tableList: state.dataSetState.tables,
        tempTable: state.dataSetState.tempTable,
        token: state.isLogged.accessToken,
        connectionId: state.dataSetState.connection,
        schema: state.dataSetState.schema,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onChecked: (data) => dispatch(toggleOnChecked(data)),
        addTable: (payload) => dispatch({ type: "ADD_TABLE", payload: payload }),
        removeArrows: (pl) => dispatch(removeArrows(pl)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TableList);
