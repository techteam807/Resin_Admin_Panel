import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createProd, delProduct, fetchProducts, resProduct, updateProd } from "./productService";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export const getProducts = createAsyncThunk("product/getProducts", async ({ search = '', active = true }) => {
    try {
      const data = await fetchProducts(search, active);
      return data;
    } catch (error) {
      console.error("Error in getProducts thunk:", error);
      throw error.response?.data?.error || error.message;
    }
  });

  export const deleteProduct = createAsyncThunk(
    "product/deleteProduct",
    async (productId) => {
      try {
        const data = await delProduct(productId);
        return data;
      } catch (error) {
        console.error("Error in delete product thunk:", error);
        throw error.response?.data?.message || error.message || "Something went wrong";
      }
    }
  );

  export const restoreProduct = createAsyncThunk(
    "product/restoreProduct",
    async (productId) => {
      try {
        const data = await resProduct(productId);
        return data;
      } catch (error) {
        console.error("Error in restore product thunk:", error);
        throw error.response?.data?.message || error.message || "Something went wrong";
      }
    }
  );

  export const createProduct = createAsyncThunk(
    "product/createProduct",
    async (productData) => {
      try {
        const data = await createProd(productData);
        return data;
      } catch (error) {
        console.error("Error in create product thunk:", error);
        throw error.response?.data?.message || error.message || "Something went wrong";
      }
    }
  );

  export const updateProduct = createAsyncThunk(
    "product/updateProduct",
    async ({productId, productData}) => {
      try {
        const data = await updateProd(productId, productData);
        return data;
      } catch (error) {
        console.error("Error in update product thunk:", error);
        throw error.response?.data?.message || error.message || "Something went wrong";
      }
    }
  );

  const productSlice = createSlice({
    name: "product",
    initialState: {
      products: [],
      delete: null,
      restore: null,
      create: null,
      update: null,
      loading: false,
      delLoading: false,
      addloading: false,
      error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(getProducts.pending, (state) => {
          state.loading = true;
        })
        .addCase(getProducts.fulfilled, (state, action) => {
          state.loading = false;
          state.products = action.payload.data;
          state.message = action.payload.message;
        })
        .addCase(getProducts.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message;
        })
        .addCase(deleteProduct.pending, (state) => {
            state.delLoading = true;
           })
           .addCase(deleteProduct.fulfilled, (state, action) => {
            state.delLoading = false;
            state.delete = action.payload;
            state.message = action.payload.message;
          
            const deletedProductId = action.payload.data._id;
          
            Object.keys(state.products).forEach((key) => {
              state.products[key] = state.products[key].filter(
                (product) => product._id !== deletedProductId
              );
            });
          
            toast.success(state.message);
          })
          
        .addCase(deleteProduct.rejected, (state, action) => {
            state.delLoading = false;
            state.error = action.error.message;
            toast.error(state.error);
        })
        .addCase(restoreProduct.pending, (state) => {
            state.delLoading = true;
         })
         .addCase(restoreProduct.fulfilled, (state, action) => {
          state.delLoading = false;
          state.restore = action.payload;
          state.message = action.payload.message;
        
          const restoredProduct = action.payload.data._id;
        
          Object.keys(state.products).forEach((key) => {
            state.products[key] = state.products[key].filter(
              (product) => product._id !== restoredProduct
            );
          });
        
          toast.success(state.message);
        })        
        .addCase(restoreProduct.rejected, (state, action) => {
            state.delLoading = false;
            state.error = action.error.message;
            toast.error(state.error);
        })
        .addCase(createProduct.pending, (state) => {
          state.addloading = true;
         })
         .addCase(createProduct.fulfilled, (state, action) => {
          state.addloading = false;
          state.create = action.payload.data;
          const newProduct = action.payload.data;
          state.message = action.payload.message;
        
          switch (newProduct.productStatus) {
            case 'new':
              state.products.newProducts.unshift(newProduct);
              break;
            case 'exhausted':
              state.products.exhaustedProducts.unshift(newProduct);
              break;
            case 'inuse':
              state.products.inuseProducts.unshift(newProduct);
              break;
            default:
              console.warn(`Unknown product status: ${newProduct.productStatus}`);
          }
        
          toast.success(state.message);
        })
        
        .addCase(createProduct.rejected, (state, action) => {
             state.addloading = false;
             state.error = action.error.message;
             toast.error(state.error);
        })
        .addCase(updateProduct.pending, (state) => {
          state.addloading = true;
         })
         .addCase(updateProduct.fulfilled, (state, action) => {
          state.addloading = false;
          const updatedProduct = action.payload.data;
          state.update = updatedProduct;
          state.message = action.payload.message;
        
          Object.keys(state.products).forEach((key) => {
            state.products[key] = state.products[key].filter(
              (product) => product._id !== updatedProduct._id
            );
          });

          switch (updatedProduct.productStatus) {
            case 'new':
              state.products.newProducts.unshift(updatedProduct);
              break;
            case 'exhausted':
              state.products.exhaustedProducts.unshift(updatedProduct);
              break;
            case 'inuse':
              state.products.inuseProducts.unshift(updatedProduct);
              break;
            default:
              console.warn(`Unknown product status: ${updatedProduct.productStatus}`);
          }
        
          toast.success(state.message);
        })        
        .addCase(updateProduct.rejected, (state, action) => {
             state.addloading = false;
             state.error = action.error.message;
             toast.error(state.error);
        })
    },
  });
  
  export default productSlice.reducer;