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

  export const fetchCustomersMap = async () => {
    try {
      const response = await axiosConfig.get(`customers/customerLocation`);
      return response.data;
    } catch (error) {
      console.error('Error fetching products map:', error);
      throw error;
    }
  };

  export const sendDelivery = async (customerData) => {
    try {
      const response = await axiosConfig.post(`customers/SendMissedCartidgeMsg`, customerData);
      return response.data;
    } catch (error) {
      console.error("Error send delivery:", error);
      throw error;
    }
  };

  export const fetchMissedDeliveryLogs = async ({ startDate, endDate, customerId }) => {
    try {
      const params = {
        startDate,
        endDate,
        ...(customerId && { customerId }),
      };
  
      // console.log("params", params);
  
      const response = await axiosConfig.get('customers/missedCartidgeLog', {
        params,
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching missed delivery logs:', error);
      throw error;
    }
  };