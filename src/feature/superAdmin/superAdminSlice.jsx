import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { updateProductStatus } from "./superAdminService";

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
              })
              
          },
        });
        
        export default superAdminSlice.reducer;