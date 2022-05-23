import React, { useEffect, useMemo, useState, useRef } from "react";
import debounce from "lodash.debounce";
import ShowDataPopup from "../../ChartOptions/ShowDataPopup";
import * as CrossTab from "./CrossTab";

export const BuildTable = ({ crossTabData, dustbinRows, dustbinValues, 
  dustbinColumns, chartPropData, chartProperty, propKey, chartControls }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [popupData, setPopupData] = useState({});

  const [userClickedCell, serUserClickedCell] = useState(chartProperty.properties[propKey].crossTabUserClicked);

  const prevCountRef = useRef();

  useEffect(() => {
    prevCountRef.current = userClickedCell;
  });

  // const debouncedMouseClickHandler = useMemo(
  //     ()=>debounce(_mouseClickHandler.bind(this), 300)
  //     , []);

  // const _mouseClickHandler = (e) =>{
  //     let _prevId = prevCountRef.current;
  //     updateCrossTabUserClicked(propKey, {id :e.target.id, compare : e.target.getAttribute("compareObj")})

  //     if(_prevId && _prevId.id != e.target.id){
  //       let _cell = document.getElementById(_prevId.id);

  //       if(_cell){
  //         _cell.classList.remove("UserClickedCellChildren");
  //       }
  //     }

  //     if(![...e.target.classList].find(cls=>cls == "UserClickedCellChildren")){
  //       e.target.classList.add("UserClickedCellChildren");
  //       serUserClickedCell(()=> { return {id :e.target.id, compare : e.target.getAttribute("compareObj")}});
  //       console.log({id :e.target.id, compare : e.target.getAttribute("compareObj")})
  //     }
  //     else{
  //       e.target.classList.remove("UserClickedCellChildren");
  //       serUserClickedCell(()=> { return {id :"", compare : ""}});
  //     }
  //   }

  const _mouseEnterHandler = (e) => {
    let _compareObj = JSON.parse(e.target.getAttribute("compareObj"));

    if (!(Object.keys(_compareObj).length === 0 && _compareObj.constructor === Object)) {
      setPopupData({ data: _compareObj, rect: e.target.getClientRects()[0], remove: null, style: null });
      setShowPopup(true);
    }
  };

  const _hideCellDataPopup = () => {   
    setShowPopup(false); 
};

  const debouncedMouseEnterHandler = useMemo(() => debounce(_mouseEnterHandler.bind(this), 300), []);

  const debouncedMouseLeaveHandler = useMemo(() => debounce(_hideCellDataPopup.bind(this), 300), []);


 

  const _getUserClickedColor = (col, rowIndex, colIndex) => {
    let _className = "";

    if (
      userClickedCell &&
      userClickedCell.id &&
      userClickedCell.compare &&
      col &&
      col.displayData !== undefined &&
      col.displayData !== null &&
      col.displayData !== ""
    ) {
      ////TODO:: Need a generic function to check null. i.e. col.displayData

      let _userCellCompareJSON = {}; //// JSON.parse(userClickedCell.compare);
      let _idArray = userClickedCell.id.split("_");
      let _cellData = crossTabData[_idArray[0]].columnItems[_idArray[1]];
      _userCellCompareJSON = _cellData?.compareObj;

      if (Object.keys(_userCellCompareJSON).length > 0) {
        if (_idArray[2] == "true") {
          _className = "UserClickedCellRemainingChildren";

          if (_idArray[0] < dustbinColumns.length + 1) {
            if (colIndex >= dustbinRows.length) {
              return CrossTab.getUserClickedClassNameForColor(chartPropData, col, _userCellCompareJSON);
            }
          } else if (_idArray[1] < dustbinRows.length) {
            if (col.rowSpan > 1) {
              return CrossTab.getUserClickedClassNameForColor(chartPropData, col, _userCellCompareJSON);
            } else {
              if (rowIndex == _idArray[0]) {
                return "UserClickedCellChildren";
              }
            }
          } else {
            if (colIndex == _idArray[1]) {
              return "UserClickedCellChildren";
            }
          }
        } else {
          if (dustbinValues.length > 1) {
          } else {
          }
        }
      }
    } else {
    }
    return _className;
  };

  const _getHeaderClassName = (col, rowIndex, colIndex) => {
    let _header = "";

    //_header = rowIndex <= dustbinRows.length ? "CrossTabHeader " : "CrossTabLeftColumnHeader"; PRS 14 May 2022
    //_header = col.isHeaderField ? "CrossTabHeader " : "CrossTabLeftColumnHeader";
    _header = rowIndex < dustbinColumns.length ? "CrossTabHeader " : "CrossTabLeftColumnHeader";
   // _header = "CrossTabLeftColumnHeader";

    return col.displayData ? _header + _getUserClickedColor(col, rowIndex, colIndex) : "EmptyHeaderCell";
  };

  const GetTableContent = (col, rowIndex, colIndex) => {
    if (col.isHeaderField && !col.skip) {
      /*   onClick={e=>{e.persist(); debouncedMouseClickHandler(e)}}  */
      return (
        <th
          id={rowIndex + "_" + colIndex + "_" + col.isHeaderField}
          className={_getHeaderClassName(col, rowIndex, colIndex)}
          compareObj={JSON.stringify(col.compareObj)}
          key={colIndex}
          colSpan={col.columnSpan}
          rowSpan={col.rowSpan}
          style={{
            fontSize : chartControls.properties[propKey].crossTabHeaderLabelOptions.fontSize,
            fontWeight : chartControls.properties[propKey].crossTabHeaderLabelOptions.fontWeight,
            color : chartControls.properties[propKey].crossTabHeaderLabelOptions.labelColor,
           }}
        >
          {col.displayData}
        </th>
      );
    } else {
      if (!col.skip) {
        return (
          <td
            id={rowIndex + "_" + colIndex + "_" + col.isHeaderField}
            className={"CrossTabCell " + _getUserClickedColor(col, rowIndex, colIndex)}
            key={colIndex}
            style={{
             fontSize : chartControls.properties[propKey].crossTabCellLabelOptions.fontSize,
             fontWeight : chartControls.properties[propKey].crossTabCellLabelOptions.fontWeight,
             color : chartControls.properties[propKey].crossTabCellLabelOptions.labelColor,
            }}
            colSpan={col.columnSpan}
            rowSpan={col.rowSpan}
            compareObj={JSON.stringify(col.compareObj)}
            onMouseEnter={(e) => {
              if(chartControls.properties[propKey].mouseOver.enable){
                e.persist();
                debouncedMouseEnterHandler(e);
              }           
            }}
            onMouseLeave={(e) => {
              e.persist();
              debouncedMouseLeaveHandler(e);
            }}
          >
            {col.displayData}
          </td>
        );
      } else {
        return null;
      }
    }
  };

  let _tableContent = [];

  if (crossTabData.length > 0) {
    _tableContent = crossTabData.map((row, rowIndex) => {
      let _rowContent = [];
      _rowContent.push(
        row.columnItems.map((col, colIndex) => {
          return GetTableContent(col, rowIndex, colIndex);
        })
      );

      return (
        <tr className="CrossTabRow" style={{
          lineHeight : chartControls.properties[propKey].crossTabHeaderLabelOptions.fontSize >
          chartControls.properties[propKey].crossTabCellLabelOptions.fontSize ? 
          chartControls.properties[propKey].crossTabHeaderLabelOptions.fontSize / 20:
          chartControls.properties[propKey].crossTabCellLabelOptions.fontSize / 20
        }} key={rowIndex}>
          {_rowContent}
        </tr>
      );
    });
  }

  return (
    <div className="CrossTab">
      <table className="CrossTabTable">{_tableContent}</table>
      {showPopup ? <ShowDataPopup show={showPopup} {...popupData}></ShowDataPopup> : null}
    </div>
  );
};
