import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchLogin } from "./authService";


export const getLogin = createAsyncThunk("auth/getLogin", async () => {
    try {
      const data = await fetchLogin();
      return data;
    } catch (error) {
      console.error("Error in getLogin thunk:", error);
      throw error.response?.data?.error || error.message;
    }
  });

  const authSlice = createSlice({
    name: "auth",
    initialState: {
      auth: [],
      loading: false,
      error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(getLogin.pending, (state) => {
          state.loading = true;
        })
        .addCase(getLogin.fulfilled, (state, action) => {
          state.loading = false;
          state.auth = action.payload.data;
          state.message = action.payload.message;
        })
        .addCase(getLogin.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message;
        //   toast.error(state.error);
        })
    },
  });
  
  export default authSlice.reducer;