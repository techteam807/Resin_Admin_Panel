import axiosConfig from "@/app/axiosConfig";


export const fetchProducts = async (search = '', active = true, productStatus= '') => {
    try {
      const queryParams = new URLSearchParams({
        active: active
        });
        if (search) {
        queryParams.append('search', search);
        }
        if (productStatus) {
          queryParams.append('productStatus',productStatus);
        }
      const response = await axiosConfig.get(`products?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  };

  export const delProduct = async (productId) => {
    try {
      const response = await axiosConfig.put(`products/delete/${productId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching delete Product :", error);
      throw error;
    }
  };

  export const resProduct = async (productId) => {
    try {
      const response = await axiosConfig.put(`products/restore/${productId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching restore Product :", error);
      throw error;
    }
  };

  export const createProd = async (productData) => {
    try {
      const response = await axiosConfig.post(`products`, productData);
      return response.data;
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  };

  export const updateProd = async (productId, productData) => {
    try {
      const response = await axiosConfig.put(`products/update/${productId}`, productData);
      return response.data;
    } catch (error) {
      console.error("Error update product:", error);
      throw error;
    }
  };

  export const fetchProductsMap = async () => {
    try {
      const response = await axiosConfig.get(`location/geoLocations`);
      return response.data;
    } catch (error) {
      console.error('Error fetching products map:', error);
      throw error;
    }
  };