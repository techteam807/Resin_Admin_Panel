import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchCustomers, fetchCustomersDropdown, refrestCustom, fetchCustomersMap, sendDelivery, fetchMissedDeliveryLogs, fetchCustomersClusterMap, updateCustomersClusterMap, refetchCustomersClusterMap, fetchClusterRoutes } from "./customerService";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export const getCustomers = createAsyncThunk("customer/getCustomers", async ({ page = 1, search = '', isSubscription }) => {
  try {
    const data = await fetchCustomers(page, search, isSubscription);
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

export const getCustomersClusterMap = createAsyncThunk("customer/getCustomersClusterMap", async () => {
  try {
    const data = await fetchCustomersClusterMap();
    return data;
  } catch (error) {
    console.error("Error in getCustomersClusterMap thunk:", error);
    throw error.response?.data?.error || error.message;
  }
});

export const refreshCustomersClusterMap = createAsyncThunk("customer/refreshCustomersClusterMap", async () => {
  try {
    const data = await refetchCustomersClusterMap();
    return data;
  } catch (error) {
    console.error("Error in refreshCustomersClusterMap thunk:", error);
    throw error.response?.data?.message || error.message;
  }
});

export const editCustomersClusterMap = createAsyncThunk("customer/editCustomersClusterMap", async ({ reassignments }) => {
  try {
    console.log("reassignments", reassignments)
    const data = await updateCustomersClusterMap(reassignments);
    return data;
  } catch (error) {
    console.error("Error in editCustomersClusterMap thunk:", error);
    throw error.response?.data?.message || error.message;
  }
});

export const fetchClusterRoute = createAsyncThunk("customer/fetchClusterRoute", async (clusterNo) => {
  console.log(clusterNo,"no");
  
  try {
    const data = await fetchClusterRoutes(clusterNo);
    return data;
  } catch (error) {
    console.error("Error in fetchClusterRoute thunk:", error);
    throw error.response?.data?.message || error.message;
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

export const getMissedDeliveryLogs = createAsyncThunk("customer/getMissedDeliveryLogs", async ({ startDate, endDate, customerId }) => {
  try {
    // console.log("startDateSlice", startDate)
    // console.log("endDateSlice", endDate)
    const data = await fetchMissedDeliveryLogs({ startDate, endDate, customerId });
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
    customersClusterMap: [],
    updatedcustomersClusterMap: [],
    clusteroute: [],
    missedDelivery: null,
    loading: false,
    sendLoading: false,
    mapLoading: false,
    mapLoading1: false,
    refreshLoading: false,
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
      .addCase(getCustomersClusterMap.pending, (state) => {
        state.mapLoading1 = true;
      })
      .addCase(getCustomersClusterMap.fulfilled, (state, action) => {
        state.mapLoading1 = false;
        state.customersClusterMap = action.payload.data;
        state.message = action.payload.message;
      })
      .addCase(getCustomersClusterMap.rejected, (state, action) => {
        state.mapLoading1 = false;
        state.error = action.error.message;
      })
      .addCase(refreshCustomersClusterMap.pending, (state) => {
        state.mapLoading = true;
      })
      .addCase(refreshCustomersClusterMap.fulfilled, (state, action) => {
        state.mapLoading = false;
        state.refreshData = action.payload.data;
        state.message = action.payload.message;
        toast.success(state.message);
      })
      .addCase(refreshCustomersClusterMap.rejected, (state, action) => {
        state.mapLoading = false;
        state.error = action.error.message;
        toast.error(state.error);
      })
      .addCase(editCustomersClusterMap.pending, (state) => {
        state.mapLoading = true;
      })
      .addCase(editCustomersClusterMap.fulfilled, (state, action) => {
        state.mapLoading = false;
        state.updatedcustomersClusterMap = action.payload.data;
        console.log("hell", action.payload)
        state.message = action.payload.message;
        toast.success(state.message);
      })
      .addCase(editCustomersClusterMap.rejected, (state, action) => {
        state.mapLoading = false;
        state.error = action.error.message;
        console.log("hell", action.error)

        toast.error(state.error);
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

      .addCase(fetchClusterRoute.pending, (state) => {
        state.mapLoading = true;
      })
      .addCase(fetchClusterRoute.fulfilled, (state, action) => {
        state.mapLoading = false;
        state.clusteroute = action.payload.data;
        state.message = action.payload.message;
      })
      .addCase(fetchClusterRoute.rejected, (state, action) => {
        state.mapLoading = false;
        state.error = action.error.message;
      })
  },
});

export default customerSlice.reducer;