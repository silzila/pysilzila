import axios from "axios";
import { serverEndPoint } from "./EnvironmentVariables";
import jwtDecode from "jwt-decode";

// const CheckTokenValidity = async (token) => {
//     const decoded = jwtDecode(token);
//     let expiry = decoded.exp;

//     // get current time
//     var d = new Date();
//     var currentTime = d.getTime();
//     var currentTimeStr = `${currentTime}`;

//     // check if expired
//     var timeShort = currentTimeStr.substr(0, 10);
//     let diff = expiry - timeShort;
//     console.log(`Current time: ${timeShort} \nExpiry time: ${expiry} \nDifference: ${diff}`);

//     if (diff < 7200) {
//         return false;
//     }

//     return token;
// };

const FetchData = async ({ requestType, method, url, data, headers, token }) => {
    // if (token) {
    //     var token2 = await CheckTokenValidity(token);
    //     console.log(token, "\n", token2);
    // }

    // if (token2) {
    //  -------- below promise code here --------
    // } else {
    //     return { status: false, data: { detail: "Token Expired" } };
    // }

    return new Promise((resolve) => {
        switch (requestType) {
            case "withData":
                console.log(data);
                axios({ method, url: serverEndPoint + url, headers, data })
                    .then((res) => resolve({ status: true, data: res.data }))
                    .catch((err) => {
                        console.log(err.response.data);
                        resolve({ status: false, data: err.response.data });
                    });
                break;

            case "noData":
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
