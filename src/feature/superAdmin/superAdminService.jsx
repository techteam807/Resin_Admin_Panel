import axiosConfig from "@/app/axiosConfig";

 export const updateProductStatus = async (superAdminData) => {
    try {
      const response = await axiosConfig.patch(`admin/manage-product-status`, superAdminData);
      return response.data;
    } catch (error) {
      console.error("Error updating product status :", error);
      throw error;
    }
  };

  export const updateProductCode = async (productData) => {
    try {
      const response = await axiosConfig.put(`admin/productCodeUpdate`,productData);
      return response.data;
    }
    catch (error) {
      console.error("Error updating product code :", error)
      throw error;
    }
  }