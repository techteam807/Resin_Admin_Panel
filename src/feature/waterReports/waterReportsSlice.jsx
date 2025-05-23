import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createReports, deleteWaterReports, fetchWaterReports, generateReports } from './waterReportsService';
import { toast } from 'react-toastify';

export const getWaterReports = createAsyncThunk(
    'waterReports/getWaterReports',
    async ({ month, year }, { rejectWithValue }) => {
        try {
            const data = await fetchWaterReports(month, year);
            return data;
        } catch (error) {
            console.error('Error in getWaterReports thunk:', error);
            return rejectWithValue(error.response?.data?.error || error.message);
        }
    }
);

export const generateWaterReports = createAsyncThunk(
    'waterReports/generateWaterReports',
    async ({ customerId, logIds }, { rejectWithValue }) => {
        try {
            const data = await generateReports(customerId, logIds);
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
        console.log("logId",logId)
        const data = await deleteWaterReports(logId);
        return data;
      } catch (error) {
        console.error("Error in delete waterReport thunk:", error);
        throw error.response?.data?.message || error.message || "Something went wrong";
      }
    }
  );

const waterReportsSlice = createSlice({
    name: 'waterReport',
    initialState: {
        waterReports: [],
        loading: false,
        error: null,
        message: null,
        deleting: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getWaterReports.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getWaterReports.fulfilled, (state, action) => {
                state.loading = false;
                state.waterReports = action.payload.data;
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
                state.loading = true;
                state.error = null;
            })
            .addCase(createWaterReports.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
                toast.success(state.message);
            })
            .addCase(createWaterReports.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
                toast.error(state.error);
            })
            .addCase(deleteWaterReport.pending, (state) => {
        state.loading = true;
        state.deleting = true;
        state.error = null;
        state.message = null;
      })
      .addCase(deleteWaterReport.fulfilled, (state, action) => {
        state.loading = false;
        state.deleting = false;
        state.message = action.payload.message;
        toast.success(state.message);
      })
      .addCase(deleteWaterReport.rejected, (state, action) => {
        state.loading = false;
        state.deleting = false;
        state.error = action.payload || action.error.message;
        toast.error(state.error);
      });

    },
});

export default waterReportsSlice.reducer;
