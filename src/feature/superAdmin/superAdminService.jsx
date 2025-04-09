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