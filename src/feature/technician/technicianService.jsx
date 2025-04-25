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

  export const delPerTechnician = async (mobile_number) => {
    try {
      const response = await axiosConfig.delete(`users/deleteUsers`, { data: mobile_number });
      return response.data;
    } catch (error) {
      console.error("Error fetching permanent delete Technician :", error);
      throw error;
    }
  };

  export const fetchTechnicianDropdown = async () => {
    try {
      const response = await axiosConfig.get(`users/getUsersDropdown`);
      return response.data;
    } catch (error) {
      console.error('Error fetching Technician Dropdown:', error);
      throw error;
    }
  };

  export const fetchTechnicianScoreLogs = async ({ startDate, endDate, userId }) => {
    try {
      const params = {
        startDate,
        endDate,
        ...(userId && { userId }),
      };
  
      const response = await axiosConfig.get('logsManagement/logs/technicianScore', {
        params,
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching technician score logs:', error);
      throw error;
    }
  };