import axios from "axios";

const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

export const bookingRoom = async (petData, bookData, token) => {
  const response = await axios.post(
    `${REACT_APP_API_URL}/customer/create-pet-and-booking`,
    { petData, bookData },
    {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  return response.data;
};

export const getAllBookingbycus_id = async (cus_id, token) => {
  const response = await axios.get(
    `${REACT_APP_API_URL}/booking/get-all?cus_id=${cus_id}`,
    {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  return response;
}
