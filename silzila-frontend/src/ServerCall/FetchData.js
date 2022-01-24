import axios from "axios";
import { serverEndPoint } from "./EnvironmentVariables";

const FetchData = ({ requestType, method, url, data, headers }) => {
    return new Promise((resolve) => {
        switch (requestType) {
            case "withData":
                axios({ method, url: serverEndPoint + url, headers, data })
                    .then((res) => resolve({ status: true, data: res.data }))
                    .catch((err) => {
                        console.log(err.response.data);
                        resolve({ status: false, data: err.response.data });
                    });
                break;

            case "noData":
                console.log(headers);
                axios({ method, url: serverEndPoint + url, headers })
                    .then((res) => resolve({ status: true, data: res.data }))
                    .catch((err) => {
                        console.log(err.response.data);
                        resolve({ status: false, data: err.response.data });
                    });
                break;

            default:
                console.log("Fetch Data -- No fetch case made");
                break;
        }
    });
};

export default FetchData;
