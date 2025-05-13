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

export const getReportallcus = async (token) => {
    const response = await axios.get(
        `${REACT_APP_API_URL}/report/get-all-customer`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return response.data;
};

export const DeleteCustomer = async (cus_id, token) => {
    const response = await axios.delete(
        `${REACT_APP_API_URL}/customer/delete/${cus_id}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return response.data;
};

export const GetAllbooking = async (token) => {
    const response = await axios.get(`${REACT_APP_API_URL}/report/get-all-book`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};
