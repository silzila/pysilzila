import { combineReducers } from "redux";
import DataSetReducer from "./Dataset/dataset";
import loggedReducer from "./UserInfo/isLogged";

const allReducers = combineReducers({
    isLogged: loggedReducer,
    dataSetState: DataSetReducer,
});

export default allReducers;
