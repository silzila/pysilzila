import React, { useState, useEffect, useRef } from "react";
import PropTypes from 'prop-types';
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
    Typography,
    Popover,
    Select,
    Switch,
    TextField,
    ToggleButtonGroup,
    ToggleButton,
  } from "@mui/material";
  import "./filterExpressions.css";

  const FilterExpressions = ({ fieldData, tabTileProps, handleModalClose, handleModalReturn }) => {

    const [tabValue, setTabValue] = useState(0);
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
      };

      function TabPanel(props) {
        const { children, value, index, ...other } = props;
      
        return (
          <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
          >
            {value === index && (
              <Box sx={{ p: 3 }}>
                <Typography>{children}</Typography>
              </Box>
            )}
          </div>
        );
      }

      TabPanel.propTypes = {
        children: PropTypes.node,
        index: PropTypes.number.isRequired,
        value: PropTypes.number.isRequired,
      };

      function a11yProps(index) {
        return {
          id: `simple-tab-${index}`,
          'aria-controls': `simple-tabpanel-${index}`,
        };
      }

    return (
        <Modal
        className="modal-dialog"
        backdrop="static"
        open={fieldData != null}
        onClose={(e) => {
          //modalReset();
          handleModalClose();
        }}
      >
        <Box sx={{ width: '100%' }}>
          <h2>{fieldData ? fieldData.displayname : ""}</h2>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Select Members" {...a11yProps(0)}></Tab>
            <Tab label="Custom Expression" {...a11yProps(1)}></Tab>
            </Tabs>
          </Box>
          <TabPanel value={tabValue} index={0}>
        Item One
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        Item Two
      </TabPanel>
        </Box>
        </Modal>
    );
};

export default FilterExpressions;