import axios from "axios";

export const generateCertificateFE = async (data, token) => {
  try {
    const response = await axios.post(
      "http://localhost:4000/api/v1/course/generate-certificate",
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error generating certificate:", error);
    return null;
  }
};
