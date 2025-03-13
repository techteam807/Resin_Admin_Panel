import axiosConfig from "@/app/axiosConfig";

export const fetchTechnicians = async (page = 1, search = '', user_status = "") => {
    try {
      const queryParams = new URLSearchParams({
        page: page,
        user_status: user_status
        });
        if (search) {
        queryParams.append('search', search);
        }
      const response = await axiosConfig.get(`users/getUsers?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching technicians:', error);
      throw error;
    }
  };

  export const delTechnician = async (mobile_number) => {
    try {
      const response = await axiosConfig.put(`users/deleteUser`, mobile_number);
      return response.data;
    } catch (error) {
      console.error("Error fetching delete Technician :", error);
      throw error;
    }
  };

  export const resTechnician = async (mobile_number) => {
    try {
      const response = await axiosConfig.put(`users/restoreUser`,mobile_number);
      return response.data;
    } catch (error) {
      console.error("Error fetching restore Technician :", error);
      throw error;
    }
  };

  export const appTechnician = async (mobile_number) => {
    try {
      const response = await axiosConfig.put(`users/approveUser`,mobile_number);
      return response.data;
    } catch (error) {
      console.error("Error fetching restore Technician :", error);
      throw error;
    }
  };