import React, { useEffect, useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { ArrowPathIcon, ArrowPathRoundedSquareIcon, CheckIcon, ClipboardIcon, SquaresPlusIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/solid";
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
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";
import { deleteProduct, getProducts, restoreProduct } from "@/feature/product/productSlice";
import Loader from "../Loader";
import AddProduct from "./AddProduct";
import ProductDetails from "./ProductDetails";
import "./Home.css"
import AddXL from "./AddXL";

const ProductDesign = () => {

    const dispatch = useDispatch();
    const { products, loading, delLoading } = useSelector((state) => state.product);
    const [searchValue, setSearchValue] = useState("");
    const [active, setActive] = useState(true);
    const [open, setOpen] = useState(false);
    const [open1, setOpen1] = useState(false);
    const [details, setDetails] = useState(false);
    const [data, setDate] = useState(null);
    const [deletingProductId, setDeletingProductId] = useState(null);
    const [alertOpen, setAlertOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const [restoreOpen, setRestoreOpen] = useState(false);
    const [productToRestore, setProductToRestore] = useState(null);
    const [copiedStates, setCopiedStates] = useState({});
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

      const confirmDelete = (productId) => {
        setProductToDelete(productId);
        setAlertOpen(true);
    };
    
      const handleDelete = () => {
        if (productToDelete) {
          setDeletingProductId(productToDelete);
          dispatch(deleteProduct(productToDelete)).then(() => {
            setDeletingProductId(null);
            setAlertOpen(false);
          });
        }
      }

      const confirmRestore = (productId) => {
        setProductToRestore(productId);
        setRestoreOpen(true);
    };
    
      const handleRestore = () => {
        if (productToRestore) {
          setDeletingProductId(productToRestore);
          dispatch(restoreProduct(productToRestore)).then(() => {
            setDeletingProductId(null);
            setRestoreOpen(false);
          });
        }
      }

      const handleEditProduct = (product) => {
        setDate(product)
        setDetails(false);
        setOpen(true)
      }

      const XLOpen = () => {
        setOpen1(true)
      }

      const handleCopy = (productId, productCode) => {
        if (productCode) {
          navigator.clipboard.writeText(productCode).then(() => {
            setCopiedStates((prev) => ({ ...prev, [productId]: true }));
            setTimeout(() => {
              setCopiedStates((prev) => ({ ...prev, [productId]: false }));
            }, 1000);
          }).catch(err => {
            console.error('Failed to copy text: ', err);
          });
        }
      };

      const groupedProducts = inuseProducts.reduce((acc, product) => {
        const contactNumber = product?.Customer?.contact_number || "N/A";
        if (!acc[contactNumber]) {
          acc[contactNumber] = { contactNumber, products: [] };
        }
        acc[contactNumber].products.push(product);
        return acc;
      }, {});
      
      const groupedProductArray = Object.values(groupedProducts);
      
      let indexCounter = 1;
    
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
            <Button onClick={XLOpen} className="flex items-center gap-2 w-full h-max py-3 sm:w-max" size="sm">
              <SquaresPlusIcon strokeWidth={2} className="h-4 w-4" /> Add XL File
            </Button>
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
                    <div className="border-b border-blue-gray-100 p-4 text-center text-blue-600 font-semibold">NEW ({newProducts.length})</div>
                    <div className="space-y-3 p-3 h-[74vh] overflow-y-auto scrollbar-custom-blue">
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
                                <p className="font-semibold text-base text-black flex items-center gap-0.5">{product.productCode}
                                <Tooltip content={copiedStates[product._id] ? "Copied!" : "Copy"}>
                                  <IconButton
                                    variant="text"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleCopy(product._id, product.productCode);
                                    }}
                                    size='sm'
                                    color="blue"
                                  >
                                    {copiedStates[product._id] ? (
                                      <CheckIcon className="h-4 w-4 text-green-600" />
                                    ) : (
                                      <ClipboardIcon className="h-3.5 w-3.5 text-gray-600" />
                                    )}
                                  </IconButton>
                                </Tooltip>
                                </p>
                                <p className="pt-1 text-gray-600">{new Date(product?.updatedAt).toLocaleString()}</p>
                              </div>
                            </div>
                            {active === true ? (
                              <Tooltip content="Delete Product">
                                <IconButton
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    confirmDelete(product._id);
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
                                  confirmRestore(product?._id)
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
                        <div className="text-center text-gray-500">NO NEW PRODUCTS</div>
                      )}
                    </div>
                  </div>
                  }
                  {/* INUSE PRODUCTS */}
                  {active === true && 
                  <div className="border border-blue-gray-100 bg-[#f4f5f7] rounded-md ">
                  <div className="border-b border-blue-gray-100 p-4 text-center text-green-600 font-semibold">
                    INUSE ({inuseProducts.length})
                  </div>
                  <div className="space-y-3 p-3 h-[74vh] overflow-y-auto scrollbar-custom-green">
                    {groupedProductArray.length > 0 ? (
                      groupedProductArray.map(({ contactNumber, products }) => (
                        <Button
                          key={contactNumber}
                          variant="text"
                          color="green"
                          className="bg-white p-2 rounded-md group hover:cursor-pointer w-full text-start relative border-l-2 border-green-600"
                          
                        >
                          {/* Product List */}
                          {products.map((product, index) => (
                            <div key={product._id} className={`flex items-center justify-between p-2 ${
                              index !== products.length - 1 ? "border-b border-gray-200" : ""
                            }`}>
                              <div className="flex items-center" onClick={() => {
                                setDate(product); 
                                setDetails(true);
                              }}>
                                <div className="pe-2 py-2 border-e-2 border-gray-300 text-base">
                                  {indexCounter++} 
                                </div>
                                <div className="ps-2">
                                  <p className="font-semibold text-base text-black flex items-center gap-0.5">
                                    {product.productCode}
                                    <Tooltip content={copiedStates[product._id] ? "Copied!" : "Copy"}>
                                      <IconButton
                                        variant="text"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleCopy(product._id, product.productCode);
                                        }}
                                        size="sm"
                                        color="green"
                                      >
                                        {copiedStates[product._id] ? (
                                          <CheckIcon className="h-4 w-4 text-green-600" />
                                        ) : (
                                          <ClipboardIcon className="h-3.5 w-3.5 text-gray-600" />
                                        )}
                                      </IconButton>
                                    </Tooltip>
                                  </p>
                                  <p className="pt-1 text-gray-600">
                                    {new Date(product?.updatedAt).toLocaleString()}
                                  </p>
                                </div>
                              </div>
              
                              {/* Individual Delete Button */}
                              {active ? (
                                <Tooltip content="Delete">
                                  <IconButton
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      confirmDelete(product._id);
                                    }}
                                    color="green"
                                    variant="text"
                                  >
                                    {delLoading && deletingProductId === product._id ? (
                                      <ArrowPathIcon className="h-4 w-4 animate-spin" />
                                    ) : (
                                      <TrashIcon className="h-4 w-4" />
                                    )}
                                  </IconButton>
                                </Tooltip>
                              ) : (
                                <Tooltip content="Restore">
                                  <IconButton
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      confirmRestore(product._id);
                                    }}
                                    color="green"
                                    variant="text"
                                  >
                                    {delLoading && deletingProductId === product._id ? (
                                      <ArrowPathIcon className="h-4 w-4 animate-spin" />
                                    ) : (
                                      <ArrowPathRoundedSquareIcon className="h-4 w-4" />
                                    )}
                                  </IconButton>
                                </Tooltip>
                              )}
                            </div>
                          ))}
              
                          {/* Customer Details (Once per Group) */}
                          {products[0]?.Customer && (
                            <div className="m-1.5 p-2.5 rounded-lg bg-green-50 text-xs text-gray-700 font-medium space-y-1">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Customer Code:</span>
                                <span>{products[0]?.Customer?.contact_number || "N/A"}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Name:</span>
                                <span>{products[0]?.Customer?.display_name || "N/A"}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Email:</span>
                                <span>{products[0]?.Customer?.email || "N/A"}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Number:</span>
                                <span>{products[0]?.Customer?.mobile || "N/A"}</span>
                              </div>
                            </div>
                          )}
                        </Button>
                      ))
                    ) : (
                      <div className="text-center text-gray-500">NO INUSE PRODUCTS</div>
                    )}
                  </div>
                </div>
                  }
                  {/* EXHAUSTED PRODUCTS */}
                  <div className={`border border-blue-gray-100 bg-[#f4f5f7] rounded-md ${active === false ? "col-span-3" : ""}`}>
                    <div className="border-b border-blue-gray-100 p-4 text-center text-red-600 font-semibold">{active === false ? "DELETED PRODUCTS" : "EXHAUSTED" } ({exhaustedProducts.length})</div>
                    <div className="space-y-3 p-3 h-[74vh] overflow-y-auto scrollbar-custom-red">
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
                                <p className="font-semibold text-base text-black flex items-center gap-0.5">{product.productCode}
                                <Tooltip content={copiedStates[product._id] ? "Copied!" : "Copy"}>
                                  <IconButton
                                    variant="text"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleCopy(product._id, product.productCode);
                                    }}
                                    size='sm'
                                    color="red"
                                  >
                                    {copiedStates[product._id] ? (
                                      <CheckIcon className="h-4 w-4 text-green-600" />
                                    ) : (
                                      <ClipboardIcon className="h-3.5 w-3.5 text-gray-600" />
                                    )}
                                  </IconButton>
                                </Tooltip>
                                </p>
                                <p className="pt-1 text-gray-600">{new Date(product?.updatedAt).toLocaleString()}</p>
                              </div>
                            </div>
                            {active === true ? (
                              <Tooltip content="Delete Product">
                                <IconButton
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    confirmDelete(product._id);
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
                                    confirmRestore(product?._id)
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
                        <div className="text-center text-gray-500">{active === false ? " NO DELETED PRODUCTS" : "NO EXHAUSTED PRODUCTS" }</div>
                      )}
                    </div>
                  </div>
                </div>
            }
      </Card>
    </div>
    <AddProduct open={open} setOpen={setOpen} data={data} setData={setDate} />
    <AddXL open1={open1} setOpen1={setOpen1} />
    <ProductDetails details={details} setDetails={setDetails} handleEditProduct={handleEditProduct} data={data} setData={setDate} />
      <Dialog size='xs' open={alertOpen} handler={() => setAlertOpen(false)}>
        <DialogHeader className="flex items-center gap-2">
            <div className="bg-red-100 p-2 rounded-full">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M4.293 4.293a1 1 0 011.414 0l14 14a1 1 0 01-1.414 1.414l-14-14a1 1 0 010-1.414z"></path>
                </svg>
            </div>
            <Typography variant="h6" className="text-red-600 font-semibold">
                Confirm Deletion
            </Typography>
        </DialogHeader>
        <DialogBody>
            <Typography variant="small" className="text-gray-700">
                Are you sure you want to delete this Product? This action cannot be undone.
            </Typography>
        </DialogBody>
        <DialogFooter className="flex justify-end gap-2">
            <Button variant="outlined" color="gray" onClick={() => setAlertOpen(false)}>Cancel</Button>
            <Button color="red" onClick={handleDelete}>
                {delLoading && deletingProductId  === productToDelete ? (
                    <div className='px-[13px]'><ArrowPathIcon className="h-4 w-4 animate-spin" /></div>
                ) : (
                    "Delete"
                )}
            </Button>
        </DialogFooter>
      </Dialog>
      <Dialog size='xs' open={restoreOpen} handler={() => setRestoreOpen(false)}>
        <DialogHeader className="flex items-center gap-2">
            <div className="bg-red-100 p-2 rounded-full">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M4.293 4.293a1 1 0 011.414 0l14 14a1 1 0 01-1.414 1.414l-14-14a1 1 0 010-1.414z"></path>
                </svg>
            </div>
            <Typography variant="h6" className="text-red-600 font-semibold">
                Confirm Restore
            </Typography>
        </DialogHeader>
        <DialogBody>
            <Typography variant="small" className="text-gray-700">
                Are you sure you want to restore this Product? This action cannot be undone.
            </Typography>
        </DialogBody>
        <DialogFooter className="flex justify-end gap-2">
            <Button variant="outlined" color="gray" onClick={() => setRestoreOpen(false)}>Cancel</Button>
            <Button color="red" onClick={handleRestore}>
                {delLoading && deletingProductId === productToRestore ? (
                    <div className='px-[18px]'><ArrowPathIcon className="h-4 w-4 animate-spin" /></div>
                ) : (
                    "Restore"
                )}
            </Button>
        </DialogFooter>
    </Dialog>
   </div>
  )
}

export default ProductDesign
