import { connect } from "react-redux";
import React, { useEffect, useMemo, useState, useRef } from "react";

//import { updateCrossTabUserClicked } from "../../../redux/ChartProperties/actionsChartProps";
import * as CrossTab from "./CrossTab";
import { BuildTable } from "./BuildTable";
import './CrossTab.css';

const CrossTabChart = ({ propKey, graphDimension, chartProp, 	
	graphTileSize,
  //state
chartControl,
chartProperty

}) => {
  let enable = false,
    defaultTemplate = false,
    chartDataCSV = { rows: [], columns: [] },
    crossTabData = [],
    columnObj = {
      rowIndex: 0,
      isRowField: false,
      isHeaderField: false,
      parentColumnSpan: 1,
      columnSpan: 2,
      rowSpan: 1,
      compareObj: {},
      displayData: "",
      skip: false,
    },
    rowObj = {
      index: 0,
      rowSpan: 1,
      columnSpan: 1,
      compareObj: {},
      columnList: [],
      displayData: "",
      columnItems: [],
    },
    dustbinRows = [],
    dustbinColumns = [],
    dustbinValues = [];

  
    var property = chartControl.properties[propKey];
    var chartPropAxes =  chartProperty.properties[propKey].chartAxes;

    console.log(property, "+++++ PROPERTY +++++");
    let chartPropData = property.chartData ? property.chartData.result : "";
    console.log(chartPropData, "+++++ chartData +++++");

  const [showAsColumn, setShowAsColumn] = React.useState(true);

  /*
    Assign Dusbin values from chartPropData
  */
  if (chartPropAxes[1] && chartPropAxes[1].fields && chartPropAxes[1].fields.length > 0) {
    dustbinRows = CrossTab.cloneData(chartPropAxes[1].fields);
  }

  if (chartPropAxes[2] && chartPropAxes[2].fields && chartPropAxes[2].fields.length > 0) {
    dustbinColumns = CrossTab.cloneData(chartPropAxes[2].fields);
  }

  if (chartPropAxes[3] && chartPropAxes[3].fields && chartPropAxes[3].fields.length > 0) {
    dustbinValues = CrossTab.cloneData(chartPropAxes[3].fields);
  }

  /*
    To update the Column span. 
*/
  const updateColSpan = (noValue) => {
    if (dustbinValues.length > 1 && showAsColumn) {
      chartDataCSV.columns = CrossTab.addDusbinValuesMeasuresInChartData(dustbinValues, chartDataCSV.columns);

      for (let hdrRow = crossTabData.length - 1; hdrRow >= 0; hdrRow--) {
        for (let colIndex = 0; colIndex < crossTabData[hdrRow].columnItems.length; colIndex++) {
          let colData = crossTabData[hdrRow].columnItems[colIndex];
          let spanSize = 1;

          if (hdrRow + 1 === crossTabData.length) {
            spanSize = 1;
          } else if (hdrRow + 2 === crossTabData.length) {
            spanSize = dustbinValues.length;
          }
          //  else if (hdrRow === 0) {
          //   colData.columnSpan = chartDataCSV.columns.length || 1;
          //   continue;
          //} 
          else if (hdrRow - 1 === 0) {
            let _list = chartDataCSV.columns.filter((item) => item.includes(colData.displayData));
            spanSize = _list.length;
          } else {
            let compObj = "";

            Object.keys(colData.compareObj).forEach((key) => {
              compObj = compObj.concat(colData.compareObj[key], ",");
            });

            let _list = chartDataCSV.columns.filter((item) => item.includes(compObj));
            spanSize = _list.length;
          }

          colData.columnSpan = spanSize || 1;
        }
      }
    } else {
      if (noValue) {
        for (let hdrRow = crossTabData.length - 1; hdrRow >= 0; hdrRow--) {
          for (let colIndex = 0; colIndex < crossTabData[hdrRow].columnItems.length; colIndex++) {
            let colData = crossTabData[hdrRow].columnItems[colIndex];
            let spanSize = 1;

            if (hdrRow + 1 === crossTabData.length) {
              spanSize = 1;
            } else if (hdrRow === 0) {
              colData.columnSpan = chartDataCSV.columns.length || 1;
              continue;
            } else if (hdrRow - 1 === 0) {
              let _list = chartDataCSV.columns.filter((item) => item.includes(colData.displayData));
              spanSize = _list.length;
            } else {
              let compObj = "";

              Object.keys(colData.compareObj).forEach((key) => {
                compObj = compObj.concat(colData.compareObj[key], ",");
              });

              let _list = chartDataCSV.columns.filter((item) => item.includes(compObj));
              spanSize = _list.length;
            }

            colData.columnSpan = spanSize || 1;
          }
        }
      } else {
        updateColSpanHasValue(crossTabData, chartPropData);
      }
    }
  };

  const updateColSpanHasValue = (crossTabData, chartPropData) => {
    for (var hdrRow = 0; hdrRow < crossTabData.length; hdrRow++) {
      for (let colIndex = 0; colIndex < crossTabData[hdrRow].columnItems.length; colIndex++) {
        let colData = crossTabData[hdrRow].columnItems[colIndex];
        let _list = CrossTab.getFilteredChartPropDataByCompareObject(chartPropData, colData.compareObj);
        colData.columnSpan = _list.length || 1;
      }
    }
  };

  /*
    Push Dusbin Rows into crossTabData Header Area collection
*/
const appendRowsFieldsAsColumns = () => {
  for (let i = crossTabData.length - 1; i >= 0; i--) {
    let tempColumns = [];

    for (let row = 0; row < dustbinRows.length; row++) {
      let tempColumnObj = CrossTab.cloneData(columnObj);

      if (i === crossTabData.length - 1) {
        tempColumnObj.displayData = CrossTab.getKeyWithPrefix(dustbinRows[row]);
      } else {
      //  tempColumnObj.displayData = "";
        if(row == dustbinRows.length -1){
          tempColumnObj.displayData = dustbinColumns[i]?.fieldname;
        }
      }

      tempColumnObj.isRowField = true;
      tempColumnObj.isHeaderField = true;
      tempColumns.push(tempColumnObj);
    }

    if (dustbinValues.length > 1 && !showAsColumn) {
      let tempColumnObj = CrossTab.cloneData(columnObj);
      tempColumnObj.displayData = "";
      tempColumnObj.isRowField = true;
      tempColumnObj.isHeaderField = true;
      tempColumns.push(tempColumnObj);
    }

    crossTabData[i].columnItems = [...tempColumns, ...crossTabData[i].columnItems];
  }
};

  const populateTableBodydataWithoutRow = () => {
    if (!showAsColumn) {
      chartDataCSV.rows = CrossTab.addDusbinValuesMeasuresInChartData(dustbinValues, chartDataCSV.rows);
    }

    let tempRowObj = CrossTab.cloneData(rowObj);
    let columnIndex = 0;

    if (dustbinValues.length > 1 && showAsColumn) {
      columnIndex = dustbinColumns.length + 1;
    } else {
      columnIndex = dustbinColumns.length;
    }

    if (crossTabData[columnIndex] && crossTabData[columnIndex].columnItems) {
      crossTabData[columnIndex].columnItems.forEach((item, colIndex) => {
        let tempColumnObj = CrossTab.cloneData(columnObj);
        let compareObj = CrossTab.cloneData(item.compareObj);
        // let rowValues = chartDataCSV.columns.split(CrossTab.delimiter);

        if (dustbinValues.length === 1) {
          let _filteredData = CrossTab.getFilteredChartPropDataByCompareObject(chartPropData, compareObj)[0];

          if (_filteredData) {
            let _key = CrossTab.getKeyWithPrefix(dustbinValues[0]);
            tempColumnObj.displayData = _filteredData[_key];
          } else {
            tempColumnObj.displayData = "";
          }
          tempColumnObj.columnSpan = item.columnSpan;
          tempColumnObj.compareObj = compareObj;
        } else {
          if (showAsColumn) {
            let _filteredData = CrossTab.getFilteredChartPropDataByCompareObject(chartPropData, compareObj)[0];

            if (_filteredData) {
              /// let _key = CrossTab.getKeyWithPrefix(item, true);
              tempColumnObj.displayData = _filteredData[item.displayData];
            } else {
              tempColumnObj.displayData = "";
            }
            tempColumnObj.columnSpan = item.columnSpan;
          } else {
            let _filteredData = CrossTab.getFilteredChartPropDataByCompareObject(chartPropData, compareObj)[0];

            if (_filteredData) {
              // let tempValue = rowValues[chartDataCSV.columns.split(CrossTab.delimiter).length - 2];
              let valueField = dustbinValues.find((dustVal) => CrossTab.getKeyWithPrefix(dustVal) == item.displayData);

              let _key = CrossTab.getKeyWithPrefix(valueField);
              tempColumnObj.displayData = _filteredData[_key];
            } else {
              tempColumnObj.displayData = "";
            }
            tempColumnObj.columnSpan = item.columnSpan;
          }
          tempColumnObj.compareObj = compareObj;
        }
        tempRowObj.columnItems.push(tempColumnObj);
        tempRowObj.index = tempRowObj.index + 1;
      });
      crossTabData.push(tempRowObj);
    }
  };

  const populateTableBodydata = (noValue) => {
    if (!showAsColumn) {
      chartDataCSV.rows = CrossTab.addDusbinValuesMeasuresInChartData(dustbinValues, chartDataCSV.rows);
    }

    /*  From chart data collection need to run the loop for distinct rows */
    chartDataCSV.rows.forEach((row, rowIndex) => {
      let tempRowObj = CrossTab.cloneData(rowObj);
      let columnIndex = 0;

      if (dustbinValues.length > 1 && showAsColumn) {
        columnIndex = dustbinColumns.length; //+ 1;
      } else {
        columnIndex = dustbinColumns.length;
      }

      if (crossTabData[columnIndex] && crossTabData[columnIndex].columnItems) {
        crossTabData[columnIndex].columnItems.forEach((item, colIndex) => {
          let tempColumnObj = CrossTab.cloneData(columnObj);
          let compareObj = CrossTab.cloneData(item.compareObj);
          let rowValues = row.split(CrossTab.delimiter);

          if (item.isRowField) {
            if (rowIndex === 0) {
              tempColumnObj.displayData = rowValues[colIndex];
              tempColumnObj.isHeaderField = true;
              // let _comp = {};
              compareObj[item.displayData] = tempColumnObj.displayData;
              //tempColumnObj.compareObj = _comp;
            } else {
              let lastColumnIndex = 0;

              lastColumnIndex = dustbinRows.length;

              if (!showAsColumn && dustbinValues.length > 1) {
                lastColumnIndex += 1;
              }

              if (lastColumnIndex - 1 !== colIndex) {
                let previousRowData = CrossTab.getPreviousRowColumnData(
                  crossTabData,
                  dustbinColumns,
                  dustbinValues,
                  showAsColumn,
                  rowIndex,
                  colIndex
                );

                if (previousRowData && previousRowData.displayData == rowValues[colIndex]) {
                  previousRowData.rowSpan = rowIndex - parseInt(previousRowData.rowIndex) + 1;
                  tempColumnObj.skip = true;
                } else {
                  tempColumnObj.displayData = rowValues[colIndex];
                  compareObj[dustbinRows[colIndex].fieldname] = tempColumnObj.displayData;
                }
              } else {
                tempColumnObj.displayData = rowValues[colIndex];
                compareObj[dustbinRows[colIndex]?.fieldname] = tempColumnObj.displayData;
              }
            }
            tempColumnObj.isHeaderField = true;
            tempColumnObj.isRowField = true;
            tempColumnObj.compareObj = compareObj;
          } else {
            for (let i = 0; i < dustbinRows.length; i++) {
              compareObj[CrossTab.getKeyWithPrefix(dustbinRows[i])] = rowValues[i];
            }

            if (noValue) {
              tempColumnObj.displayData = "";
              tempColumnObj.columnSpan = 1;
            } else if (dustbinValues.length === 1) {
              let _filteredData = CrossTab.getFilteredChartPropDataByCompareObject(chartPropData, compareObj)[0];

              if (_filteredData) {
                let _key = CrossTab.getKeyWithPrefix(dustbinValues[0]);
                tempColumnObj.displayData = _filteredData[_key];

                let _compareObj = CrossTab.cloneData(compareObj);
                _compareObj[_key] = _filteredData[_key];
                tempColumnObj.compareObj = _compareObj;
              } else {
                tempColumnObj.displayData = "";
              }
              tempColumnObj.columnSpan = item.columnSpan;
            } else {
              if (showAsColumn) {
                let _filteredData = CrossTab.getFilteredChartPropDataByCompareObject(chartPropData, compareObj)[0];

                if (_filteredData) {
                  ////let _key = CrossTab.getKeyWithPrefix(item, true);
                  tempColumnObj.displayData = _filteredData[item.displayData];

                  let _compareObj = CrossTab.cloneData(compareObj);
                  _compareObj[item.displayData] = _filteredData[item.displayData];
                  tempColumnObj.compareObj = _compareObj;
                } else {
                  tempColumnObj.displayData = "";
                }
                tempColumnObj.columnSpan = item.columnSpan;
              } else {
                let _filteredData = CrossTab.getFilteredChartPropDataByCompareObject(chartPropData, compareObj)[0];

                if (_filteredData) {
                  let tempValue = rowValues[row.split(CrossTab.delimiter).length - 2];
                  let valueField = dustbinValues.find((dustVal) => CrossTab.getKeyWithPrefix(dustVal) == tempValue);

                  let _key = CrossTab.getKeyWithPrefix(valueField);
                  tempColumnObj.displayData = _filteredData[_key];

                  let _compareObj = CrossTab.cloneData(compareObj);
                  _compareObj[_key] = _filteredData[_key];
                  tempColumnObj.compareObj = _compareObj;
                } else {
                  tempColumnObj.displayData = "";
                }
                tempColumnObj.columnSpan = item.columnSpan;
              }
            }
          }
          tempColumnObj.rowIndex = rowIndex;
          tempRowObj.columnItems.push(tempColumnObj);
          tempRowObj.index = tempRowObj.index + 1;
        });
        crossTabData.push(tempRowObj);
      }
    });
  };

  /*
    Push Dusbin Values Measures into crossTabData Header Area collection
*/

  const addMeasureValuesInColumnHeaderArea = () => {
    if (dustbinValues.length > 0) {
      let tempRowObj = CrossTab.cloneData(rowObj);
      let previousColumnItems = crossTabData[crossTabData.length - 1].columnItems;

      for (let i = 0; i < previousColumnItems.length; i++) {
        dustbinValues.forEach((val) => {
          let tempColumnObj = CrossTab.cloneData(columnObj);
          tempColumnObj.displayData = CrossTab.getKeyWithPrefix(val);
          tempColumnObj.agg = val.agg;
          tempColumnObj.compareObj = previousColumnItems[i].compareObj;
          tempColumnObj.isHeaderField = true;
          tempRowObj.columnItems.push(tempColumnObj);
        });
      }
      crossTabData.push(tempRowObj);
    }
  };

  
  // const constructColumnHeaderArea = ()=>{
  //   for (let i = 0; i < dustbinColumns.length; i++) {
  //     if (i === 0) {
  //       let tempColumnObj = CrossTab.cloneData(columnObj);
  //       let tempRowObj = cloneData(rowObj);

  //       tempColumnObj.displayData = constructFirstRowFromDusbinColumns();
  //       tempColumnObj.isHeaderField = true;
  //       tempRowObj.columnItems.push(tempColumnObj);
  //       crossTabData.push(tempRowObj);

  //       tempRowObj = cloneData(rowObj);

  //       let _headerColumnList = getColumnList(i);
  //       tempRowObj.columnList.push(_headerColumnList);

  //       _headerColumnList.forEach((col) => {
  //         let tempColumnObj = cloneData(columnObj);
  //         tempColumnObj.displayData = col;
  //         tempColumnObj.compareObj[_getKeyWithPrefix(dustbinColumns[i])] = col;
  //         tempColumnObj.isHeaderField = true;
  //         tempRowObj.columnItems.push(tempColumnObj);
  //       });
  //       crossTabData.push(tempRowObj);
  //     } else {
  //       let tempRowObj = cloneData(rowObj);

  //       for (let colItem = 0; colItem < crossTabData[i].columnItems.length; colItem++) {

  //         let _currentCompObj = crossTabData[i].columnItems[colItem].compareObj;

  //         let list = getFilteredChartPropDataByCompareObject(_currentCompObj);
  //         /*  For each row there can be may Chat data objects, so based on the Dusbin column index need to filter distinct Column headers*/
  //         let distinctList = getDistinctList(_currentCompObj, i, list);
         
  //        /* IMPROMENT
  //        let _list = chartDataCSV.columns.filter(item => item.includes(crossTabData[i].columnItems[colItem].displayData))
         
  //        getColumnList(i, _list).forEach() --> form comp obj then filter using "getFilteredChartPropDataByCompareObject"

         
  //        */
         
         
  //         distinctList = distinctList || [];
  //         tempRowObj.columnList.push(distinctList);

  //         distinctList.forEach((item) => {
  //           let tempColumnObj = cloneData(columnObj);
  //           let tempCompareObj = cloneData(_currentCompObj);
  //           tempColumnObj.displayData = item[_getKeyWithPrefix(dustbinColumns[i])];
  //           tempCompareObj[_getKeyWithPrefix(dustbinColumns[i])] = tempColumnObj.displayData;
  //           tempColumnObj.compareObj = tempCompareObj;
  //           tempColumnObj.parentColumnSpan = distinctList.length;
  //           tempRowObj.columnItems.push(tempColumnObj);
  //           tempColumnObj.isHeaderField = true;
  //         });
  //       }
  //       crossTabData.push(tempRowObj);
  //     }
  //   }

  //   if (showAsColumn) {
  //     addMeasureValuesInColumnHeaderArea();
  //   }
  // }

  
  const constructColumnHeaderArea = () => {

    for (let i = 0; i < dustbinColumns.length; i++) {
       if (i === 0) {
      let tempColumnObj = CrossTab.cloneData(columnObj);
      let tempRowObj = CrossTab.cloneData(rowObj);

      // tempColumnObj.displayData = CrossTab.constructFirstRowFromDusbinColumns(dustbinColumns);
      // tempColumnObj.isHeaderField = true;
      // tempRowObj.columnItems.push(tempColumnObj);
      // crossTabData.push(tempRowObj);

      //tempRowObj = CrossTab.cloneData(rowObj);

      let _headerColumnList = CrossTab.getColumnList(i, chartDataCSV.columns);
      tempRowObj.columnList.push(_headerColumnList);

      _headerColumnList.forEach((col) => {
        let tempColumnObj = CrossTab.cloneData(columnObj);
        tempColumnObj.displayData = col;
        tempColumnObj.compareObj[CrossTab.getKeyWithPrefix(dustbinColumns[i])] = col;
        tempColumnObj.isHeaderField = true;
        tempRowObj.columnItems.push(tempColumnObj);
      });
      crossTabData.push(tempRowObj);
        } else {
     let tempRowObj = CrossTab.cloneData(rowObj);

      for (let colItem = 0; colItem < crossTabData[i -1].columnItems.length; colItem++) {
        let _currentCompObj = crossTabData[i- 1].columnItems[colItem].compareObj;

        let list = CrossTab.getFilteredChartPropDataByCompareObject(chartPropData, _currentCompObj);
        /*  For each row there can be may Chat data objects, so based on the Dusbin column index need to filter distinct Column headers*/
        let distinctList = CrossTab.getDistinctList(dustbinColumns, _currentCompObj, i, list);

        /* IMPROMENT
         let _list = chartDataCSV.columns.filter(item => item.includes(crossTabData[i].columnItems[colItem].displayData))
         
         CrossTab.getColumnList(i, _list).forEach() --> form comp obj then filter using "getFilteredChartPropDataByCompareObject"

         
         */

        distinctList = distinctList || [];
        tempRowObj.columnList.push(distinctList);

        distinctList.forEach((item) => {
          let tempColumnObj = CrossTab.cloneData(columnObj);
          let tempCompareObj = CrossTab.cloneData(_currentCompObj);
          tempColumnObj.displayData = item[CrossTab.getKeyWithPrefix(dustbinColumns[i])];
          tempCompareObj[CrossTab.getKeyWithPrefix(dustbinColumns[i])] = tempColumnObj.displayData;
          tempColumnObj.compareObj = tempCompareObj;
          tempColumnObj.parentColumnSpan = distinctList.length;
          tempRowObj.columnItems.push(tempColumnObj);
          tempColumnObj.isHeaderField = true;
        });
      }
      crossTabData.push(tempRowObj);
       }
    }

    if (showAsColumn) {
      addMeasureValuesInColumnHeaderArea();
    }
  };

  const showChartForAtleastOneDusbinField = (noValue) => {
    constructColumnHeaderArea();
    updateColSpan(noValue);
    appendRowsFieldsAsColumns();
    populateTableBodydata(noValue);
  };

  const showColumnsOnlyChart = () => {
    constructColumnHeaderArea();
    updateColSpan();
    defaultTemplate = false;
  };

  const showRowsOnlyChart = () => {
    let tempRowObj1 = CrossTab.cloneData(rowObj);

    dustbinRows.forEach((rowItem) => {
      let tempColumnObj = CrossTab.cloneData(columnObj);
      tempColumnObj.displayData = CrossTab.getKeyWithPrefix(rowItem);
      tempColumnObj.isHeaderField = true;
      tempRowObj1.columnItems.push(tempColumnObj);
    });

    crossTabData.push(tempRowObj1);

    for (let i = 0; i < chartDataCSV.rows.length; i++) {
      let tempRowObj = CrossTab.cloneData(rowObj);
      let compObj = {};
      let rowItemArray = chartDataCSV.rows[i].split(CrossTab.delimiter);

      rowItemArray.forEach((val, index) => {
        if (val) {
          let tempColumnObj = CrossTab.cloneData(columnObj);
          compObj[CrossTab.getKeyWithPrefix(dustbinRows[index])] = val;

          let previousRowData = CrossTab.getPreviousRowColumnData(crossTabData, dustbinColumns, dustbinValues, showAsColumn, i, index);

          if (previousRowData && previousRowData.displayData == val) {
            if (index + 2 !== rowItemArray.length) {
              previousRowData.rowSpan = i - parseInt(previousRowData.rowIndex) + 1;
              tempColumnObj.skip = true;
            } else {
              previousRowData.rowSpan = 1;
              tempColumnObj.displayData = val;
            }
          } else {
            tempColumnObj.displayData = val;
            tempColumnObj.isRowField = true;
          }
          tempColumnObj.compareObj = compObj;

          tempColumnObj.rowIndex = i;
          tempRowObj.columnItems.push(tempColumnObj);
        }
      });

      crossTabData.push(tempRowObj);
    }

    defaultTemplate = false;
  };

  const showValuesOnlyChart = () => {
    if (showAsColumn) {
      let tempRowObj1 = CrossTab.cloneData(rowObj);

      dustbinValues.forEach((rowItem) => {
        let tempColumnObj = CrossTab.cloneData(columnObj);
        tempColumnObj.displayData = CrossTab.getKeyWithPrefix(rowItem);
        tempColumnObj.isHeaderField = true;
        tempRowObj1.columnItems.push(tempColumnObj);
      });

      crossTabData.push(tempRowObj1);

      let tempRowObj = CrossTab.cloneData(rowObj);
      Object.keys(chartPropData[0]).forEach((key, idx) => {
        let tempColumnObj = CrossTab.cloneData(columnObj);
        tempColumnObj.displayData = chartPropData[0][key];
        tempRowObj.columnItems.push(tempColumnObj);
      });

      crossTabData.push(tempRowObj);
    } else {
      Object.keys(chartPropData[0]).forEach((key) => {
        let tempRowObj = CrossTab.cloneData(rowObj);
        let tempColumnObj = CrossTab.cloneData(columnObj);

        tempColumnObj.displayData = key;
        tempColumnObj.isHeaderField = true;
        tempRowObj.columnItems.push(tempColumnObj);

        tempColumnObj = CrossTab.cloneData(columnObj);

        tempColumnObj.displayData = chartPropData[0][key];
        tempRowObj.columnItems.push(tempColumnObj);

        crossTabData.push(tempRowObj);
      });
    }

    defaultTemplate = false;
  };

  const showColumnsAndValuesChart = () => {
    constructColumnHeaderArea();
    updateColSpan();
    populateTableBodydataWithoutRow();
    defaultTemplate = false;
  };

  const addColumnItemsFromRowBoj = (dustbinList, tempRowObj1) => {
    dustbinList.forEach((rowItem) => {
      let tempColumnObj = CrossTab.cloneData(columnObj);
      tempColumnObj.displayData = CrossTab.getKeyWithPrefix(rowItem);
      tempColumnObj.isHeaderField = true;
      tempRowObj1.columnItems.push(tempColumnObj);
    });
  };

  const showRowsAndValuesChart = () => {
    let tempRowObj1 = CrossTab.cloneData(rowObj);

    addColumnItemsFromRowBoj(dustbinRows, tempRowObj1);
    addColumnItemsFromRowBoj(dustbinValues, tempRowObj1);

    crossTabData.push(tempRowObj1);

    chartPropData.forEach((data, index) => {
      let tempRowObj = CrossTab.cloneData(rowObj);
      let compObj = {};

      Object.keys(data).forEach((key, pos) => {
        let tempColumnObj = CrossTab.cloneData(columnObj);

        if (pos > dustbinRows.length - 1) {
          tempColumnObj.displayData = data[key];
        } else {
          let previousRowData = CrossTab.getPreviousRowColumnData(crossTabData, dustbinColumns, dustbinValues, showAsColumn, index, pos, true);

          if (previousRowData && previousRowData.displayData == data[key]) {
            previousRowData.rowSpan = index - parseInt(previousRowData.rowIndex) + 1;
            tempColumnObj.skip = true;
          } else {
            tempColumnObj.displayData = data[key];
            tempColumnObj.isRowField = true;
            tempColumnObj.isHeaderField = true;
          }
        }

        compObj[key] = data[key];
        tempColumnObj.compareObj = CrossTab.cloneData(compObj);
        tempColumnObj.rowIndex = index;
        tempRowObj.columnItems.push(tempColumnObj);
      });

      tempRowObj.index = index;
      crossTabData.push(tempRowObj);
    });

    defaultTemplate = false;
  };

  const showColumnsAndRowsChart = () => {
    showChartForAtleastOneDusbinField(true);
    defaultTemplate = false;
  };

  const showAtleastOneEmptyDusbinFieldsChart = () => {
    if (dustbinColumns.length === 0 && dustbinRows.length > 0 && dustbinValues.length > 0) {
      showRowsAndValuesChart();
    } else if (dustbinColumns.length > 0 && dustbinRows.length === 0 && dustbinValues.length > 0) {
      showColumnsAndValuesChart();
    } else if (dustbinColumns.length > 0 && dustbinRows.length > 0 && dustbinValues.length === 0) {
      showColumnsAndRowsChart();
    } else if (dustbinColumns.length === 0 && dustbinRows.length === 0 && dustbinValues.length > 0) {
      showValuesOnlyChart();
    } else if (dustbinColumns.length > 0 && dustbinRows.length === 0 && dustbinValues.length === 0) {
      showColumnsOnlyChart();
    } else if (dustbinColumns.length === 0 && dustbinRows.length > 0 && dustbinValues.length === 0) {
      showRowsOnlyChart();
    } else {
      defaultTemplate = true;
    }
  };

  /*
  Render
  */
  if (chartPropData.length > 0) {
    enable = true;

    chartPropData.forEach((data) => {
      let _combineRow = "",
        _combineColumn = "";

      dustbinRows.forEach((rowField) => {
        _combineRow = _combineRow.concat(data[CrossTab.getKeyWithPrefix(rowField)], CrossTab.delimiter);
      });

      dustbinColumns.forEach((colField) => {
        _combineColumn = _combineColumn.concat(data[CrossTab.getKeyWithPrefix(colField)], CrossTab.delimiter);
      });

      if (_combineRow && !chartDataCSV.rows.includes(_combineRow)) {
        chartDataCSV.rows.push(_combineRow);
      }

      if (_combineColumn && !chartDataCSV.columns.includes(_combineColumn)) {
        chartDataCSV.columns.push(_combineColumn);
      }
    });

    if (dustbinColumns.length > 0 && dustbinRows.length > 0 && dustbinValues.length > 0) {
      showChartForAtleastOneDusbinField();
      defaultTemplate = false;
    } else {
      showAtleastOneEmptyDusbinFieldsChart();
    }
  } else {
    enable = false;
  }

  return (
    <div
      style={{
        width: graphDimension.width,
        height: graphDimension.height,
      }}
    >
      {/*dustbinValues.length > 1 && dustbinRows.length > 0 && dustbinColumns.length > 0 ? (
        <button onClick={(e) => setShowAsColumn(!showAsColumn)}>Swap Measures</button>
      ) : null */}
      {enable ? (
        defaultTemplate ? (
          <div style={{ overflowX: "scroll", maxWidth: "1100px", maxHeight: "500px" }}></div>
        ) : (
          <BuildTable
            crossTabData={crossTabData}
            dustbinRows={dustbinRows}
            dustbinValues={dustbinValues}
            dustbinColumns={dustbinColumns}
            chartPropData={chartPropData}
            chartControl={chartControl}
            chartProperty={chartProperty}
            propKey={propKey}
          ></BuildTable>
        )
      ) : null}
    </div>
  );
};

const mapStateToProps = (state) => {
	return {
		chartControl: state.chartControls,
		chartProperty: state.chartProperties,
	};
};


// const mapDispatchToProps = (dispatch) => {
//   return {
//     updateCrossTabUserClicked: (propKey, val) => dispatch(updateCrossTabUserClicked(propKey, val)),
//   };
// };

export default connect(mapStateToProps, null)(CrossTabChart);