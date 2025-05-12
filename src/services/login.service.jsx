import axios from "axios";

const REACT_APP_API_URL = process.env.REACT_APP_API_URL;
// console.log("REACT_APP_API_URL =", REACT_APP_API_URL);

export const loginAdmin = async (username, password) => {
    const response = await axios.post(REACT_APP_API_URL + "/employee/login", {
        username: username,
        password: password
    });
    return response.data;
}

export const loginGroomer = async (username, password) => {
    const response = await axios.post(REACT_APP_API_URL + "/groomer/login", {
        username: username,
        password: password
    });
    return response.data;
}

export const loginOwner = async (username, password) => {
    const response = await axios.post(REACT_APP_API_URL + "/owner/login", {
        username: username,
        password: password
    });
    return response.data;
}

export const loginDoctor = async (username, password) => {
    const response = await axios.post(REACT_APP_API_URL + "/doctor/login", {
        username: username,
        password: password
    });
    return response.data;
}