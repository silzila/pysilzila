import { combineReducers } from "redux";

import loggedReducer from "./UserInfo/isLogged";
import DataSetReducer from "./Dataset/dataset";

import tabStateReducer from "./TabTile/tabState";
import tileStateReducer from "./TabTile/tileState";
import tabTilePropsReducer from "./TabTile/tabTileProps";
import chartPropLeftReducer from "./ChartProperties/chartPropLeft";

const allReducers = combineReducers({
	isLogged: loggedReducer,
	dataSetState: DataSetReducer,

	tabState: tabStateReducer,
	tileState: tileStateReducer,
	tabTileProps: tabTilePropsReducer,

	chartPropsLeft: chartPropLeftReducer,
});

export default allReducers;
