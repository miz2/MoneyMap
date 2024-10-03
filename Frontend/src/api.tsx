import axios from "axios";
const API_BASE_URL = "http://localhost:5001";

export const fetchRecordsByUserAndMonth = async (userId: string, month: string, year: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/getByUserAndMonth/${userId}`, {
      params: { month, year }
    });

    // Check if the response has data
    if (response.data && response.data.length > 0) {
      return response.data;
    } else {
      // If no records found, return an empty array
      return [];
    }
  } catch (error: unknown) {
    // Handle specific error for 404 status
    if (axios.isAxiosError(error)) {
      if (error.response && error.response.status === 404) {
        console.log('No records found for the specified month and year.');
        return []; // Return an empty array if no records found
      } else {
        // console.error('Error fetching records:', error.message);
      }
    } else {
      console.error('Unexpected error:', error);
    }
    throw error; // Rethrow for further handling if needed
  }
};
