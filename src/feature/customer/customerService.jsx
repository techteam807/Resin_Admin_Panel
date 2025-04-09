import axiosConfig from "@/app/axiosConfig";


export const fetchCustomers = async (page = 1, search = '') => {
    try {
      const queryParams = new URLSearchParams({
        page: page,
      });
      if (search) {
        queryParams.append('search', search);
      }
      const response = await axiosConfig.get(`customers?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  };

  export const refrestCustom = async () => {
    try {
      const response = await axiosConfig.post(`customers/zoho-customers`);
      return response.data;
    } catch (error) {
      console.error("Error refresh customer:", error);
      throw error;
    }
  };

  export const fetchCustomersDropdown = async () => {
    try {
      const response = await axiosConfig.get(`customers/customerDropdown`);
      return response.data;
    } catch (error) {
      console.error('Error fetching customer dropdown:', error);
      throw error;
    }
  };