import React, { useState, useEffect, useRef } from "react";
import {
  Modal,
  Button,
  Tabs,
  Tab,
  TabPanel,
  FormControl,
  MenuItem,
  CircularProgress,
  Box,
  Popover,
  Select,
  Switch,
  TextField,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import DatePicker from "react-date-picker";
import "./filterExpressions.css";
import FetchData from "../../ServerCall/FetchData";
import moment from "moment";

const FilterExpressions = ({ fieldData, tabTileProps, handleModalClose, handleModalReturn }) => {
  const [selectMemberCollections, setSelectMemberCollections] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [selectedInculeExCludeAreaCondition, setSelectedInculeExCludeAreaCondition] =
    useState("Include");
  const [customRequiredValue, setCustomRequiredValue] = useState(fieldData?.exprInput || "");
  const [customRequiredFieldHelperText, setCustomRequiredFieldHelperText] = useState("");
  const [betweenGreaterThanValue, setBetweenGreaterThanValue] = useState("");
  const [betweenLessThanValue, setBetweenLessThanValue] = useState("");
  const [datePatternRadioButtonValue, setDatePatternRadioButtonValue] = useState("Year");
  const [equalPatternRadioButtonValue, setEqualPatternRadioButtonValue] =
    useState("> Greater than");
  const [withPatternRadioButtonValue, setWithPatternRadioButtonValue] = useState("Begins with");
  const [showProgress, setShowProgress] = useState(false);

  useEffect(() => {
    if (fieldData) {
      if (fieldData.tabValue) {
        fieldData = _reverseResultForUI(fieldData);

        // setTabValue(fieldData.tabName);
        let _inclExcl = fieldData.includeexclude == "include" ? "Include" : "Exclude";
        setSelectedInculeExCludeAreaCondition(_inclExcl);

        if (fieldData.tabValue == 1) {
          switch (fieldData.datatype) {
            case "int":
              setCustomRequiredValue(parseInt(fieldData.exprInput));
              setEqualPatternRadioButtonValue(fieldData.exprType);
              break;
            case "float":
            case "double":
              setCustomRequiredValue(parseFloat(fieldData.exprInput));
              setEqualPatternRadioButtonValue(fieldData.exprType);
              break;
            case "timestamp":
              setDatePatternRadioButtonValue(fieldData.prefix);
              setEqualPatternRadioButtonValue(fieldData.exprType);

              if (fieldData.prefix == "Date") {
                ////setCustomRequiredValue(new Date(fieldData.exprInput));
                setCustomRequiredValue(new Date(fieldData.exprInput.replaceAll("'", "")));
              } else {
                setCustomRequiredValue(parseFloat(fieldData.exprInput));
              }
              break;
            default:
              setWithPatternRadioButtonValue(fieldData.exprType);
              setCustomRequiredValue(fieldData.exprInput);
              break;
          }

          if (fieldData.exprType == ">= Between <=") {
            if (fieldData.prefix == "Date") {
              fieldData.exprInput = fieldData.exprInput.replaceAll("'", "");
              setBetweenGreaterThanValue(new Date(fieldData.exprInput.split(",")[0]));
              setBetweenLessThanValue(new Date(fieldData.exprInput.split(",")[1]));
            } else {
              setBetweenGreaterThanValue(fieldData.exprInput.split(",")[0]);
              setBetweenLessThanValue(fieldData.exprInput.split(",")[1]);
            }
          }
        } else {
          if (fieldData.datatype == "timestamp") {
            fetchFilterMembers();
            setDatePatternRadioButtonValue(fieldData.prefix);
          } else {
            fetchFilterMembers();
          }
        }
      } else {
        switch (fieldData.datatype) {
          case "string":
          case "timestamp":
            fetchFilterMembers();
            break;
          default:
            // setTabName("custom");
            break;
        }
      }
    }
  }, [fieldData]);

  useEffect(() => {
    if (tabValue == 0) {
      if (fieldData) {
        if (fieldData.datatype == "timestamp") {
          fieldData.prefix = datePatternRadioButtonValue;
        }

        if (selectMemberCollections.length == 0) {
          fetchFilterMembers();
        }
      }
    }
  }, [datePatternRadioButtonValue, tabValue]);

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

      if (result.prefix) {
        result.prefix = _modifier[result.prefix] || result.prefix;
      }

      return result;
    }

    return result;
  };

  const fetchFilterMembers = async () => {
    setShowProgress(true);
    // const token2 = await FetchNewToken(token);

    // if (token2 !== token) {
    //     console.log("Refreshing Token");
    //     await refreshToken(token2);
    // }

    // var config = {
    //     method: "POST",
    //     headers: {
    //         Authorization: `Bearer ${token2}`,
    //     },
    //     data: JSON.stringify(fieldData),
    //     url: serverBaseURL + `filtermembers/` + tabTileProps.selectedTable,
    // };
    // axios(config)
    //     .then((res) => {
    //         setShowProgress(false);
    //         let tempResult = ["(All)", ...res.data];

    //         if (!fieldData.userSelection) {
    //             setSelectedMembers(tempResult);
    //         } else {
    //             setSelectedMembers(fieldData.userSelection);
    //         }

    //         setSelectMemberCollections([...tempResult]);
    //     })
    //     .catch((err) => console.log(err));
  };

  const handleCBChange = (event) => {
    if (event.target.name === "(All)") {
      if (event.target.checked) {
        setSelectedMembers([...selectMemberCollections]);
      } else {
        setSelectedMembers([]);
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
            setSelectedMembers([...selectedMembers, _name]);
          }
        } else {
          setSelectedMembers([...selectedMembers, event.target.name]);
        }
      } else {
        let idx = selectedMembers.findIndex((item) => item == event.target.name);
        setSelectedMembers((selectedMembers) => selectedMembers.filter((_, i) => i !== idx));
      }

      let AllIdx = selectedMembers.findIndex((item) => item == "(All)");

      if (AllIdx >= 0) {
        setSelectedMembers((selectedMembers) => selectedMembers.filter((_, i) => i !== AllIdx));
      }
    }
  };

  const handleInculeExCludeAreaRadioChange = (val) => {
    setSelectedInculeExCludeAreaCondition(val);
  };

  const handleDatePatternRadioButtonCollectionOnChange = (event) => {
    setSelectMemberCollections([]);
    fieldData.userSelection = null;
    setBetweenGreaterThanValue("");
    setBetweenLessThanValue("");
    setCustomRequiredValue("");

    if (event.target.value != undefined || event.target.value != null) {
      setDatePatternRadioButtonValue(event.target.value);
    } else {
      if (event.target.tagName == "SPAN" && event.target.parentElement.children.length > 0) {
        setDatePatternRadioButtonValue(event.target.parentElement.children[0].value);
      }

      //// setDatePatternRadioButtonValue(event.target.children[0].value);
    }
  };

  const handleEqualPatternRadioCollectionOnChange = (event) => {
    if (event.target.value != undefined || event.target.value != null) {
      setEqualPatternRadioButtonValue(event.target.value);
    } else {
      if (event.target.tagName == "SPAN" && event.target.parentElement.children.length > 0) {
        setEqualPatternRadioButtonValue(event.target.parentElement.children[0].value);
      }
      // setEqualPatternRadioButtonValue(event.target.children[0].value);
    }
  };

  const handleWithPatternRadioButtonCollectionOnChange = (event) => {
    if (event.target.value != undefined || event.target.value != null) {
      setWithPatternRadioButtonValue(event.target.value);
    } else {
      if (event.target.tagName == "SPAN" && event.target.parentElement.children.length > 0) {
        setWithPatternRadioButtonValue(event.target.parentElement.children[0].value);
      }
      /// setWithPatternRadioButtonValue(event.target.children[0].value);
    }
  };

  const SelectionArea = () => {
    return (
      <div className="SelectionArea">
        {!showProgress && selectMemberCollections && selectMemberCollections.length > 0
          ? selectMemberCollections.map((item) => {
              return (
                <label className="checkboxes" key={item}>
                  <input
                    type="checkbox"
                    checked={selectedMembers ? selectedMembers.includes(item) : false}
                    name={item.toString()}
                    onChange={handleCBChange}
                  />
                  <span>{item}</span>
                </label>
              );
            })
          : null}
      </div>
    );
  };

  const InculeExcludeArea = () => {
    return (
      <ToggleButtonGroup
        type="radio"
        name="IncludeExclude"
        defaultValue={"Include"}
        value={selectedInculeExCludeAreaCondition}
        onChange={handleInculeExCludeAreaRadioChange}
      >
        <ToggleButton value={"Include"}>Include</ToggleButton>
        <ToggleButton value={"Exclude"}>Exclude</ToggleButton>
      </ToggleButtonGroup>
    );
  };

  const EqualPatternRadioCollection = (props) => {
    return (
      <div className="RadioButtonCollection" onClick={handleEqualPatternRadioCollectionOnChange}>
        <label>
          <input
            checked={equalPatternRadioButtonValue === "> Greater than"}
            type="radio"
            name="EqualPattern"
            value="> Greater than"
          />

          <span>{"> Greater than"}</span>
        </label>
        <label>
          <input
            checked={equalPatternRadioButtonValue === "< Less than"}
            type="radio"
            name="EqualPattern"
            value="< Less than"
          />
          <span>{"< Less than"}</span>
        </label>
        <label>
          <input
            checked={equalPatternRadioButtonValue === "= Equal to"}
            type="radio"
            name="EqualPattern"
            value="= Equal to"
          />
          <span>{"= Equal to"}</span>
        </label>
        <label>
          <input
            checked={equalPatternRadioButtonValue === ">= Greater than or Equal to"}
            type="radio"
            name="EqualPattern"
            value=">= Greater than or Equal to"
          />

          <span>{">= Greater than or Equal to"}</span>
        </label>
        <label>
          <input
            checked={equalPatternRadioButtonValue === "<= Less than or Equal to"}
            type="radio"
            name="EqualPattern"
            value="<= Less than or Equal to"
          />

          <span>{"<= Less than or Equal to"}</span>
        </label>
        <label>
          <input
            type="radio"
            checked={equalPatternRadioButtonValue === ">= Between <="}
            name="EqualPattern"
            value=">= Between <="
          />
          <span>{">= Between <="}</span>
        </label>
      </div>
    );
  };

  const WithPatternRadioButtonCollection = (props) => {
    return (
      <div
        className="RadioButtonCollection"
        onClick={handleWithPatternRadioButtonCollectionOnChange}
      >
        {props.items.map((item, Idx) => {
          return (
            <div key={Idx}>
              <label>
                <input
                  name={props.name}
                  checked={withPatternRadioButtonValue === item}
                  type="radio"
                  value={item}
                />

                <span>{item}</span>
              </label>
            </div>
          );
        })}
      </div>
    );
  };

  const DatePatternRadioButtonCollection = (props) => {
    return (
      <div
        className="RadioButtonCollection"
        onClick={handleDatePatternRadioButtonCollectionOnChange}
      >
        {props.items.map((item, Idx) => {
          return (
            <div key={Idx}>
              <label>
                <input
                  checked={datePatternRadioButtonValue === item}
                  name={props.name}
                  type="radio"
                  value={item}
                />

                <span>{item}</span>
              </label>
            </div>
          );
        })}
      </div>
    );
  };

  const SelectMemeberByType = (props) => {
    var members = null;
    if (fieldData && fieldData.datatype) {
      switch (fieldData.datatype) {
        case "float":
        case "double":
        case "int":
          members = (
            <div>
              <SelectionArea></SelectionArea>
            </div>
          );
          break;
        case "string":
          members = (
            <div>
              <SelectionArea></SelectionArea>
            </div>
          );
          break;
        case "timestamp":
          members = (
            <>
              <DatePatternRadioButtonCollection
                name="DatePattern"
                items={["Year", "Quarter", "Month", "Weekday", "Date"]}
              ></DatePatternRadioButtonCollection>
              <SelectionArea></SelectionArea>
            </>
          );
          break;
        default:
          members = null;
          break;
      }
    }

    return <div>{members}</div>;
  };

  const CustomMemberByType = (props) => {
    var members = null;
    if (fieldData && fieldData.datatype) {
      switch (fieldData.datatype) {
        case "float":
        case "double":
        case "int":
          members = (
            <div>
              <EqualPatternRadioCollection></EqualPatternRadioCollection>
            </div>
          );
          break;
        case "string":
          members = (
            <>
              <WithPatternRadioButtonCollection
                name="WithPattern"
                items={["Begins with", "Ends with", "Contains"]}
              ></WithPatternRadioButtonCollection>
            </>
          );
          break;
        case "timestamp":
          members = (
            <>
              <DatePatternRadioButtonCollection
                name="DatePattern"
                items={["Year", "Quarter", "Month", "Weekday", "Date"]}
              ></DatePatternRadioButtonCollection>
              <EqualPatternRadioCollection></EqualPatternRadioCollection>
            </>
          );
          break;
        default:
          members = null;
          break;
      }
    }

    return <div>{members}</div>;
  };

  const CustomMemeberArea = () => {
    try {
      return (
        <div>
          <CustomMemberByType></CustomMemberByType>
          {showProgress ? <CircularProgress /> : null}
          {equalPatternRadioButtonValue == ">= Between <=" ? (
            <div className="TextFieldDiv">
              <label>Greater than or Equal to</label>
              {datePatternRadioButtonValue == "Date" ? (
                <DatePicker
                  className="datePicker"
                  value={betweenGreaterThanValue}
                  format="dd/MM/yyyy"
                  onChange={(e) => setBetweenGreaterThanValue(e)}
                />
              ) : (
                <input
                  className="valueTextBox"
                  defaultValue={betweenGreaterThanValue}
                  type="number"
                  onBlur={(e) => setBetweenGreaterThanValue(e.target.value)}
                />
              )}
              <div className="col-sm-2"></div>
              <label>Less than or Equal to</label>
              {datePatternRadioButtonValue == "Date" ? (
                <DatePicker
                  className="datePicker"
                  value={betweenLessThanValue}
                  format="dd/MM/yyyy"
                  onChange={(e) => setBetweenLessThanValue(e)}
                />
              ) : (
                <input
                  className="valueTextBox"
                  defaultValue={betweenLessThanValue}
                  type="number"
                  onBlur={(e) => setBetweenLessThanValue(e.target.value)}
                />
              )}
            </div>
          ) : (
            <div className="TextFieldSingleDiv">
              <label>Value</label>
              {datePatternRadioButtonValue == "Date" ? (
                <DatePicker
                  className="datePicker"
                  value={customRequiredValue}
                  format="dd/MM/yyyy"
                  onChange={(e) => setCustomRequiredValue(e)}
                />
              ) : (
                <input
                  className="valueTextBox"
                  defaultValue={customRequiredValue}
                  type={fieldData && fieldData.datatype == "string" ? "text" : "number"}
                  onBlur={(e) => setCustomRequiredValue(e.target.value)}
                />
              )}
            </div>
          )}
          <span className="ValueErrorText">{customRequiredFieldHelperText}</span>
        </div>
      );
    } catch (e) {
      alert(e);
    }
  };

  const FormReturnObjectByType = () => {
    let _selectedMembersArray = [],
      result = {};
    if (fieldData && fieldData.datatype) {
      result = {
        fieldname: fieldData.fieldname,
        datatype: fieldData.datatype,
        prefix: fieldData.prefix,
        includeexclude: selectedInculeExCludeAreaCondition == "Include" ? "include" : "exclude",
        tabValue: tabValue,
        uId: fieldData.uId,
      };

      if (tabValue == 0) {
        result["userSelection"] = selectedMembers;

        if (fieldData.datatype == "timestamp") {
          result["prefix"] = datePatternRadioButtonValue;
        }
      } else {
        delete fieldData.userSelection;
        delete result.userSelection;

        switch (fieldData.datatype) {
          case "float":
          case "double":
          case "int":
            result["exprType"] = equalPatternRadioButtonValue;
            break;
          case "string":
            result["exprType"] = withPatternRadioButtonValue;
            break;
          case "timestamp":
            result["prefix"] = datePatternRadioButtonValue;
            result["exprType"] = equalPatternRadioButtonValue;
            break;
          default:
            break;
        }

        if (equalPatternRadioButtonValue == ">= Between <=") {
          if (datePatternRadioButtonValue == "Date") {
            result["exprInput"] =
              "'" +
              moment(betweenGreaterThanValue).format("YYYY-MM-DD") +
              "','" +
              moment(betweenLessThanValue).format("YYYY-MM-DD") +
              "'";
          } else {
            result["exprInput"] = betweenGreaterThanValue + "," + betweenLessThanValue;
          }
        } else {
          if (datePatternRadioButtonValue == "Date") {
            result["exprInput"] = "'" + moment(customRequiredValue).format("YYYY-MM-DD") + "'";
          } else {
            result["exprInput"] = customRequiredValue;
          }
        }
      }
    }

    result = modifiedResultForServerRequest(result);

    return result;
  };

  const modifiedResultForServerRequest = (result) => {
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

      if (result.prefix) {
        result.prefix = _modifier[result.prefix] || result.prefix;
      }

      return result;
    }

    return result;
  };

  const handleApplyButtonOnClick = (e) => {
    if (tabValue == 1) {
      if (equalPatternRadioButtonValue == ">= Between <=") {
        if (betweenGreaterThanValue == "" || betweenLessThanValue == "") {
          setCustomRequiredFieldHelperText("Enter a value.");
          e.preventDefault();
          return;
        } else {
          if (
            datePatternRadioButtonValue == "Date" &&
            new Date(betweenGreaterThanValue) > new Date(betweenLessThanValue)
          ) {
            setCustomRequiredFieldHelperText("Entered incorrect value.");
            e.preventDefault();
            return;
          } else {
            if (parseInt(betweenGreaterThanValue) > parseInt(betweenLessThanValue)) {
              setCustomRequiredFieldHelperText("Entered incorrect value.");
              e.preventDefault();
              return;
            }
          }
          setCustomRequiredFieldHelperText("");
        }
      } else {
        if (customRequiredValue == "") {
          setCustomRequiredFieldHelperText("Enter a value.");
          e.preventDefault();
          return;
        } else {
          setCustomRequiredFieldHelperText("");
        }
      }
    } else {
      setCustomRequiredFieldHelperText("");
    }

    handleModalReturn(FormReturnObjectByType());
    modalReset();
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const modalReset = () => {
    setCustomRequiredValue("");
    setTabValue(0);
    setSelectedInculeExCludeAreaCondition("Include");
    setBetweenGreaterThanValue("");
    setBetweenLessThanValue("");
    setSelectMemberCollections([]);
    setSelectedMembers([]);
    setDatePatternRadioButtonValue("Year");
    setEqualPatternRadioButtonValue("> Greater than");
    setWithPatternRadioButtonValue("Begins with");
    setCustomRequiredFieldHelperText("");
    setShowProgress(false);
  };

  return (
    <Modal
      open={fieldData != null}
      onClose={(e) => {
        modalReset();
        handleModalClose();
      }}
    >
      <Box>
        <h2>{fieldData ? fieldData.displayname : ""}</h2>
        <Box>
          <Tabs value={tabValue} onChange={handleTabChange}></Tabs>
          <Tab label="Select Members"></Tab>
          <Tab label="Custom Expression"></Tab>
        </Box>
        <TabPanel value={tabValue} index={0}>
          <div id="select">
            <div className="includeExcludeDivContainer">
              <InculeExcludeArea></InculeExcludeArea>
            </div>
            <div>
              <SelectMemeberByType></SelectMemeberByType>
              {showProgress ? <CircularProgress /> : null}
            </div>
          </div>
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <div id="custom">
            <div className="includeExcludeDivContainer">
              <InculeExcludeArea></InculeExcludeArea>
            </div>
            <CustomMemeberArea></CustomMemeberArea>
          </div>
        </TabPanel>
        <Button
          variant="secondary"
          onClick={(e) => {
            modalReset();
            handleModalClose();
          }}
        >
          Cancel
        </Button>

        <Button className="applyButton" variant="primary" onClick={handleApplyButtonOnClick}>
          Apply
        </Button>
      </Box>
    </Modal>

    /* <Modal
            show={fieldData != null}
            onHide={(e) => {
              
            }}
            backdrop="static"
            keyboard={false}
            className="Modal"
        >
            <Modal.Header closeButton>
                <Modal.Title>{fieldData ? fieldData.displayname : ""}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Tabs id="controlled-tab-example" activeKey={tabName} onSelect={(k) => setTabName(k)}>
                    <Tab eventKey="select" title="Select Members">
                       
                    </Tab>
                    <Tab eventKey="custom" title="Custom Expression">
                      
                    </Tab>
                </Tabs>
            </Modal.Body>
            <Modal.Footer>
               
            </Modal.Footer>
        </Modal>
        */
  );
};

export default FilterExpressions;
