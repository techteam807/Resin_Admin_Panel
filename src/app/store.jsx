import { configureStore } from "@reduxjs/toolkit";
import customerReducer from "../feature/customer/customerSlice";
import authReducer from "../feature/auth/authSlice";
import productReducer from "../feature/product/productSlice";
import technicianReducer from "../feature/technician/technicianSlice";


export const store = configureStore({
    reducer: {
        customer: customerReducer,
        auth: authReducer,
        product: productReducer,
        technician: technicianReducer,
    },
});