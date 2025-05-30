import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { appTechnician, delPerTechnician, delTechnician, fetchTechnicianDropdown, fetchTechnicianLogsAnalytics, fetchTechnicians, fetchTechnicianScoreLogs, resTechnician } from "./technicianService";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



export const getTechnicians = createAsyncThunk("technician/getTechnicians", async ({ page = 1, search = '', user_status = "" }) => {
    try {
        const data = await fetchTechnicians(page, search, user_status);
        return data;
    } catch (error) {
        console.error("Error in getTechnicians thunk:", error);
        throw error.response?.data?.error || error.message;
    }
});

export const deleteTechnician = createAsyncThunk(
    "technician/deleteTechnician",
    async (mobile_number) => {
        try {
            const data = await delTechnician(mobile_number);
            return data;
        } catch (error) {
            console.error("Error in delete technician thunk:", error);
            throw error.response?.data?.message || error.message || "Something went wrong";
        }
    }
);

export const restoreTechnician = createAsyncThunk(
    "technician/restoreTechnician",
    async (mobile_number) => {
        try {
            const data = await resTechnician(mobile_number);
            return data;
        } catch (error) {
            console.error("Error in restore technician thunk:", error);
            throw error.response?.data?.message || error.message || "Something went wrong";
        }
    }
);

export const approveTechnician = createAsyncThunk(
    "technician/approveTechnician",
    async (mobile_number) => {
        try {
            const data = await appTechnician(mobile_number);
            return data;
        } catch (error) {
            console.error("Error in approve technician thunk:", error);
            throw error.response?.data?.message || error.message || "Something went wrong";
        }
    }
);

export const deletePerTechnician = createAsyncThunk(
    "technician/deletePerTechnician",
    async (mobile_number) => {
        try {
            const data = await delPerTechnician(mobile_number);
            return data;
        } catch (error) {
            console.error("Error in permanent delete technician thunk:", error);
            throw error.response?.data?.message || error.message || "Something went wrong";
        }
    }
);

export const getTechnicianDropDown = createAsyncThunk("technician/getTechnicianDropDown", async () => {
    try {
      const data = await fetchTechnicianDropdown();
      return data;
    } catch (error) {
      console.error("Error in getTechnicianDropDown thunk:", error);
      throw error.response?.data?.error || error.message;
    }
  });

 export const getTechnicianScoreLogs= createAsyncThunk("technician/getTechnicianScoreLogs", async ({startDate, endDate, userId}) => {
    try {
      // console.log("startDateSlice", startDate)
      // console.log("endDateSlice", endDate)
      const data = await fetchTechnicianScoreLogs({startDate, endDate, userId});
      return data;
    } catch (error) {
      console.error("Error in technician score logs thunk:", error);
      throw error.response?.data?.error || error.message;
    }
  });

  export const getTechnicianLogsAnalytics = createAsyncThunk("technician/getTechnicianLogsAnalytics", async ({ startDate,endDate }) => {
    try {
        console.log("startDate", startDate)
      console.log("endDate", endDate)
      const data = await fetchTechnicianLogsAnalytics(startDate,endDate);
      return data;
    } catch (error) {
      console.error("Error in getTechnicianLogsAnalytics thunk:", error);
      throw error.response?.data?.error || error.message;
    }
  });
  

