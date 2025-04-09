import { configureStore } from "@reduxjs/toolkit";
import customerReducer from "../feature/customer/customerSlice";
import authReducer from "../feature/auth/authSlice";
import productReducer from "../feature/product/productSlice";
import technicianReducer from "../feature/technician/technicianSlice";
import warehouseReducer from "../feature/warehouse/warehouseSlice";
import productLogReducer from "../feature/productLog/productLogSlice"
import superAdminReducer from "../feature/superAdmin/superAdminSlice"


export const store = configureStore({
    reducer: {
        customer: customerReducer,
        auth: authReducer,
        product: productReducer,
        technician: technicianReducer,
        warehouse: warehouseReducer,
        productLog:productLogReducer,
        superAdmin:superAdminReducer
    },
});