import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchWaterReports } from './waterReportsService';

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

const waterReportsSlice = createSlice({
    name: 'waterReport',
    initialState: {
        waterReports: [],
        loading: false,
        error: null,
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
            });
    },
});

export default waterReportsSlice.reducer;
