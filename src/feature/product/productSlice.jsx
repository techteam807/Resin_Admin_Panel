import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createProd, delProduct, fetchProducts, resProduct, updateProd } from "./productService";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export const getProducts = createAsyncThunk("product/getProducts", async ({ page = 1, search = '', active = true }) => {
    try {
      const data = await fetchProducts(page, search, active);
      return data;
    } catch (error) {
      console.error("Error in getProducts thunk:", error);
      throw error.response?.data?.error || error.message;
    }
  });

  export const deleteProduct = createAsyncThunk(
    "product/deleteProduct",
    async (productId) => {
      try {
        const data = await delProduct(productId);
        return data;
      } catch (error) {
        console.error("Error in delete product thunk:", error);
        throw error.response?.data?.message || error.message || "Something went wrong";
      }
    }
  );

  export const restoreProduct = createAsyncThunk(
    "product/restoreProduct",
    async (productId) => {
      try {
        const data = await resProduct(productId);
        return data;
      } catch (error) {
        console.error("Error in restore product thunk:", error);
        throw error.response?.data?.message || error.message || "Something went wrong";
      }
    }
  );

  export const createProduct = createAsyncThunk(
    "product/createProduct",
    async (productData) => {
      try {
        const data = await createProd(productData);
        return data;
      } catch (error) {
        console.error("Error in create product thunk:", error);
        throw error.response?.data?.message || error.message || "Something went wrong";
      }
    }
  );

  export const updateProduct = createAsyncThunk(
    "product/updateProduct",
    async ({productId, productData}) => {
      try {
        const data = await updateProd(productId, productData);
        return data;
      } catch (error) {
        console.error("Error in update product thunk:", error);
        throw error.response?.data?.message || error.message || "Something went wrong";
      }
    }
  );

  const productSlice = createSlice({
    name: "product",
    initialState: {
      products: [],
      delete: null,
      restore: null,
      create: null,
      update: null,
      pagination: {
        currentPage: 1,
        totalData: 0,
        totalPages: 1,
      },
      loading: false,
      delLoading: false,
      addloading: false,
      error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(getProducts.pending, (state) => {
          state.loading = true;
        })
        .addCase(getProducts.fulfilled, (state, action) => {
          state.loading = false;
          state.products = action.payload.data;
          state.pagination = {
            currentPage: action.payload.pagination.currentPage,
            totalData: action.payload.pagination.totalData,
            totalPages: action.payload.pagination.totalPages,
          };
          state.message = action.payload.message;
        })
        .addCase(getProducts.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message;
        })
        .addCase(deleteProduct.pending, (state) => {
            state.delLoading = true;
           })
        .addCase(deleteProduct.fulfilled, (state, action) => {
            state.delLoading = false;
            state.delete = action.payload;
            state.message = action.payload.message;
            state.products = state.products.filter(
                (product) => product._id !== action.payload.data._id
              );
            toast.success(state.message);
        })
        .addCase(deleteProduct.rejected, (state, action) => {
            state.delLoading = false;
            state.error = action.error.message;
            toast.error(state.error);
        })
        .addCase(restoreProduct.pending, (state) => {
            state.delLoading = true;
         })
        .addCase(restoreProduct.fulfilled, (state, action) => {
            state.delLoading = false;
            state.restore = action.payload;
            state.message = action.payload.message;
            state.products = state.products.filter(
                (product) => product._id !== action.payload.data._id
              );
            toast.success(state.message);
        })
        .addCase(restoreProduct.rejected, (state, action) => {
            state.delLoading = false;
            state.error = action.error.message;
            toast.error(state.error);
        })
        .addCase(createProduct.pending, (state) => {
          state.addloading = true;
         })
        .addCase(createProduct.fulfilled, (state, action) => {
             state.addloading = false;
             state.create = action.payload.data;
             state.products = [action.payload.data, ...state.products];
             state.message = action.payload.message;
             toast.success(state.message);
        })
        .addCase(createProduct.rejected, (state, action) => {
             state.addloading = false;
             state.error = action.error.message;
             toast.error(state.error);
        })
        .addCase(updateProduct.pending, (state) => {
          state.addloading = true;
         })
        .addCase(updateProduct.fulfilled, (state, action) => {
             state.addloading = false;
             state.update = action.payload.data;
             state.products = state.products.map(product => 
                product._id === action.payload.data._id ? action.payload.data : product
             );
             state.message = action.payload.message;
             toast.success(state.message);
        })
        .addCase(updateProduct.rejected, (state, action) => {
             state.addloading = false;
             state.error = action.error.message;
             toast.error(state.error);
        })
    },
  });
  
  export default productSlice.reducer;