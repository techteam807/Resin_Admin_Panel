import { configureStore } from "@reduxjs/toolkit";
import customerReducer from "../feature/customer/customerSlice";
import authReducer from "../feature/auth/authSlice";
import productReducer from "../feature/product/productSlice";
import technicianReducer from "../feature/technician/technicianSlice";
import warehouseReducer from "../feature/warehouse/warehouseSlice";


export const store = configureStore({
    reducer: {
        customer: customerReducer,
        auth: authReducer,
        product: productReducer,
        technician: technicianReducer,
        warehouse: warehouseReducer,
    },
});