const technicianSlice = createSlice({
    name: "technician",
    initialState: {
        technicians: [],
        technicianDrop: [],
        technicianScoreData: [],
        technicianLogsAnalytics: [],
        delete: null,
        restore: null,
        approve: null,
        perdelete: null,
        pagination: {
            currentPage: 1,
            totalData: 0,
            totalPages: 1,
        },
        loading: false,
        tecnicianLoading: false,
        dropLoading: false,
        delLoading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getTechnicians.pending, (state) => {
                state.loading = true;
            })
            .addCase(getTechnicians.fulfilled, (state, action) => {
                state.loading = false;
                state.technicians = action.payload.data;
                state.pagination = {
                    currentPage: action.payload.pagination.currentPage,
                    totalData: action.payload.pagination.totalData,
                    totalPages: action.payload.pagination.totalPages,
                };
                state.message = action.payload.message;
            })
            .addCase(getTechnicians.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(deleteTechnician.pending, (state) => {
                state.delLoading = true;
            })
            .addCase(deleteTechnician.fulfilled, (state, action) => {
                state.delLoading = false;
                state.delete = action.payload.data;
                state.message = action.payload.message;
                state.technicians = state.technicians.filter(
                    (technician) => technician.mobile_number !== action.payload.data.mobile_number
                );
                toast.success(state.message);
            })
            .addCase(deleteTechnician.rejected, (state, action) => {
                state.delLoading = false;
                state.error = action.error.message;
                toast.error(state.error);
            })
            .addCase(restoreTechnician.pending, (state) => {
                state.delLoading = true;
            })
            .addCase(restoreTechnician.fulfilled, (state, action) => {
                state.delLoading = false;
                state.restore = action.payload;
                state.message = action.payload.message;
                state.technicians = state.technicians.filter(
                    (technician) => technician.mobile_number !== action.payload.data.mobile_number
                );
                toast.success(state.message);
            })
            .addCase(restoreTechnician.rejected, (state, action) => {
                state.delLoading = false;
                state.error = action.error.message;
                toast.error(state.error);
            })
            .addCase(approveTechnician.pending, (state) => {
                state.delLoading = true;
            })
            .addCase(approveTechnician.fulfilled, (state, action) => {
                state.delLoading = false;
                state.restore = action.payload;
                state.message = action.payload.message;
                state.technicians = state.technicians.filter(
                    (technician) => technician.mobile_number !== action.payload.data.mobile_number
                );
                toast.success(state.message);
            })
            .addCase(approveTechnician.rejected, (state, action) => {
                state.delLoading = false;
                state.error = action.error.message;
                toast.error(state.error);
            })
            .addCase(getTechnicianDropDown.pending, (state) => {
                state.dropLoading = true;
            })
            .addCase(getTechnicianDropDown.fulfilled, (state, action) => {
                state.dropLoading = false;
                state.technicianDrop = action.payload.data;
                state.message = action.payload.message;
            })
            .addCase(getTechnicianDropDown.rejected, (state, action) => {
                state.dropLoading = false;
                state.error = action.error.message;
            })
            .addCase(getTechnicianLogsAnalytics.pending, (state) => {
                state.loading = true;
            })
            .addCase(getTechnicianLogsAnalytics.fulfilled, (state, action) => {
                state.loading = false;
                state.technicianLogsAnalytics = action.payload.result;
                state.message = action.payload.message;
            })
            .addCase(getTechnicianLogsAnalytics.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(deletePerTechnician.pending, (state) => {
                state.delLoading = true;
            })
            .addCase(deletePerTechnician.fulfilled, (state, action) => {
                state.delLoading = false;
                state.perdelete = action.payload.data;
                state.message = action.payload.message;
                state.technicians = state.technicians.filter(
                    (technician) => technician.mobile_number !== action.payload.data.mobile_number
                );
                toast.success(state.message);
            })
            .addCase(deletePerTechnician.rejected, (state, action) => {
                state.delLoading = false;
                state.error = action.error.message;
                toast.error(state.error);
            })
            .addCase(getTechnicianScoreLogs.pending, (state) => {
                state.tecnicianLoading = true;
            })
            .addCase(getTechnicianScoreLogs.fulfilled, (state, action) => {
                state.tecnicianLoading = false;
                state.technicianScoreData = action.payload.result;
                state.message = action.payload.message;
            })
            .addCase(getTechnicianScoreLogs.rejected, (state, action) => {
                state.tecnicianLoading = false;
                state.error = action.error.message;
            })
    },
});

export default technicianSlice.reducer;
