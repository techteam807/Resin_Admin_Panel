import axiosConfig from "@/app/axiosConfig";

export const fetchWarehouse = async () => {
    try {
      const response = await axiosConfig.get(`wareHouse`);
      return response.data;
    } catch (error) {
      console.error('Error fetching warehouse:', error);
      throw error;
    }
  };

  export const createWare = async (warehouseData) => {
    try {
      const response = await axiosConfig.post(`wareHouse`, warehouseData);
      return response.data;
    } catch (error) {
      console.error("Error creating warehouse:", error);
      throw error;
    }
  };

  export const delWarehouse = async (warehouseId) => {
    try {
      const response = await axiosConfig.delete(`wareHouse/delete/${warehouseId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching delete warehouse :", error);
      throw error;
    }
  };