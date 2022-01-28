import { Tooltip } from "@mui/material";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import FetchData from "../../ServerCall/FetchData";
import { SelectTableItem } from "../ExpandableItem";
import {VisibilitySharp} from '@mui/icons-material';

const DataConnection = (props) => {
    const [dataConnectionList, setDataConnectionList] = useState([]);

    useEffect(async () => {
        var result = await FetchData({
            requestType: "noData",
            method: "GET",
            url: "dc/get-all-dc",
            headers: { Authorization: `Bearer ${props.token}` },
        });

        console.log(result);
        if (result.status) {
            setDataConnectionList(result.data);
        }
    }, []);

    console.log(props.token);
    return (
        <div className="dataConnectionContainer">
            <div className="containersHead">
                <div className="containerTitle">Data Connection</div>

                <input
                    className="containerButton"
                    type="button"
                    value="New"
                    // onClick={(e) => {
                    //     handleOpen();
                    //     handleMode(e);
                    // }}
                />
            </div>
            {dataConnectionList &&
                dataConnectionList.map((dc) => {
                    return <SelectTableItem render={(xprops) => (
                        <div className="dataConnectionList"  onMouseOver={() => xprops.setOpen(true)} onMouseLeave={() => xprops.setOpen(false)}>
                                {dc.friendly_name}
                                {xprops.open ? (<Tooltip title="View or Edit data" style={{margin:'auto 0px auto auto'}} arrow placement="right-start"><VisibilitySharp/></Tooltip>) : (<i style={{margin:'auto 0px auto auto'}}>{dc.db_name}</i>)}
                        </div>   
                    )}/>
                })}
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        token: state.isLogged.accessToken,
    };
};
export default connect(mapStateToProps, null)(DataConnection);
