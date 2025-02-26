import axiosConfig from "@/app/axiosConfig";


export const fetchLogin = async () => {
    try {
      const response = await axiosConfig.get(`data`);
      return response.data;
    } catch (error) {
      console.error('Error fetching login:', error);
      throw error;
    }
  };