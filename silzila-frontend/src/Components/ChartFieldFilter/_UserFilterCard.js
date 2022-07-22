import React, { useState, useEffect, useContext } from "react";
import { useDrag, useDrop } from "react-dnd";
import { ItemTypes } from "../ChartAxes/ItemTypes";
import {
    deleteUserFilterItemInChartProp,
    sortUserFilterItem,
    revertUserFilter,
    updateUserFilterItem,
} from "../../redux/UserFilter/actionsUserFilter";

import { connect } from "react-redux";
import { serverBaseURL } from "../Constants/envVariables";
import update from "immutability-helper";
import axios from "axios";
import {
    Dropdown,
    DropdownButton,
    Accordion,
    useAccordionToggle,
    AccordionContext,
    Button,
    Spinner,
    ToggleButtonGroup,
    ToggleButton,
} from "react-bootstrap";
import "./UserFilterCard.css";
import DatePicker from "react-date-picker";

const UserFilterCard = ({
    //#region Destructuring
    uId,
    fieldname,
    displayname,
    datatype,
    prefix,
    rawselectmembers,
    isCollapsed,
    userSelection,
    includeexclude,
    fieldtypeoption,
    exprType,
    exprInput,
    greaterThanOrEqualTo,
    lessThanOrEqualTo,
    isInValidData,
    itemIndex,

    fileId,
    groupName,
    userFilterGroup,

    token,
    refreshToken,

    deleteUserFilterItemInChartProp,
    sortUserFilterItem,
    revertUserFilter,
    updateUserFilterItem,
    //#endregion
}) => {
    //#region Variables

    let propName = `${fileId}_${groupName}`;
    const originalIndex = userFilterGroup[propName].chartUserFilters.findIndex((item) => item.uId === uId);
    const [showProgress, setShowProgress] = useState(false);
    const withPatternCollections = ["Begins with", "Ends with", "Contains"];
    const datePatternCollections = ["Year", "Quarter", "Month", "DayOfWeek", "Date"];
    const equalPatternCollections = [
        "> Greater than",
        "< Less than",
        "= Equal to",
        ">= Greater than or Equal to",
        "<= Less than or Equal to",
        ">= Between <=",
    ];

    const [dropdownOpenState, setDropdownOpenState] = useState(false);
    const menuClass = `dropdown-menu${dropdownOpenState ? " show" : ""}`;
    const toggleOpen = (toggle) => setDropdownOpenState(toggle);

    let filterFieldData = {
        fieldname: fieldname,
        displayname: displayname,
        datatype: datatype,
        prefix: prefix,
        uid: uId,
        rawselectmembers: rawselectmembers,
        userSelection: userSelection,
        isCollapsed: isCollapsed,
        includeexclude: includeexclude,
        fieldtypeoption: fieldtypeoption,
        exprType: exprType,
        exprInput: exprInput,
        greaterThanOrEqualTo: greaterThanOrEqualTo,
        lessThanOrEqualTo: lessThanOrEqualTo,
        isInValidData: isInValidData,
    };

    //#endregion

    //#region Component Initialization

    useEffect(() => {
        let filterObj = userFilterGroup[propName].chartUserFilters.find((usrfilter) => usrfilter.uId == uId);
        filterObj["includeexclude"] = "include";

        if (!filterObj.fieldtypeoption) {
            // if (filterObj.rawselectmembers && filterObj.rawselectmembers.length > 4) {
            //     filterObj["fieldtypeoption"] = "Dropdown";
            // } else {
             //   filterObj["fieldtypeoption"] = "Checkbox";
          //  }

            if (filterFieldData && filterFieldData.datatype) {
                switch (filterFieldData.datatype) {
                    case "float":
                    case "double":
                    case "int":
                        filterObj["fieldtypeoption"] = "Custom";
                        break;
                    case "timestamp":
                        filterObj["prefix"] = "Year";
                        filterObj["fieldtypeoption"] = "Checkbox";
                        break;
                    default:
                        filterObj["fieldtypeoption"] = "Checkbox";
                        break;
                }
            }
        }

        if (filterObj.fieldtypeoption == "Custom") {
            if (filterFieldData && filterFieldData.datatype) {
                switch (filterFieldData.datatype) {
                    case "float":
                    case "double":
                    case "int":
                        filterObj["exprType"] = "greaterThan";
                        break;
                    case "string":
                        filterObj["exprType"] = "startswith";
                        break;
                    case "timestamp":
                        filterObj["prefix"] = "Year";
                        filterObj["exprType"] = "greaterThan";
                        break;
                }
            }
        } else {
            if (filterFieldData && filterFieldData.datatype && filterFieldData.datatype == "timestamp") {
                filterObj["prefix"] = "Year";
            }
        }
        updateUserFilterItem(fileId, groupName, filterObj);
    }, []);

    //#endregion

    //#region Drag and Drop

    const [, drag] = useDrag({
        item: { uId, fieldname, displayname, datatype, prefix, type: ItemTypes.CARD, originalIndex },

        end: (dropResult, monitor) => {
            console.log("***************on DRAG END**************");
            const { uId, originalIndex } = monitor.getItem();
            console.log("uId = ", uId);

            const didDrop = monitor.didDrop();
            console.log("didDrop = ", didDrop);

            if (!didDrop) {
                console.log("..............no drop..............");
                console.log("originalIndex = ", originalIndex, "Bin index = ", "revert uId = ", uId);
                revertUserFilter(fileId, groupName, uId, originalIndex);
            }
        },
    });

    const [, drop] = useDrop({
        accept: ItemTypes.CARD,
        canDrop: () => false,
        collect: (monitor) => ({
            backgroundColor1: monitor.isOver({ shallow: true }) ? 1 : 0,
        }),
        hover({ uId: dragUId }) {
            if (dragUId && uId && dragUId !== uId) {
                console.log("============HOVER BLOCK START ===============");
                console.log("dragUId = ", dragUId, "\ndrop uId = ", uId, "drag Bin = ", "drop Bin = ");
                sortUserFilterItem(fileId, groupName, dragUId, uId);
                console.log("============HOVER BLOCK END ==============");
            }
        },
    });

    const deleteItem = () => {
        console.log("=============== DELETING CARD ===============");

        deleteUserFilterItemInChartProp(fileId, groupName, itemIndex);
        // chartPropUpdated(true);
    };

    //#endregion

    //#region Fetch Data From Server

    const GetSelectMemberColletion = async (data) => {
        let _fieldData = {
            fieldname: data.fieldname,
            displayname: data.displayname,
            datatype: data.datatype,
            prefix: data.prefix,
            uid: data.uId,
        };

        let result = await fetchFilterMembers(_fieldData);

        if (result) {
            let filterObj = userFilterGroup[propName].chartUserFilters.find((usrfilter) => usrfilter.uId == uId);

            let tempResult = ["(All)", ...result];

            filterObj["rawselectmembers"] = [...tempResult];
            filterObj["userSelection"] = tempResult;

            return filterObj;
        }
    };

    const fetchFilterMembers = async (filterFieldData) => {
        const token2 = await refreshToken(token);

        var config = {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token2.payload}`,
            },
            data: JSON.stringify(filterFieldData),
            url: serverBaseURL + `filtermembers/` + fileId,
        };
        return axios(config)
            .then((res) => {
                return res.data;
            })
            .catch((err) => console.log(err));
    };

    //#endregion

    //#region Handlers

    const handleInculeExCludeAreaRadioChange = (e, props) => {
        let filterObj = userFilterGroup[propName].chartUserFilters.find((usrfilter) => usrfilter.uId == props.uid);
        filterObj["includeexclude"] = e.target.value;
        updateUserFilterItem(fileId, groupName, filterObj);
    };

    const handleRadioButtonOnClick = (event, data) => {
        let filterObj = userFilterGroup[propName].chartUserFilters.find((usrfilter) => usrfilter.uId == data.uid);

        let _value = event.target.value;

        filterObj["userSelection"] = [_value];
        updateUserFilterItem(fileId, groupName, filterObj);
    };

    const handleCBChange = (event, data) => {
        let filterObj = userFilterGroup[propName].chartUserFilters.find((usrfilter) => usrfilter.uId == data.uid);

        if (event.target.name === "(All)") {
            if (event.target.checked) {
                filterObj["userSelection"] = [...filterObj.rawselectmembers];
            } else {
                filterObj["userSelection"] = [];
            }
        } else {
            if (event.target.checked) {
                if (!isNaN(event.target.name) && isFinite(event.target.name)) {
                    let _name = event.target.name;

                    if (_name.includes(".")) {
                        _name = parseFloat(event.target.name);
                    } else {
                        _name = parseInt(event.target.name);
                    }

                    if (_name) {
                        filterObj.userSelection.push(_name);
                    }
                } else {
                    filterObj.userSelection.push(event.target.name);
                }
            } else {
                let idx = filterObj.userSelection.findIndex((item) => item == event.target.name);
                filterObj.userSelection.splice(idx, 1);
            }

            let AllIdx = filterObj.userSelection.findIndex((item) => item == "(All)");

            if (AllIdx >= 0) {
                filterObj.userSelection.splice(AllIdx, 1);
            }
        }

        updateUserFilterItem(fileId, groupName, filterObj);
    };

    const handleDropDownOnChange = (event, data) => {
        let filterObj = userFilterGroup[propName].chartUserFilters.find((usrfilter) => usrfilter.uId == data.uid);

        filterObj["userSelection"] = [event.target.value];
        updateUserFilterItem(fileId, groupName, filterObj);
    };

    const handleDropDownForPatternOnChange = (event, data) => {
        let filterObj = userFilterGroup[propName].chartUserFilters.find((usrfilter) => usrfilter.uId == data.uid);

        filterObj["exprType"] = event.target.value;
        filterObj = _modifiedResultForServerRequest(filterObj);
        updateUserFilterItem(fileId, groupName, filterObj);
    };

    const handleDropDownForDatePatternOnChange = async (event, data) => {
        let filterObj = userFilterGroup[propName].chartUserFilters.find((usrfilter) => usrfilter.uId == data.uid);

        filterObj["prefix"] = event.target.value;
        filterObj["greaterThanOrEqualTo"] = "";
        filterObj["lessThanOrEqualTo"] = "";

        if (filterObj.fieldtypeoption === "Custom" && event.target.value == "Date") {
            filterObj["exprInput"] = "";
        }

        if (filterObj.fieldtypeoption !== "Custom") {
            setShowProgress(true);
            filterObj = await GetSelectMemberColletion(filterObj);
            setShowProgress(false);
        }

        updateUserFilterItem(fileId, groupName, filterObj);
    };

    const handleCustomRequiredValueOnBlur = (val, data, key) => {
        let filterObj = userFilterGroup[propName].chartUserFilters.find((usrfilter) => usrfilter.uId == data.uid);

        key = key || "exprInput";
        filterObj[key] = val;
        filterObj["isInValidData"] = false;

        if (key != "exprInput") {
            if (filterObj.prefix == "Date" && new Date(filterObj.greaterThanOrEqualTo) > new Date(filterObj.lessThanOrEqualTo)) {
                filterObj["isInValidData"] = true;
            } else {
                if (parseInt(filterObj.greaterThanOrEqualTo) > parseInt(filterObj.lessThanOrEqualTo)) {
                    filterObj["isInValidData"] = true;
                }
            }
        }

        updateUserFilterItem(fileId, groupName, filterObj);
    }
  
    const handleFieldTypeOnChange = async(e, uId) => {
        toggleOpen(!dropdownOpenState);

        let filterObj = userFilterGroup[propName].chartUserFilters.find((usrfilter) => usrfilter.uId == uId);

        let value = e.target.innerText;

        if(value !== "Custom" && !filterFieldData.rawselectmembers){
            setShowProgress(true);
            filterObj = await GetSelectMemberColletion(filterObj);
            setShowProgress(false);
        }

        if (value == "Custom") {
            if (filterFieldData && filterFieldData.datatype) {
                switch (filterFieldData.datatype) {
                    case "float":
                    case "double":
                    case "int":
                        filterObj["exprType"] = "greaterThan";
                        break;
                    case "string":
                        filterObj["exprType"] = "startswith";
                        break;
                    case "timestamp":
                        filterObj["prefix"] = "Year";
                        filterObj["exprType"] = "greaterThan";
                        break;
                }
            }
        } else if (filterFieldData && filterFieldData.datatype && filterFieldData.datatype == "timestamp") {
            filterObj["prefix"] = "Year";
        }

        filterObj["fieldtypeoption"] = value;

        if (value == "Checkbox") {
            filterObj["userSelection"] = [...filterObj.rawselectmembers];
        } else {
            filterObj["userSelection"] = ["(All)"];
        }

        updateUserFilterItem(fileId, groupName, filterObj);
    };

    const handleExpandCollapseOnClick = (e, props) => {
        let filterObj = userFilterGroup[propName].chartUserFilters.find((usrfilter) => usrfilter.uId == props.uid);
        filterObj["isCollapsed"] = !props.isCollapsed;
        updateUserFilterItem(fileId, groupName, filterObj);
    };

    //#endregion

    //#region Private Functions

    const _modifiedResultForServerRequest = (result) => {
        if (result) {
            let _modifier = {
                Contains: "contains",
                "Begins with": "startswith",
                "Ends with": "endswith",
                ">= Between <=": "between",
                "> Greater than": "greaterThan",
                "< Less than": "lessThan",
                "= Equal to": "equalTo",
                ">= Greater than or Equal to": "greaterThanOrEqualTo",
                "<= Less than or Equal to": "lessThanOrEqualTo",
            };

            if (result.exprType) {
                result.exprType = _modifier[result.exprType] || result.exprType;
            }

            return result;
        }

        return result;
    };

    const _reverseResultForUI = (result) => {
        if (result) {
            let _modifier = {
                contains: "Contains",
                startswith: "Begins with",
                endswith: "Ends with",
                between: ">= Between <=",
                greaterThan: "> Greater than",
                lessThan: "< Less than",
                equalTo: "= Equal to",
                greaterThanOrEqualTo: ">= Greater than or Equal to",
                lessThanOrEqualTo: "<= Less than or Equal to",
            };
            if (result.exprType) {
                result.exprType = _modifier[result.exprType] || result.exprType;
            }

            return result;
        }

        return result;
    };

    //#endregion

    //#region Local Components

    const SelectMemberCard = () => {
        let _selectionMembers = null;

        if (filterFieldData && filterFieldData.rawselectmembers) {
            switch (filterFieldData.fieldtypeoption) {
                case "Radio":
                    _selectionMembers = (
                        <div onClick={(e) => handleRadioButtonOnClick(e, filterFieldData)}>
                            {filterFieldData.rawselectmembers.map((item) => {
                                return (
                                    <div key={item} className="UserFilterCheckboxes">
                                        <label>
                                            <input
                                                type="radio"
                                                value={item}
                                                checked={filterFieldData.userSelection[0] == item}
                                                name={filterFieldData.uid}
                                            />
                                            <span>{item}</span>
                                        </label>
                                    </div>
                                );
                            })}
                        </div>
                    );
                    break;
                case "Checkbox":
                    _selectionMembers = filterFieldData.rawselectmembers.map((item) => {
                        return (
                            <label className="UserFilterCheckboxes" key={item}>
                                <input
                                    type="checkbox"
                                    checked={filterFieldData.userSelection ? filterFieldData.userSelection.includes(item) : false}
                                    name={item}
                                    onChange={(e) => handleCBChange(e, filterFieldData)}
                                />
                                <span>{item}</span>
                            </label>
                        );
                    });
                    break;
                case "Dropdown":
                    _selectionMembers = (
                        <div>
                            <select
                                onChange={(e) => {
                                    handleDropDownOnChange(e, filterFieldData);
                                }}
                            >
                                {filterFieldData.rawselectmembers.map((item) => {
                                    return (
                                        <option key={item} value={item} selected={filterFieldData.userSelection[0] == item}>
                                            {item}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                    );

                    break;
            }
        } else {
            _selectionMembers = null;
        }

        return <div className="SelectionMembersCheckBoxArea">{_selectionMembers}</div>;
    };

    const InculeExcludeArea = () => {
        return (
            <div className="UserFilterRadioButtons" onClick={(e) => handleInculeExCludeAreaRadioChange(e, filterFieldData)}>
                <button
                    className={filterFieldData.includeexclude === "include" ? "UserFilterRadioButtonSelected" : "UserFilterRadioButton"}
                    value="include"
                >
                    Include
                </button>
                <button
                    className={filterFieldData.includeexclude === "exclude" ? "UserFilterRadioButtonSelected" : "UserFilterRadioButton"}
                    value="exclude"
                >
                    Exclude
                </button>
            </div>
        );
    };

    const DropDownForPattern = ({ items }) => {
        filterFieldData = _reverseResultForUI(filterFieldData);

        return (
            <select
                onChange={(e) => {
                    handleDropDownForPatternOnChange(e, filterFieldData);
                }}
            >
                {items.map((item) => {
                    return (
                        <option key={item} value={item} selected={item == filterFieldData.exprType}>
                            {item}
                        </option>
                    );
                })}
            </select>
        );
    };

    const DropDownForDatePattern = ({ items }) => {
        return (
            <select
                onChange={(e) => {
                    handleDropDownForDatePatternOnChange(e, filterFieldData);
                }}
            >
                {items.map((item) => {
                    return (
                        <option key={item} value={item} selected={item == filterFieldData.prefix}>
                            {item}
                        </option>
                    );
                })}
            </select>
        );
    };

    const CustomCard = () => {
        var members = null;
        if (filterFieldData && filterFieldData.datatype) {
            switch (filterFieldData.datatype) {
                case "float":
                case "double":
                case "int":
                    members = <DropDownForPattern items={equalPatternCollections}></DropDownForPattern>;
                    break;
                case "string":
                    members = <DropDownForPattern items={withPatternCollections}></DropDownForPattern>;
                    break;
                case "timestamp":
                    members = <DropDownForPattern items={equalPatternCollections}></DropDownForPattern>;
                    break;
                default:
                    members = null;
                    break;
            }
        }

        return (
            <div className="CustomRequiredField">
                {members}
                <CustomRequiredField></CustomRequiredField>
            </div>
        );
    };

    const CustomRequiredField = () => {
        var members = null;
        if (filterFieldData && filterFieldData.datatype) {
            switch (filterFieldData.datatype) {
                case "float":
                case "double":
                case "int":
                    if (filterFieldData.exprType == ">= Between <=") {
                        members = (
                            <>
                                <input
                                    placeholder="Greater than or Equal to"
                                    type="number"
                                    className="CustomInputValue"
                                    defaultValue={filterFieldData.greaterThanOrEqualTo}
                                    onBlur={(e) => {
                                        handleCustomRequiredValueOnBlur(e.target.value, filterFieldData, "greaterThanOrEqualTo");
                                    }}
                                />
                                <input
                                    placeholder="Less than or Equal to"
                                    type="number"
                                    className="CustomInputValue"
                                    defaultValue={filterFieldData.lessThanOrEqualTo}
                                    onBlur={(e) => {
                                        handleCustomRequiredValueOnBlur(e.target.value, filterFieldData, "lessThanOrEqualTo");
                                    }}
                                />
                                {filterFieldData.isInValidData ? <span className="ErrorText">Entered incorrect value.</span> : null}
                            </>
                        );
                    } else {
                        members = (
                            <>
                                <input
                                    placeholder="Value"
                                    className="CustomInputValue"
                                    defaultValue={filterFieldData.exprInput}
                                    type="number"
                                    onBlur={(e) => handleCustomRequiredValueOnBlur(e.target.value, filterFieldData)}
                                />
                                {filterFieldData.isInValidData ? <span className="ErrorText">Entered incorrect value.</span> : null}
                            </>
                        );
                    }
                    break;
                case "string":
                    members = (
                        <>
                            <input
                                placeholder="Value"
                                className="CustomInputValue"
                                defaultValue={filterFieldData.exprInput}
                                type="text"
                                onBlur={(e) => handleCustomRequiredValueOnBlur(e.target.value, filterFieldData)}
                            />
                            {filterFieldData.isInValidData ? <span className="ErrorText">Entered incorrect value.</span> : null}
                        </>
                    );
                    break;
                case "timestamp":
                    if (filterFieldData.prefix == "Date") {
                        if (filterFieldData.exprType == ">= Between <=") {
                            members = (
                                <div className="customDatePickerWidth">
                                    <DatePicker
                                        value={filterFieldData.greaterThanOrEqualTo}
                                        format="dd/MM/yyyy"
                                        onChange={(e) => handleCustomRequiredValueOnBlur(e, filterFieldData, "greaterThanOrEqualTo")}
                                    />
                                    <DatePicker
                                        value={filterFieldData.lessThanOrEqualTo}
                                        format="dd/MM/yyyy"
                                        onChange={(e) => handleCustomRequiredValueOnBlur(e, filterFieldData, "lessThanOrEqualTo")}
                                    />
                                    {filterFieldData.isInValidData ? <span className="ErrorText">Entered incorrect value.</span> : null}
                                </div>
                            );
                        } else {
                            members = (
                                <div className="customDatePickerWidth">
                                    <DatePicker
                                        value={filterFieldData.exprInput}
                                        format="dd/MM/yyyy"
                                        onChange={(e) => handleCustomRequiredValueOnBlur(e, filterFieldData)}
                                    />
                                    {filterFieldData.isInValidData ? <span className="ErrorText">Entered incorrect value.</span> : null}
                                </div>
                            );
                        }
                    } else {
                        if (filterFieldData.exprType == ">= Between <=") {
                            members = (
                                <>
                                    <input
                                        placeholder="Greater than or Equal to"
                                        type="number"
                                        className="CustomInputValue"
                                        defaultValue={filterFieldData.greaterThanOrEqualTo}
                                        onBlur={(e) => {
                                            handleCustomRequiredValueOnBlur(e.target.value, filterFieldData, "greaterThanOrEqualTo");
                                        }}
                                    />
                                    <input
                                        placeholder="Less than or Equal to"
                                        type="number"
                                        className="CustomInputValue"
                                        defaultValue={filterFieldData.lessThanOrEqualTo}
                                        onBlur={(e) => {
                                            handleCustomRequiredValueOnBlur(e.target.value, filterFieldData, "lessThanOrEqualTo");
                                        }}
                                    />
                                    {filterFieldData.isInValidData ? <span className="ErrorText">Entered incorrect value.</span> : null}
                                </>
                            );
                        } else {
                            members = (
                                <>
                                    <input
                                        placeholder="Value"
                                        type="number"
                                        className="CustomInputValue"
                                        defaultValue={filterFieldData.exprInput}
                                        onBlur={(e) => handleCustomRequiredValueOnBlur(e.target.value, filterFieldData)}
                                    />
                                    {filterFieldData.isInValidData ? <span className="ErrorText">Entered incorrect value.</span> : null}
                                </>
                            );
                        }
                    }
                    break;
                default:
                    members = null;
                    break;
            }
        }

        return <div>{members}</div>;
    };

    //#endregion

    //#region Component UI

    return (
        <div ref={(node) => drag(drop(node))} className="UserFilterCard">
            {showProgress ? <Spinner animation="border" variant="primary" /> : null}

            <div className="filterTitle">
                <div className="btn-group dropright" role="group">
                    <button
                        onClick={() => toggleOpen(!dropdownOpenState)}
                        type="button"
                        className=" btn-outline-primary dropdown-toggle dropdownArrowUserFilter"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                        id="dropdownMenuButton"
                        aria-haspopup="true"
                    ></button>

                    <div
                        className={menuClass}
                        onClick={(e) => handleFieldTypeOnChange(e, uId)}
                        aria-labelledby="dropdownMenuButton dropdown-menu-right"
                    >
                        <span className="dropdown-item">Custom</span>
                        <div className="dropdown-divider "></div>
                        <span className="dropdown-item">Checkbox</span>
                        <span className="dropdown-item">Radio</span>
                        <span className="dropdown-item">Dropdown</span>
                    </div>
                </div>

                <label className="UserFilterButtonCommon UserFilterColumnName">{fieldname}</label>
                <button
                    type="button"
                    className="btn-outline-primary UserFilterColumnClose UserFilterButtonCommon"
                    onClick={deleteItem}
                    title="Remove field"
                >
                    X
                </button>
                <span
                    className={filterFieldData.isCollapsed ? "UserFilterOptionsCollapse" : "UserFilterOptionsCollapse open"}
                    onClick={(e) => handleExpandCollapseOnClick(e, filterFieldData)}
                >
                    v
                </span>
            </div>

            {!filterFieldData.isCollapsed && !showProgress ? (
                <div className="filterSelectionArea" onClick={() => toggleOpen(false)}>
                    <InculeExcludeArea></InculeExcludeArea>
                    <div className="filterSelectionAreaScroll">
                        {filterFieldData && filterFieldData.datatype && filterFieldData.datatype == "timestamp" ? (
                            <div className="CustomRequiredField">
                                <DropDownForDatePattern items={datePatternCollections}></DropDownForDatePattern>
                            </div>
                        ) : null}
                        {filterFieldData.fieldtypeoption == "Custom" ? <CustomCard></CustomCard> : <SelectMemberCard></SelectMemberCard>}
                    </div>
                </div>
            ) : null}
        </div>
    );

    //#endregion
};

//#region Redux

// const mapStateToProps = (state) => {
// };

const mapDispatchToProps = (dispatch) => {
    return {
        deleteUserFilterItemInChartProp: (fileId, groupName, itemIndex) => dispatch(deleteUserFilterItemInChartProp(fileId, groupName, itemIndex)),
        sortUserFilterItem: (fileId, groupName, dragUId, uId) => dispatch(sortUserFilterItem(fileId, groupName, dragUId, uId)),
        revertUserFilter: (fileId, groupName, uId, originalIndex) => dispatch(revertUserFilter(fileId, groupName, uId, originalIndex)),
        updateUserFilterItem: (fileId, groupName, filterFieldData) => dispatch(updateUserFilterItem(fileId, groupName, filterFieldData)),
    };
};
//#endregion

export default connect(null, mapDispatchToProps)(UserFilterCard);
