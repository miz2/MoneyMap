import axios from "axios";

const API_BASE_URL = "https://moneymap-1.onrender.com";

export const fetchRecordsByUserAndMonth = async (userId: string, month: string, year: string) => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}getByUserAndMonth/${userId}`, {
      params: { month, year },
    });

    // Return the data or an empty array if no records found
    return Array.isArray(data) && data.length > 0 ? data : [];
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 404) {
        console.log('No records found for the specified month and year.');
        return []; // Return an empty array if no records found
      }
    }
    console.error('Error fetching records:', error);
    throw error; // Rethrow for further handling if needed
  }
};
