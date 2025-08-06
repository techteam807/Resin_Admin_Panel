import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { updateProductStatus, updateProductCode } from "./superAdminService";

  export const changeProductStatus = createAsyncThunk(
    "product/changeProductStatus",
    async (superAdminData) => {
      try {
        console.log("superAdminData", superAdminData)
        const data = await updateProductStatus(superAdminData);
        return data;
      } catch (error) {
        console.error("Error update product thunk:", error);
        throw error.response?.data?.message || error.message || "Something went wrong";
      }
    }
  );

  export const editProductCode = createAsyncThunk(
    "product/editProductCode",
    async (productData) => {
      try {
        console.log("productData",productData)
        const data = await updateProductCode(productData);
        return data;
      } catch (error) {
        console.error("Error update product code thunk:", error);
         throw error.response?.data?.message || error.message || "Something went wrong";
      }
    }
  );

    const superAdminSlice = createSlice({
      name: "superAdmin",
      initialState: {
        loading: false,
        error: null,
      },
       reducers: {},
          extraReducers: (builder) => {
            builder
              .addCase(changeProductStatus.pending, (state) => {
                state.loading = true;
              })
              .addCase(changeProductStatus.fulfilled, (state, action) => {
                state.loading = false;
                const updatedProduct = action.payload.data;
                state.update = updatedProduct;
                state.message = action.payload.message;
                toast.success(state.message);
              })
              .addCase(changeProductStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                toast.error(state.error);
              })

              .addCase(editProductCode.pending, (state) => {
                state.loading = true;
              })
              .addCase(editProductCode.fulfilled, (state, action) => {
                state.loading = false;
                const updatedProductcode = action.payload.data;
                state.update = updatedProductcode;
                state.message = action.payload.message;
                toast.success(state.message);
              })
              .addCase(editProductCode.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                toast.error(state.error);
              })
          },
        });
        
        export default superAdminSlice.reducer;