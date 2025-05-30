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

export const getallcate_servicereport = async (token) => {
    const response = await axios.get(
        `${REACT_APP_API_URL}/report/get-all-cate-service`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return response.data;
}

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

export const UpdateCus = async (cus_id, cusData, token) => {
    const response = await axios.put(
        `${REACT_APP_API_URL}/customer/update?cus_id=${cus_id}`,
        cusData,
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

export const UpdatePayment_roompet = async (room_id, book_id, token) => {
    const response = await axios.put(
        `${REACT_APP_API_URL}/report/update-status?room_id=${room_id}&book_id=${book_id}`,
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return response.data;
}

export const GetAllEmp = async (token) => {
    const response = await axios.get(`${REACT_APP_API_URL}/report/get-all-employee`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const GetAllcategory_service = async (cat_id, token) => {
    const response = await axios.get(`${REACT_APP_API_URL}/report/get-all-category-service?cat_id=${cat_id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
}

export const GetAllroompet = async () => {
    const response = await axios.get(`${REACT_APP_API_URL}/roompet/get-all`);
    return response.data;
}

export const UpdateRoompet = async (roompet_id, roompetData, token) => {
    const response = await axios.put(
        `${REACT_APP_API_URL}/roompet/update?room_id=${roompet_id}`,
        roompetData,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return response.data;
}

export const DeleteRoompet = async (roompet_id, token) => {
    const response = await axios.delete(
        `${REACT_APP_API_URL}/roompet/delete/${roompet_id}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return response.data;
}

export const createRoompet = async (roompetData, token) => {
    const response = await axios.post(`${REACT_APP_API_URL}/roompet/create`, roompetData, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
}
