import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createWare, delWarehouse, fetchWarehouse } from "./warehouseService";

export const getWarehouse = createAsyncThunk("warehouse/getWarehouse", async () => {
    try {
      const data = await fetchWarehouse();
      return data;
    } catch (error) {
      console.error("Error in getWarehouse thunk:", error);
      throw error.response?.data?.error || error.message;
    }
  });

  export const deleteWarehouse = createAsyncThunk(
    "warehouse/deleteWarehouse",
    async (warehouseId) => {
      try {
        const data = await delWarehouse(warehouseId);
        return data;
      } catch (error) {
        console.error("Error in delete warehouse thunk:", error);
        throw error.response?.data?.message || error.message || "Something went wrong";
      }
    }
  );

  export const createWarehouse = createAsyncThunk(
    "warehouse/createWarehouse",
    async (warehouseData) => {
      try {
        const data = await createWare(warehouseData);
        return data;
      } catch (error) {
        console.error("Error in create warehouse thunk:", error);
        throw error.response?.data?.message || error.message || "Something went wrong";
      }
    }
  );

const warehouseSlice = createSlice({
    name: "warehouse",
    initialState: {
      warehouses: [],
      loading: false,
      deleteLoading: false,
      createLoading: false,
      create: null,
      delete: null,
      error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(getWarehouse.pending, (state) => {
          state.loading = true;
        })
        .addCase(getWarehouse.fulfilled, (state, action) => {
          state.loading = false;
          state.warehouses = action.payload.data.wareHouse;
          state.message = action.payload.message;
        })
        .addCase(getWarehouse.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message;
        })
        .addCase(createWarehouse.pending, (state) => {
          state.createLoading = true;
        })
        .addCase(createWarehouse.fulfilled, (state, action) => {
          state.createLoading = false;
          state.create = action.payload.data;
          state.warehouses.push(action.payload.data);
          state.message = action.payload.message;
          toast.success(state.message);
        })
        .addCase(createWarehouse.rejected, (state, action) => {
          state.createLoading = false;
          state.error = action.error.message;
          toast.error(state.error);
        })
        .addCase(deleteWarehouse.pending, (state) => {
            state.deleteLoading = true;
        })
        .addCase(deleteWarehouse.fulfilled, (state, action) => {
            state.deleteLoading = false;
            state.delete = action.payload;
            state.warehouses = state.warehouses.filter(
                (warehouse) => warehouse._id !== action.meta.arg
            );
            state.message = action.payload.message;
            toast.success(state.message);
        })
        .addCase(deleteWarehouse.rejected, (state, action) => {
            state.deleteLoading = false;
            state.error = action.error.message;
            toast.error(state.error);
        })
    },
  });
  
  export default warehouseSlice.reducer;