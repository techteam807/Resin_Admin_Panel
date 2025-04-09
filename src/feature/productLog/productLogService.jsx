import axiosConfig from "@/app/axiosConfig";


export const fetchProductsLogList = async () => {
    try {
      const response = await axiosConfig.get(`products/pro`);
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  };

  export const fetchProductsByProductId = async ({productId, startDate, endDate}) => {
      try {
        const response = await axiosConfig.get(
          `logsManagement/logs/product/${productId}`,
          {
            params: {
              startDate,  
              endDate   
            }
          }
        );
        return response.data;
    } catch (error) {
      console.error('Error fetching products by ProductsId:', error);
      throw error;
    }
  };

  export const fetchAllLogs = async ({ startDate, endDate, productId }) => {
    try {
      const params = {
        startDate,
        endDate,
        ...(productId && { productId }),
      };
  
      console.log("params", params);
  
      const response = await axiosConfig.get('logsManagement/logs', {
        params,
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching products by ProductsId:', error);
      throw error;
    }
  };
  