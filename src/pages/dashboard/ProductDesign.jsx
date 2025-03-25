import React, { useEffect, useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { ArrowPathIcon, ArrowPathRoundedSquareIcon, SquaresPlusIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/solid";
import {
  Card,
  CardHeader,
  Input,
  Typography,
  Button,
  Tabs,
  TabsHeader,
  Tab,
  IconButton,
  Tooltip,
} from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";
import { deleteProduct, getProducts, restoreProduct } from "@/feature/product/productSlice";
import Loader from "../Loader";
import AddProduct from "./AddProduct";
import ProductDetails from "./ProductDetails";

const ProductDesign = () => {

    const dispatch = useDispatch();
    const { products, loading, delLoading } = useSelector((state) => state.product);
    const [searchValue, setSearchValue] = useState("");
    const [active, setActive] = useState(true);
    const [open, setOpen] = useState(false);
    const [details, setDetails] = useState(false);
    const [data, setDate] = useState(null);
    const [deletingProductId, setDeletingProductId] = useState(null);
    const { newProducts = [], inuseProducts = [], exhaustedProducts = [] } = products || {};
    
    useEffect(() => {
      dispatch(getProducts({active: active }));
    }, [dispatch, active]);
    
    const handleSearch = () => {
        dispatch(getProducts({ active: active, search: searchValue }));
      }
    
      const searchClear = () => {
        setSearchValue('')
        dispatch(getProducts({ active: active }));
      }
    
      const handleDelete = (productId) => {
        if (productId) {
          setDeletingProductId(productId);
          dispatch(deleteProduct(productId)).then(() => {
            setDeletingProductId(null);
          });
        }
      }
    
      const handleRestore = (productId) => {
        if (productId) {
          setDeletingProductId(productId);
          dispatch(restoreProduct(productId)).then(() => {
            setDeletingProductId(null);
          });
        }
      }

      const handleEditProduct = (product) => {
        setDate(product)
        setDetails(false);
        setOpen(true)
      }
    
    const TABS = [
        {
          label: "All Products",
          value: "all",
          icon: SquaresPlusIcon,
          condition: true,
        },
        {
          label: "Deleted Products",
          value: "delete",
          icon: TrashIcon,
          condition: false,
        },
      ];

  return (
    <div className="">
    <div className="bg-clip-border rounded-xl bg-white text-gray-700 border border-blue-gray-100 mt-9 shadow-sm">
    <Card className="h-full w-full">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-3 flex flex-row md:items-center justify-between md:gap-8">
          <div>
            <Typography variant="h5" color="blue-gray">
              Product list
            </Typography>
            <Typography color="gray" variant="small" className="mt-1 font-normal">
              See information about all products
            </Typography>
          </div>
          <div className="flex shrink-0 gap-2 flex-row">
            <Button onClick={() => {setDate(null); setOpen(true) }} className="flex items-center gap-2 w-full h-max py-3 sm:w-max" size="sm">
              <SquaresPlusIcon strokeWidth={2} className="h-4 w-4" /> Add Product
            </Button>
          </div>
        </div>
        </CardHeader>
          <Tabs value="all" className="w-full pt-2">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row px-4">
            <TabsHeader>
              {TABS.map(({ label, value, icon, condition }) => (
                <Tab key={value} value={value} onClick={() => setActive(condition)}>
                    <div className="flex items-center gap-2 whitespace-nowrap">
                        {React.createElement(icon, { className: "w-4 h-4" })}
                        {label}
                    </div>
                </Tab>
              ))}
            </TabsHeader> 
            <div className="w-full md:w-72 relative flex gap-2">
              <Input
                label="Search"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                icon={searchValue ? <XMarkIcon onClick={searchClear} className="h-5 w-5 cursor-pointer" /> : null}
              />
              <Button onClick={handleSearch} variant="gradient" className="px-2.5" size="sm">
                <MagnifyingGlassIcon className="h-5 w-5" />
              </Button>
            </div>
          </div>
          </Tabs>
          {loading ? <div><Loader /></div> : 
            <div className="grid md:grid-cols-3 gap-7 items-start p-4 border-t mt-5 pt-5 border-blue-gray-100">
                {/* NEW PRODUCTS */}
                {active === true && 
                  <div className="border border-blue-gray-100 bg-[#f4f5f7] rounded-md">
                    <div className="border-b border-blue-gray-100 p-4 text-center text-blue-600 font-semibold">NEW</div>
                    <div className="space-y-3 p-3">
                      {newProducts.length > 0 ? (
                        newProducts.map((product, index) => (
                          <Button
                            variant="text"
                            key={product._id}
                            color="blue"
                            className="bg-white rounded-md group hover:cursor-pointer w-full text-start relative p-2 border-l-2 border-blue-600"
                            onClick={() => {
                              setDate(product);
                              setDetails(true);
                            }}
                          >
                            <div className="flex items-start justify-between">
                            <div className="p-1.5 flex items-center">
                              <div className="pe-2 py-2 border-e-2 border-gray-300 text-base">{index + 1}</div>
                              <div className="ps-2">
                                <p className="font-semibold text-base text-black">{product.productCode}</p>
                                <p className="pt-1 text-gray-600">{new Date(product?.updatedAt).toLocaleString()}</p>
                              </div>
                            </div>
                            {active === true ? (
                              <Tooltip content="Delete Product">
                                <IconButton
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(product._id);
                                  }}
                                  color="blue"
                                  variant="text"
                                  className="hidden group-hover:block"
                                >
                                  {delLoading && deletingProductId === product._id ? (
                                    <ArrowPathIcon className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <TrashIcon className="h-4 w-4" />
                                  )}
                                </IconButton>
                              </Tooltip>
                            ) : 
                            <Tooltip content="Restore Product">
                            <IconButton 
                                onClick={(e) => {
                                  e.stopPropagation(); 
                                  handleRestore(product?._id)
                                }} 
                                color="blue"
                                variant="text"
                                className="hidden group-hover:block"
                                >
                                  {delLoading && deletingProductId === product?._id ? 
                                      <ArrowPathIcon className="h-4 w-4 animate-spin" /> 
                                      :
                                      <ArrowPathRoundedSquareIcon className="h-4 w-4" />
                                    }
                            </IconButton>
                            </Tooltip>
                            }
                            </div>
                          </Button>
                        ))
                      ) : (
                        <div className="text-center text-gray-500">No NEW Products</div>
                      )}
                    </div>
                  </div>
                  }
                  {/* INUSE PRODUCTS */}
                  {active === true && 
                  <div className="border border-blue-gray-100 bg-[#f4f5f7] rounded-md ">
                    <div className="border-b border-blue-gray-100 p-4 text-center text-green-600 font-semibold">INUSE</div>
                    <div className="space-y-3 p-3">
                      {inuseProducts.length > 0 ? (
                        inuseProducts.map((product) => (
                          <Button
                            variant="text"
                            key={product._id}
                            color="green"
                            className="bg-white p-2 rounded-md group hover:cursor-pointer w-full text-start relative border-l-2 border-green-600"
                            onClick={() => {
                              setDate(product);
                              setDetails(true);
                            }}
                          >
                            <div className="flex items-start justify-between">
                            <div className="p-1.5 flex items-center">
                              <div className="pe-2 py-2 border-e-2 border-gray-300 text-base">{index + 1}</div>
                              <div className="ps-2">
                                <p className="font-semibold text-base text-black">{product.productCode}</p>
                                <p className="pt-1 text-gray-600">{new Date(product?.updatedAt).toLocaleString()}</p>
                              </div>
                            </div>
                            {active === true ? (
                              <Tooltip content="Delete Product">
                                <IconButton
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(product._id);
                                  }}
                                  color="green"
                                  variant="text"
                                  className="hidden group-hover:block"
                                >
                                  {delLoading && deletingProductId === product._id ? (
                                    <ArrowPathIcon className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <TrashIcon className="h-4 w-4" />
                                  )}
                                </IconButton>
                              </Tooltip>
                            ) : 
                            <Tooltip content="Restore Product">
                            <IconButton 
                                onClick={(e) => {
                                    e.stopPropagation(); 
                                    handleRestore(product?._id)
                                }} 
                                  color="green"
                                  variant="text"
                                  className="hidden group-hover:block"
                                >
                                  {delLoading && deletingProductId === product?._id ? 
                                      <ArrowPathIcon className="h-4 w-4 animate-spin" /> 
                                      :
                                      <ArrowPathRoundedSquareIcon className="h-4 w-4" />
                                  }
                            </IconButton>
                            </Tooltip>
                            }
                            </div>
                            {product?.Customer && (
                              <div className="m-1.5 p-2.5 rounded-lg bg-green-50 text-xs text-gray-700 font-medium space-y-1">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Customer Code:</span>
                                  <span>{product?.Customer?.contact_number || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Name:</span>
                                  <span>{product?.Customer?.display_name || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Email:</span>
                                  <span>{product?.Customer?.email || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Number:</span>
                                  <span>{product?.Customer?.mobile || 'N/A'}</span>
                                </div>
                              </div>
                            )}
                          </Button>
                        ))
                      ) : (
                        <div className="text-center text-gray-500">No INUSE Products</div>
                      )}
                    </div>
                  </div>  
                  }
                  {/* EXHAUSTED PRODUCTS */}
                  <div className={`border border-blue-gray-100 bg-[#f4f5f7] rounded-md ${active === false ? "col-span-3" : ""}`}>
                    <div className="border-b border-blue-gray-100 p-4 text-center text-red-600 font-semibold">{active === false ? "DELETED PRODUCTS" : "EXHAUSTED" }</div>
                    <div className="space-y-3 p-3">
                      {exhaustedProducts.length > 0 ? (
                        exhaustedProducts.map((product, index) => (
                          <Button
                            variant="text"
                            key={product._id}
                            color="red"
                            className="bg-white p-2 rounded-md group hover:cursor-pointer w-full text-start relative border-l-2 border-red-600"
                            onClick={() => {
                              setDate(product);
                              setDetails(true);
                            }}
                          >
                            <div className="flex items-start justify-between">
                            <div className="p-1.5 flex items-center">
                              <div className="pe-2 py-2 border-e-2 border-gray-300 text-base">{index + 1}</div>
                              <div className="ps-2">
                                <p className="font-semibold text-base text-black">{product.productCode}</p>
                                <p className="pt-1 text-gray-600">{new Date(product?.updatedAt).toLocaleString()}</p>
                              </div>
                            </div>
                            {active === true ? (
                              <Tooltip content="Delete Product">
                                <IconButton
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(product._id);
                                  }}
                                  color="red"
                                  variant="text"
                                  className="hidden group-hover:block"
                                >
                                  {delLoading && deletingProductId === product._id ? (
                                    <ArrowPathIcon className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <TrashIcon className="h-4 w-4" />
                                  )}
                                </IconButton>
                              </Tooltip>
                            ) : 
                            <Tooltip content="Restore Product">
                            <IconButton 
                                onClick={(e) => {
                                    e.stopPropagation(); 
                                    handleRestore(product?._id)
                                }} 
                                  color="red"
                                  variant="text"
                                  className="hidden group-hover:block"
                                >
                                  {delLoading && deletingProductId === product?._id ? 
                                      <ArrowPathIcon className="h-4 w-4 animate-spin" /> 
                                      :
                                      <ArrowPathRoundedSquareIcon className="h-4 w-4" />
                                  }
                            </IconButton>
                            </Tooltip>
                            }
                            </div>
                          </Button>
                        ))
                      ) : (
                        <div className="text-center text-gray-500">No EXHAUSTED Products</div>
                      )}
                    </div>
                  </div>
                </div>
            }
      </Card>
    </div>
    <AddProduct open={open} setOpen={setOpen} data={data} setData={setDate} />
    <ProductDetails details={details} setDetails={setDetails} handleEditProduct={handleEditProduct} data={data} setData={setDate} />
   </div>
  )
}

export default ProductDesign
