import axios from "axios";

const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

export const CreateService_info = async (service_info_data, token) => {
    const response = await axios.post(
        `${REACT_APP_API_URL}/doctor/service-info/create`,
        service_info_data,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return response.data;
};

export const UpdateService_info = async (info_id,service_infoData,token) => {
    const response = await axios.put(
        `${REACT_APP_API_URL}/doctor/service-info/update?info_id=${info_id}`,
        service_infoData,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return response.data;
}