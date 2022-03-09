import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { resetState } from "../../redux/Dataset/datasetActions";
import Canvas from "./Canvas";
import Sidebar from "./Sidebar";

const EditDataSet = (
	{
		//state
		// token,
		// connectionId,
		// schemaName,
	}
) => {
	const [editMode, setEditMode] = useState(true);
	// useEffect(() => {
	// 	console.log(connectionId);
	// }, []);

	return (
		<div className="createDatasetPage">
			<Sidebar editMode={editMode} />
			<Canvas />
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		token: state.isLogged.accessToken,
		connectionId: state.dataSetState.connection,
		schemaName: state.dataSetState.schema,
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		resetState: () => dispatch(resetState()),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(EditDataSet);
