import axios from "axios";
import {toast} from "react-hot-toast"
export const generateCertificateFE = async (data, token) => {
  try {
    const response = await axios.post(
      "https://study1.onrender.com/api/v1/course/generate-certificate",
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log("Error in generating certificate", error)
    toast.error("Error generating certificate:");
    return null;
  }
};
