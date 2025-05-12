import axios from "axios";

const REACT_APP_API_URL = process.env.REACT_APP_API_URL;
console.log("REACT_APP_API_URL =", REACT_APP_API_URL);

export const getRoomPet = async () => {
    const response = await axios.get(REACT_APP_API_URL + "/roompet/get-all");
    return response.data;
};