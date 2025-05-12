import axios from "axios";

const REACT_APP_API_URL = process.env.REACT_APP_API_URL;
console.log("REACT_APP_API_URL =", REACT_APP_API_URL); // เพื่อตรวจว่า URL ถูกไหม


export const registerCustomer = async (cus_name, gender, address, tel, username, password) => {
    const response = await axios.post(REACT_APP_API_URL + "/customer/create", {
        cus_name: cus_name,
        gender: gender,
        address: address,
        tel: tel,
        username: username,
        password: password
    });
    return response.data;
}

export const loginCustomer = async (username, password) => {
    const response = await axios.post(REACT_APP_API_URL + "/customer/login", {
        username: username,
        password: password
    });
    return response.data;
}