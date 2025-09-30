import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createProd, createProdFlag, delProduct, fetchProducts, fetchProductsMap, moveToInspectionDuee, resProduct, updateProd } from "./productService";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export const getProducts = createAsyncThunk("product/getProducts", async ({ search = '', active = true, productStatus = '' }) => {
  try {
    const data = await fetchProducts(search, active, productStatus);
    return data;
  } catch (error) {
    console.error("Error in getProducts thunk:", error);
    throw error.response?.data?.error || error.message;
  }
});

export const getProductsMap = createAsyncThunk("product/getProductsMap", async () => {
  try {
    const data = await fetchProductsMap();
    return data;
  } catch (error) {
    console.error("Error in getProductsMap thunk:", error);
    throw error.response?.data?.error || error.message;
  }
});

export const deleteProduct = createAsyncThunk(
  "product/deleteProduct",
  async ({ productId, productData }) => {
    try {
      const data = await delProduct(productId, productData);
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
  async ({ productId, productData }) => {
    try {
      const data = await updateProd(productId, productData);
      return data;
    } catch (error) {
      console.error("Error in update product thunk:", error);
      throw error.response?.data?.message || error.message || "Something went wrong";
    }
  }
);

export const createProductFlag = createAsyncThunk(
  "product/createProductFlag",
  async (productData) => {
    try {
      const data = await createProdFlag(productData);
      return data;
    } catch (error) {
      console.error("Error in create product flag thunk:", error);
      throw error.response?.data?.message || error.message || "Something went wrong";
    }
  }
);

export const moveToInspectionDue = createAsyncThunk(
  "product/moveToInspectionDue",
  async (productId, { rejectWithValue }) => {
    try {
      const data = await moveToInspectionDuee(productId);
      return data;
    } catch (error) {
      console.error("Error in move to inspection due thunk:", error);
      return rejectWithValue(error.message || "Failed to move product to Inspection Due");
    }
  }
);

const productSlice = createSlice({
  name: "product",
  initialState: {
    products: [],
    productsMap: [],
    delete: null,
    restore: null,
    create: null,
    update: null,
    loading: false,
    Flagloading: false,
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
      .addCase(getProductsMap.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProductsMap.fulfilled, (state, action) => {
        state.loading = false;
        state.productsMap = action.payload.data;
        state.message = action.payload.message;
      })
      .addCase(getProductsMap.rejected, (state, action) => {
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
        state.deletingProductId = null;
        state.restore = action.payload;
        state.message = action.payload.message;

        const restoredProduct = action.payload.data._id;

        // Remove from all product lists including inspection due
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
      .addCase(createProductFlag.pending, (state) => {
        state.Flagloading = true;
      })
      .addCase(createProductFlag.fulfilled, (state, action) => {
        state.Flagloading = false;
        const flaggedProduct = action.payload.data;
        state.message = action.payload.message;

        if (flaggedProduct.productFlagCount >= 3) {
          Object.keys(state.products).forEach((key) => {
            state.products[key] = state.products[key].filter(
              (p) => p._id !== flaggedProduct._id
            );
          });

          const exists = state.products.InspectionDueProducts.find(
            (p) => p._id === flaggedProduct._id
          );
          if (!exists) {
            state.products.InspectionDueProducts.push(flaggedProduct);
          } else {
            state.products.InspectionDueProducts = state.products.InspectionDueProducts.map((p) =>
              p._id === flaggedProduct._id ? flaggedProduct : p
            );
          }
        } else {
          Object.keys(state.products).forEach((key) => {
            state.products[key] = state.products[key].map((p) =>
              p._id === flaggedProduct._id ? flaggedProduct : p
            );
          });
        }

        toast.success(state.message);
      })

      .addCase(createProductFlag.rejected, (state, action) => {
        state.Flagloading = false;
        state.error = action.error.message;
        toast.error(action.error.message || "Failed to flag product");
      })
      .addCase(moveToInspectionDue.pending, (state) => {
        state.delLoading = true;
        state.error = null;
      })
      .addCase(moveToInspectionDue.fulfilled, (state, action) => {
        state.delLoading = false;
        const movedProduct = action.payload.data;
        state.message = action.payload.message;
        Object.keys(state.products).forEach((key) => {
          state.products[key] = state.products[key].filter(
            (product) => product._id !== movedProduct._id
          );
        });
        state.products.inspectionDueProducts.unshift(movedProduct);
        toast.success(state.message);
      })
      .addCase(moveToInspectionDue.rejected, (state, action) => {
        state.delLoading = false;
        state.error = action.payload;
        toast.error(action.payload);
      });
  },
});

export default productSlice.reducer;