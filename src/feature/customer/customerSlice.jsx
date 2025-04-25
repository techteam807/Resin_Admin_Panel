import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchCustomers, fetchCustomersDropdown, refrestCustom, fetchCustomersMap, sendDelivery, fetchMissedDeliveryLogs } from "./customerService";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export const getCustomers = createAsyncThunk("customer/getCustomers", async ({ page = 1, search = '' }) => {
    try {
      const data = await fetchCustomers(page, search);
      return data;
    } catch (error) {
      console.error("Error in getCustomers thunk:", error);
      throw error.response?.data?.error || error.message;
    }
  });

    export const getCustomersMap = createAsyncThunk("customer/getCustomersMap", async () => {
      try {
        const data = await fetchCustomersMap();
        return data;
      } catch (error) {
        console.error("Error in getProductsMap thunk:", error);
        throw error.response?.data?.error || error.message;
      }
    });

  export const refreshcustomers = createAsyncThunk(
    "customer/refreshcustomers",
    async () => {
      try {
        const data = await refrestCustom();
        return data;
      } catch (error) {
        console.error("Error in refresh customers thunk:", error);
        throw error.response?.data?.message || error.message || "Something went wrong";
      }
    }
  );

  export const getCustomersDropdown = createAsyncThunk("customer/getCustomersDropdown", async () => {
    try {
      const data = await fetchCustomersDropdown();
      return data;
    } catch (error) {
      console.error("Error in getCustomersDropdown thunk:", error);
      throw error.response?.data?.error || error.message;
    }
  });

  export const sendMissedDelivery = createAsyncThunk(
      "customer/sendMissedDelivery",
      async (customerData) => {
        try {
          const data = await sendDelivery(customerData);
          return data;
        } catch (error) {
          console.error("Error in send delivery thunk:", error);
          throw error.response?.data?.message || error.message || "Something went wrong";
        }
      }
    );

  export const getMissedDeliveryLogs= createAsyncThunk("customer/getMissedDeliveryLogs", async ({startDate, endDate, customerId}) => {
    try {
      // console.log("startDateSlice", startDate)
      // console.log("endDateSlice", endDate)
      const data = await fetchMissedDeliveryLogs({startDate, endDate, customerId});
      return data;
    } catch (error) {
      console.error("Error in missed delivery logs thunk:", error);
      throw error.response?.data?.error || error.message;
    }
  });

  const customerSlice = createSlice({
    name: "customer",
    initialState: {
      customers: [],
      customersMap: [],
      customersDropdown: [],
      missedDeliveryData: [],
      missedDelivery: null,
      loading: false,
      sendLoading: false,
      mapLoading: false,
      deliveryLoading: false,
      create: null,
      error: null,
      pagination: {
        currentPage: 1,
        totalData: 0,
        totalPages: 1,
      },
    },
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(getCustomers.pending, (state) => {
          state.loading = true;
        })
        .addCase(getCustomers.fulfilled, (state, action) => {
          state.loading = false;
          state.customers = action.payload.data;
          state.pagination = {
            currentPage: action.payload.pagination.currentPage,
            totalData: action.payload.pagination.totalData,
            totalPages: action.payload.pagination.totalPages,
          };
          state.message = action.payload.message;
        })
        .addCase(getCustomers.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message;
        })
        .addCase(getCustomersMap.pending, (state) => {
          state.mapLoading = true;
        })
        .addCase(getCustomersMap.fulfilled, (state, action) => {
          state.mapLoading = false;
          state.customersMap = action.payload.data;
          state.message = action.payload.message;
        })
        .addCase(getCustomersMap.rejected, (state, action) => {
          state.mapLoading = false;
          state.error = action.error.message;
        })
        .addCase(refreshcustomers.pending, (state) => {
          state.loading = true;
        })
        .addCase(refreshcustomers.fulfilled, (state, action) => {
          state.loading = false;
          state.create = action.payload.data;
          state.message = action.payload.message;
          toast.success(state.message);
        })
        .addCase(refreshcustomers.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message;
          toast.error(state.error);
        })
        .addCase(getCustomersDropdown.pending, (state) => {
          state.loading = true;
        })
        .addCase(getCustomersDropdown.fulfilled, (state, action) => {
          state.loading = false;
          state.customersDropdown = action.payload.data;
          state.message = action.payload.message;
        })
        .addCase(getCustomersDropdown.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message;
          toast.error(state.error);
        })
        .addCase(sendMissedDelivery.pending, (state) => {
          state.sendLoading = true;
        })
        .addCase(sendMissedDelivery.fulfilled, (state, action) => {
          state.sendLoading = false;
          state.missedDelivery = action.payload.data;
          state.message = action.payload.message;
          toast.success(state.message);
        })
        .addCase(sendMissedDelivery.rejected, (state, action) => {
          state.sendLoading = false;
          state.error = action.error.message;
          toast.error(state.error);
        })
        .addCase(getMissedDeliveryLogs.pending, (state) => {
          state.deliveryLoading = true;
        })
        .addCase(getMissedDeliveryLogs.fulfilled, (state, action) => {
          state.deliveryLoading = false;
          state.missedDeliveryData = action.payload.data;
          state.message = action.payload.message;
        })
        .addCase(getMissedDeliveryLogs.rejected, (state, action) => {
          state.deliveryLoading = false;
          state.error = action.error.message;
        })
    },
  });
  
  export default customerSlice.reducer;