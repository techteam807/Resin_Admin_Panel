import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createReports, deleteWaterReports, fetchWaterReports, generateReports, uploadWaterReportPdf } from './waterReportsService';
import { toast } from 'react-toastify';

export const getWaterReports = createAsyncThunk(
  'waterReports/getWaterReports',
  async ({ month, year, startDate, endDate }, { rejectWithValue }) => {
    try {
      const data = await fetchWaterReports(month, year, startDate, endDate);
      return data;
    } catch (error) {
      console.error('Error in getWaterReports thunk:', error);
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

export const generateWaterReports = createAsyncThunk(
  'waterReports/generateWaterReports',
  async ({ customerId, logIds, docUrl }, { rejectWithValue }) => {
    try {
      const data = await generateReports(customerId, logIds, docUrl);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

export const createWaterReports = createAsyncThunk(
  'waterReports/createWaterReports',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await createReports(payload);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

export const deleteWaterReport = createAsyncThunk(
  "waterReports/deleteWaterReport",
  async (logId) => {
    try {
      console.log("logId", logId)
      const data = await deleteWaterReports(logId);
      return data;
    } catch (error) {
      console.error("Error in delete waterReport thunk:", error);
      throw error.response?.data?.message || error.message || "Something went wrong";
    }
  }
);

export const uploadWaterReport = createAsyncThunk(
  'waterReports/uploadWaterReport',
  async (pdfBlob, { rejectWithValue }) => {
    try {
      const data = await uploadWaterReportPdf(pdfBlob);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);


const waterReportsSlice = createSlice({
  name: 'waterReport',
  initialState: {
    waterReports: [],
    totalCount:0,
    loading: false,
    error: null,
    message: null,
    deleting: false,
    isLoading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getWaterReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // .addCase(getWaterReports.fulfilled, (state, action) => {
      //   state.loading = false;
      //   state.waterReports = action.payload.data;
      // })
            .addCase(getWaterReports.fulfilled, (state, action) => {
  state.loading = false;
  state.waterReports = Array.isArray(action.payload.data?.result)
    ? action.payload.data.result
    : [];
  state.totalCount = action.payload.data?.count || 0;
})
      .addCase(getWaterReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch water reports.';
      })
      .addCase(generateWaterReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateWaterReports.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        toast.success(state.message);
      })
      .addCase(generateWaterReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        toast.error(state.error);
      })
      .addCase(createWaterReports.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createWaterReports.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload.message;
        toast.success(state.message);

        const newReport = action.payload.data;
        const customerId = newReport.customerId;

        const customer = state.waterReports.find(
          (customer) => customer._id === customerId
        );

        if (customer) {
          if (!Array.isArray(customer.reports)) {
            customer.reports = [];
          }
          const existingReportIndex = customer.reports.findIndex(
            (report) => report._id === newReport._id
          );

          if (existingReportIndex !== -1) {
            customer.reports[existingReportIndex] = newReport;
          } else {
            customer.reports.push(newReport);
          }
        }
      })
      .addCase(createWaterReports.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
        toast.error(state.error);
      })
      .addCase(deleteWaterReport.pending, (state) => {
        state.deleting = true;
        state.error = null;
        state.message = null;
      })
      .addCase(deleteWaterReport.fulfilled, (state, action) => {
        state.deleting = false;
        state.message = action.payload.message || 'Report deleted successfully';
        toast.success(state.message);

        const reportId = action.meta.arg; // This is the logId you passed to the thunk

        // Find the customer containing the report
        const customer = state.waterReports.find((c) =>
          c.reports.some((r) => r._id === reportId)
        );

        if (customer) {
          customer.reports = customer.reports.filter((r) => r._id !== reportId);
        }
      })
      .addCase(deleteWaterReport.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload || action.error.message;
        toast.error(state.error);
      })
      .addCase(uploadWaterReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadWaterReport.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        // toast.success(state.message);
      })
      .addCase(uploadWaterReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        toast.error(state.error);
      });

  },
});

export default waterReportsSlice.reducer;
