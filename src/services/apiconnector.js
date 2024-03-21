import axios from "axios"
// #YEHI FILE FRONTEND+BACKEND KO CONNECT KR RHA H..USING AXIOS
export const axiosInstance = axios.create({});

export const apiConnector = ({method, url, bodyData, headers, params}) => {
    return axiosInstance({
        method:`${method}`,
        url:`${url}`,
        data: bodyData ? bodyData : null,
        headers: headers ? headers: null,
        params: params ? params : null, 
    });
}

