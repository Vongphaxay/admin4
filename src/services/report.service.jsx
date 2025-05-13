import axios from "axios";

const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

export const getNormalReport = async (token) => {
    const response = await axios.get(`${REACT_APP_API_URL}/report/get-all`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};
