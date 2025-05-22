import axios from "axios";

const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

export const createDoctor = async (docData) => {
    const response = await axios.post(`${REACT_APP_API_URL}/doctor/create`, docData);
    return response.data;
}

export const createGroomer = async (grmData) => {
    const response = await axios.post(`${REACT_APP_API_URL}/groomer/create`, grmData);
    return response.data;
}

export const deletedoc = async (doc_id,token) => {
    const response = await axios.delete(`${REACT_APP_API_URL}/doctor/delete/${doc_id}`,{
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
}

export const deletegrm = async (grm_id,token) => {
    const response = await axios.delete(`${REACT_APP_API_URL}/groomer/delete/${grm_id}`,{
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
}
