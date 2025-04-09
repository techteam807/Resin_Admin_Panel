import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchAllLogs, fetchProductsByProductId, fetchProductsLogList } from "./productLogService";


export const getProductsLogList = createAsyncThunk("productLog/getProductsLogList", async () => {
    try {
      const data = await fetchProductsLogList();
      return data;
    } catch (error) {
      console.error("Error in getProductsLogList thunk:", error);
      throw error.response?.data?.error || error.message;
    }
  });

  export const getProductsByProductId= createAsyncThunk("productLog/getProductsByProductId", async ({productId, startDate, endDate}) => {
    try {
      const data = await fetchProductsByProductId({productId, startDate, endDate});
      return data;
    } catch (error) {
      console.error("Error in getProductsByProductId thunk:", error);
      throw error.response?.data?.error || error.message;
    }
  });

  export const getAllProducts= createAsyncThunk("productLog/getAllProducts", async ({startDate, endDate, productId}) => {
    try {
      console.log("startDateSlice", startDate)
      console.log("endDateSlice", endDate)
      const data = await fetchAllLogs({startDate, endDate, productId});
      return data;
    } catch (error) {
      console.error("Error in getAllProducts thunk:", error);
      throw error.response?.data?.error || error.message;
    }
  });


  const productLogSlice = createSlice({
      name: "productLog",
      initialState: {
        productsLogList: [],
        productsData: [],
        productLoading: false,
        loading: false,
        error: null,
      },
      reducers: {},
      extraReducers: (builder) => {
        builder
          .addCase(getProductsLogList.pending, (state) => {
            state.loading = true;
          })
          .addCase(getProductsLogList.fulfilled, (state, action) => {
            state.loading = false;
            state.productsLogList = action.payload.data;
            state.message = action.payload.message;
          })
          .addCase(getProductsLogList.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
        .addCase(getProductsByProductId.pending, (state) => {
          state.productLoading = true;
        })
        .addCase(getProductsByProductId.fulfilled, (state, action) => {
          state.productLoading = false;
          state.productsData = action.payload.logs;
          state.message = action.payload.message;
        })
        .addCase(getProductsByProductId.rejected, (state, action) => {
          state.productLoading = false;
          state.error = action.error.message;
      })
      .addCase(getAllProducts.pending, (state) => {
        state.productLoading = true;
      })
      .addCase(getAllProducts.fulfilled, (state, action) => {
        state.productLoading = false;
        state.productsData = action.payload.logs;
        state.message = action.payload.message;
      })
      .addCase(getAllProducts.rejected, (state, action) => {
        state.productLoading = false;
        state.error = action.error.message;
    })
    },
  });
  
  export default productLogSlice.reducer;