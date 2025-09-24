import React, { useEffect, useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import {
  ArrowPathIcon,
  ArrowPathRoundedSquareIcon,
  CheckIcon,
  ClipboardIcon,
  FlagIcon,
  SquaresPlusIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
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
  Textarea,
} from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteProduct,
  getProducts,
  restoreProduct,
  createProductFlag,
} from "@/feature/product/productSlice";
import Loader from "../Loader";
import AddProduct from "./AddProduct";
import ProductDetails from "./ProductDetails";
import AddXL from "./AddXL";
import "./Home.css";

// Format UTC date to IST
const formatUTCDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Invalid Date";

  const istOffset = 5.5 * 60 * 60 * 1000;
  const istDate = new Date(date.getTime() + istOffset);

  const day = String(istDate.getUTCDate()).padStart(2, "0");
  const month = String(istDate.getUTCMonth() + 1).padStart(2, "0");
  const year = istDate.getUTCFullYear();

  let hours = istDate.getUTCHours();
  const minutes = String(istDate.getUTCMinutes()).padStart(2, "0");
  const seconds = String(istDate.getUTCSeconds()).padStart(2, "0");

  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds} ${ampm}`;
};

const ProductDesign = () => {
  const dispatch = useDispatch();
  const { products, loading, delLoading } = useSelector((state) => state.product);
  const [searchValue, setSearchValue] = useState("");
  const [active, setActive] = useState(true);
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [details, setDetails] = useState(false);
  const [data, setData] = useState(null);
  const [deletingProductId, setDeletingProductId] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [restoreOpen, setRestoreOpen] = useState(false);
  const [productToRestore, setProductToRestore] = useState(null);
  const [copiedStates, setCopiedStates] = useState({});
  const [productNotes, setProductNotes] = useState(null);
  const [error, setError] = useState("");
  const [productFlags, setProductFlags] = useState({});
  const [flaggingProductId, setFlaggingProductId] = useState(null);
  const [flagErrorOpen, setFlagErrorOpen] = useState(false);
  const [flagError, setFlagError] = useState("");
  const [restoreErrorOpen, setRestoreErrorOpen] = useState(false);
  const [restoreError, setRestoreError] = useState("");
  const [inspectionDueDialogOpen, setInspectionDueDialogOpen] = useState(false);

  useEffect(() => {
    const initialFlags = {};
    ["newProducts", "inuseProducts", "exhaustedProducts", "inspectionDueProducts"].forEach((key) => {
      products[key]?.forEach((product) => {
        if (product.productFlagCount) {
          initialFlags[product._id] = product.productFlagCount;
        }
      });
    });
    setProductFlags(initialFlags);
  }, [products]);

  useEffect(() => {
    dispatch(getProducts({ active: active }));
  }, [dispatch, active]);

  const handleSearch = () => {
    dispatch(getProducts({ active: active, search: searchValue }));
  };

  const searchClear = () => {
    setSearchValue("");
    dispatch(getProducts({ active: active }));
  };

  const confirmDelete = (productId) => {
    setProductToDelete(productId);
    setAlertOpen(true);
  };

  const handleDelete = () => {
    if (!productNotes || productNotes.trim() === "") {
      setError("Please enter a note before deleting the product.");
      return;
    }

    if (productToDelete) {
      setDeletingProductId(productToDelete);
      dispatch(deleteProduct({ productId: productToDelete, productData: { productNotes: productNotes } }))
        .unwrap()
        .then(() => {
          setDeletingProductId(null);
          setProductNotes(null);
          setError("");
          setAlertOpen(false);
        })
        .catch((error) => {
          setError(error.message || "Failed to delete product");
          setDeletingProductId(null);
        });
    }
  };

  const confirmRestore = (productId) => {
    setProductToRestore(productId);
    setRestoreOpen(true);
  };

  const handleRestore = () => {
    if (productToRestore) {
      setDeletingProductId(productToRestore);
      setRestoreError("");
      dispatch(restoreProduct(productToRestore))
        .unwrap()
        .then(() => {
          dispatch(getProducts({ active: active }));
          setDeletingProductId(null);
          setRestoreOpen(false);
        })
        .catch((error) => {
          setRestoreError(error.message || "Failed to restore product");
          setRestoreErrorOpen(true);
          setDeletingProductId(null);
        });
    }
  };

  const handleEditProduct = (product) => {
    setData(product);
    setDetails(false);
    setOpen(true);
  };

  const XLOpen = () => {
    setOpen1(true);
  };

  const handleCopy = (productId, productCode) => {
    if (productCode) {
      navigator.clipboard.writeText(productCode).then(() => {
        setCopiedStates((prev) => ({ ...prev, [productId]: true }));
        setTimeout(() => {
          setCopiedStates((prev) => ({ ...prev, [productId]: false }));
        }, 1000);
      }).catch((err) => {
        console.error("Failed to copy text: ", err);
      });
    }
  };

  const handleAddFlag = (product) => {
    setFlaggingProductId(product._id);
    setFlagError("");

    const currentFlagCount = productFlags[product._id] || product.productFlagCount || 0;

    dispatch(createProductFlag({ productId: product._id }))
      .unwrap()
      .then(() => {
        setProductFlags((prev) => ({
          ...prev,
          [product._id]: currentFlagCount + 1,
        }));

        if (currentFlagCount + 1 === 3) {
          setInspectionDueDialogOpen(true);
        }

        setFlaggingProductId(null);
      })
      .catch((error) => {
        console.error("Failed to flag product:", error);
        setFlagError(error.message || "Failed to flag product");
        setFlagErrorOpen(true);
        setFlaggingProductId(null);
      });
  };

  const groupedProducts = products.inuseProducts?.reduce((acc, product) => {
    const contactNumber = product?.Customer?.contact_number || "N/A";
    if (!acc[contactNumber]) {
      acc[contactNumber] = { contactNumber, products: [] };
    }
    acc[contactNumber].products.push(product);
    return acc;
  }, {}) || {};

  const groupedProductArray = Object.values(groupedProducts);

  const groupedNewProducts = products.newProducts?.reduce((acc, product) => {
    const wareHouseCode = product?.Warehouse?.wareHouseCode || "N/A";
    if (!acc[wareHouseCode]) {
      acc[wareHouseCode] = { wareHouseCode, products: [] };
    }
    acc[wareHouseCode].products.push(product);
    return acc;
  }, {}) || {};

  const groupedNewProductArray = Object.values(groupedNewProducts);

  let InUSEindexCounter = 1;
  let NewindexCounter = 1;

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
    {
      label: "Inspection Due",
      value: "inspectionDue",
      icon: FlagIcon,
      condition: "inspectionDue",
    },
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="bg-clip-border rounded-xl bg-white text-gray-700 border border-blue-gray-100 mt-6 sm:mt-8 lg:mt-9 shadow-sm">
        <Card className="h-full w-full">
          <CardHeader floated={false} shadow={false} className="rounded-none">
            <div className="mb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 md:gap-6 lg:gap-8 px-2 sm:px-4">
              <div>
                <Typography variant="h5" color="blue-gray" className="text-lg sm:text-xl md:text-2xl">
                  Product List
                </Typography>
                <Typography color="gray" variant="small" className="mt-1 font-normal text-xs sm:text-sm">
                  See information about all products
                </Typography>
              </div>
              <div className="flex shrink-0 gap-2 flex-col sm:flex-row">
                <Button onClick={XLOpen} className="flex items-center gap-2 w-full sm:w-auto h-max py-2 sm:py-3 text-xs sm:text-sm" size="sm">
                  <SquaresPlusIcon strokeWidth={2} className="h-4 w-4" /> Add Excel File
                </Button>
                <Button
                  onClick={() => {
                    setData(null);
                    setOpen(true);
                  }}
                  className="flex items-center gap-2 w-full sm:w-auto h-max py-2 sm:py-3 text-xs sm:text-sm"
                  size="sm"
                >
                  <SquaresPlusIcon strokeWidth={2} className="h-4 w-4" /> Add Product
                </Button>
              </div>
            </div>
          </CardHeader>
          <Tabs value="all" className="w-full pt-2">
            <div className="flex flex-col items-center justify-between gap-3 sm:gap-4 md:flex-row px-2 sm:px-4">
              <TabsHeader className="w-full sm:w-auto">
                {TABS.map(({ label, value, icon, condition }) => (
                  <Tab key={value} value={value} onClick={() => setActive(condition)} className="p-1 sm:p-2 text-xs sm:text-sm">
                    <div className="flex items-center gap-1 sm:gap-2 whitespace-nowrap">
                      {React.createElement(icon, { className: "w-3 h-3 sm:w-4 sm:h-4" })}
                      {label}
                    </div>
                  </Tab>
                ))}
              </TabsHeader>
              <div className="w-full sm:w-64 md:w-72 relative flex gap-2">
                <Input
                  label="Search"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  icon={searchValue ? <XMarkIcon onClick={searchClear} className="h-4 w-4 sm:h-5 sm:w-5 cursor-pointer" /> : null}
                  className="text-xs sm:text-sm"
                />
                <Button onClick={handleSearch} variant="gradient" className="px-2 sm:px-2.5" size="sm">
                  <MagnifyingGlassIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </div>
            </div>
          </Tabs>
          {loading ? (
            <div>
              <Loader />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-7 items-start p-4 border-t mt-5 pt-5 border-blue-gray-100">
              {/* NEW PRODUCTS */}
              {active === true && (
                <div className="border border-blue-gray-100 bg-[#f4f5f7] rounded-md">
                  <div className="border-b border-blue-gray-100 p-4 text-center text-blue-600 font-semibold">
                    NEW ({products.newProducts?.length || 0})
                  </div>
                  <div className="space-y-3 p-3 h-[60vh] sm:h-[70vh] lg:h-[74vh] overflow-y-auto scrollbar-custom-blue">
                    {groupedNewProductArray.length > 0 ? (
                      groupedNewProductArray.map(({ wareHouseCode, products }) => (
                        <Button
                          key={wareHouseCode}
                          variant="text"
                          color="blue"
                          className="bg-white p-2 rounded-md hover:cursor-pointer w-full text-start relative border-l-2 border-blue-600"
                        >
                          {products[0]?.Warehouse && (
                            <div className="m-1.5 p-2.5 rounded-lg bg-blue-50 text-xs text-gray-700 font-medium space-y-1">
                              <div className="flex justify-between">
                                <span className="text-gray-600">WareHouse Code:</span>
                                <span>{products[0]?.Warehouse?.wareHouseCode || "N/A"}</span>
                              </div>
                            </div>
                          )}
                          {products.map((product, index) => (
                            <div
                              key={product._id}
                              className={`flex group items-center justify-between p-2 ${index !== products.length - 1 ? "border-b border-gray-200" : ""}`}
                            >
                              <div
                                className="flex items-center"
                                onClick={() => {
                                  setData(product);
                                  setDetails(true);
                                }}
                              >
                                <div className="pe-2 py-2 border-e-2 border-gray-300 text-base">{NewindexCounter++}</div>
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
                                  <p className="pt-1 text-gray-600">{formatUTCDate(product?.updatedAt)}</p>
                                </div>
                              </div>
                              {active ? (
                                <Tooltip content="Delete">
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
                              ) : (
                                <Tooltip content="Restore">
                                  <IconButton
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      confirmRestore(product._id);
                                    }}
                                    color="blue"
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
                        </Button>
                      ))
                    ) : (
                      <div className="text-center text-gray-500">NO NEW PRODUCTS</div>
                    )}
                  </div>
                </div>
              )}
              {/* INUSE PRODUCTS */}
              {active === true && (
                <div className="border border-blue-gray-100 bg-[#f4f5f7] rounded-md">
                  <div className="border-b border-blue-gray-100 p-4 text-center text-green-600 font-semibold">
                    INUSE ({products.inuseProducts?.length || 0})
                  </div>
                  <div className="space-y-3 p-3 h-[60vh] sm:h-[70vh] lg:h-[74vh] overflow-y-auto scrollbar-custom-green">
                    {groupedProductArray.length > 0 ? (
                      groupedProductArray.map(({ contactNumber, products }) => (
                        <Button
                          key={contactNumber}
                          variant="text"
                          color="green"
                          className="bg-white p-2 rounded-md hover:cursor-pointer w-full text-start relative border-l-2 border-green-600"
                        >
                          {products.map((product, index) => (
                            <div
                              key={product._id}
                              className={`flex group items-center justify-between p-2 ${index !== products.length - 1 ? "border-b border-gray-200" : ""}`}
                            >
                              <div
                                className="flex items-center"
                                onClick={() => {
                                  setData(product);
                                  setDetails(true);
                                }}
                              >
                                <div className="pe-2 py-2 border-e-2 border-gray-300 text-base">{InUSEindexCounter++}</div>
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
                                  <p className="pt-1 text-gray-600">{formatUTCDate(product?.updatedAt)}</p>
                                </div>
                              </div>
                              {active ? (
                                <Tooltip content="Delete">
                                  <IconButton
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      confirmDelete(product._id);
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
                          {products[0]?.Customer && (
                            <div className="m-1.5 p-2.5 rounded-lg bg-green-50 text-xs text-gray-700 font-medium space-y-1">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Customer Code:</span>
                                <span>{products[0]?.Customer?.contact_number || "N/A"}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Name:</span>
                                <span>
                                  {products[0]?.Customer?.first_name || "N/A"} {products[0]?.Customer?.last_name || "N/A"}
                                </span>
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
              )}
              {/* EXHAUSTED PRODUCTS */}
              {(active === true || active === false) && (
                <div
                  className={`border border-blue-gray-100 bg-[#f4f5f7] rounded-md ${active === false ? "md:col-span-2 lg:col-span-3" : ""
                    }`}
                >
                  <div className="border-b border-blue-gray-100 p-4 text-center text-red-600 font-semibold">
                    {active === false ? "DELETED PRODUCTS" : "EXHAUSTED"} (
                    {products.exhaustedProducts?.length || 0})
                  </div>

                  <div className="space-y-3 p-3 h-[60vh] sm:h-[70vh] lg:h-[74vh] overflow-y-auto scrollbar-custom-red">
                    {products.exhaustedProducts?.length > 0 ? (
                      products.exhaustedProducts.map((product, index) => (
                        <Button
                          key={product._id}
                          variant="text"
                          color="red"
                          className="bg-white p-2 rounded-md group hover:cursor-pointer w-full text-start relative border-l-2 border-red-600"
                        >
                          <div
                            className="flex group items-center justify-between p-2"
                            onClick={() => {
                              setData(product);
                              setDetails(true);
                            }}
                          >
                            {/* Index */}
                            <div className="pe-2 py-2 border-e-2 border-gray-300 text-base">
                              {index + 1}
                            </div>

                            {/* Product Info */}
                            <div className="flex-1 ps-2">
                              <p className="font-semibold text-base text-black flex items-center gap-0.5">
                                {product.productCode}
                                <Tooltip
                                  content={copiedStates[product._id] ? "Copied!" : "Copy"}
                                >
                                  <IconButton
                                    variant="text"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleCopy(product._id, product.productCode);
                                    }}
                                    size="sm"
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
                              <p className="pt-1 text-gray-600">
                                {formatUTCDate(product?.updatedAt)}
                              </p>
                              {product?.productNotes && (
                                <p className="pt-2 text-sm text-gray-700">
                                  Note: {product?.productNotes}
                                </p>
                              )}
                            </div>

                            {/* Right Action */}
                            <div className="flex items-center gap-2">
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
                                    disabled={flaggingProductId === product._id}
                                  >
                                    {delLoading && deletingProductId === product._id ? (
                                      <ArrowPathIcon className="h-4 w-4 animate-spin" />
                                    ) : (
                                      <TrashIcon className="h-4 w-4" />
                                    )}
                                  </IconButton>
                                </Tooltip>
                              ) : (
                                <Tooltip content="Restore Product">
                                  <IconButton
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      confirmRestore(product._id);
                                    }}
                                    color="red"
                                    variant="text"
                                    className="hidden group-hover:block"
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
                          </div>

                          {/* Flagging Section (EXHAUSTED specific) */}
                          {active === true && (
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-3 p-3 rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow transition-all gap-3">
                              {/* Flagging Button */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAddFlag(product);
                                }}
                                className={`flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 transform w-full md:w-auto
                                ${flaggingProductId === product._id
                                    ? "bg-red-100 text-red-600 cursor-wait"
                                    : "bg-red-400 text-white hover:bg-red-500 hover:scale-105"
                                  }`}
                                disabled={
                                  flaggingProductId === product._id ||
                                  productFlags[product._id] >= 3 ||
                                  product.productFlagCount >= 3
                                }
                              >
                                {flaggingProductId === product._id ? (
                                  <ArrowPathIcon className="h-4 w-4 animate-spin" />
                                ) : (
                                  <FlagIcon className="h-4 w-4" />
                                )}
                                <span>
                                  {flaggingProductId === product._id ? "Flagging..." : "Flag"}
                                </span>
                              </button>

                              {/* Flags Counter */}
                              <div className="flex flex-col sm:flex-row items-center justify-between md:justify-end gap-2 w-full md:w-auto">
                                <span className="text-sm text-gray-600 font-medium">Flags:</span>
                                <div className="flex gap-1">
                                  {Array.from({
                                    length:
                                      productFlags[product._id] || product.productFlagCount || 0,
                                  }).map((_, i) => (
                                    <FlagIcon key={i} className="h-5 w-5 text-red-500" />
                                  ))}
                                </div>
                                <span
                                  className={`px-2 py-0.5 text-xs font-semibold rounded-full ${(productFlags[product._id] || product.productFlagCount || 0) >= 3
                                    ? "bg-red-100 text-red-600"
                                    : "bg-gray-100 text-gray-600"
                                    }`}
                                >
                                  {(productFlags[product._id] ||
                                    product.productFlagCount ||
                                    0) || 0}
                                  /3
                                </span>
                              </div>
                            </div>
                          )}

                          {/* Customer Info */}
                          {product?.Customer && (
                            <div className="m-1.5 p-2.5 rounded-lg bg-red-50 text-xs text-gray-700 font-medium grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                              <div className="flex justify-between sm:justify-start sm:gap-2">
                                <span className="text-gray-600">Customer Code:</span>
                                <span>{product?.Customer?.contact_number || "N/A"}</span>
                              </div>
                              <div className="flex justify-between sm:justify-start sm:gap-2">
                                <span className="text-gray-600">Name:</span>
                                <span>
                                  {product?.Customer?.first_name || "N/A"}{" "}
                                  {product?.Customer?.last_name || "N/A"}
                                </span>
                              </div>
                              <div className="flex justify-between sm:justify-start sm:gap-2">
                                <span className="text-gray-600">Email:</span>
                                <span>{product?.Customer?.email || "N/A"}</span>
                              </div>
                              <div className="flex justify-between sm:justify-start sm:gap-2">
                                <span className="text-gray-600">Number:</span>
                                <span>{product?.Customer?.mobile || "N/A"}</span>
                              </div>
                            </div>
                          )}

                        </Button>
                      ))
                    ) : (
                      <div className="text-center text-gray-500">
                        {active === false
                          ? "NO DELETED PRODUCTS"
                          : "NO EXHAUSTED PRODUCTS"}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* INSPECTION DUE PRODUCTS */}
              {active === "inspectionDue" && (
                <div className="border border-blue-gray-100 bg-[#f4f5f7] rounded-md md:col-span-2 lg:col-span-3">
                  <div className="border-b border-blue-gray-100 p-4 text-center text-orange-600 font-semibold">
                    INSPECTION DUE ({products.InspectionDueProducts?.length || 0})
                  </div>
                  <div className="space-y-3 p-3 h-[60vh] sm:h-[70vh] lg:h-[74vh] overflow-y-auto scrollbar-custom-orange">
                    {products.InspectionDueProducts?.length > 0 ? (
                      products.InspectionDueProducts.map((product, index) => (
                        <Button
                          variant="text"
                          key={product._id}
                          color="orange"
                          className="bg-white p-2 rounded-md group hover:cursor-pointer w-full text-start relative border-l-2 border-orange-600"
                          onClick={() => {
                            setData(product);
                            setDetails(true);
                          }}
                        >
                          <div className="flex items-start justify-between">
                            <div className="p-1.5 flex items-center">
                              <div className="pe-2 py-2 border-e-2 border-gray-300 text-base">{index + 1}</div>
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
                                      color="orange"
                                    >
                                      {copiedStates[product._id] ? (
                                        <CheckIcon className="h-4 w-4 text-green-600" />
                                      ) : (
                                        <ClipboardIcon className="h-3.5 w-3.5 text-gray-600" />
                                      )}
                                    </IconButton>
                                  </Tooltip>
                                </p>
                                <p className="pt-1 text-gray-600">{formatUTCDate(product?.updatedAt)}</p>
                                <div className="flex flex-col gap-2 mt-2">
                                  <div className="flex gap-1">
                                    {Array.from({ length: product.productFlagCount || 0 }).map((_, i) => (
                                      <FlagIcon key={i} className="h-5 w-5 text-red-500" />
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <Tooltip content="Restore Product">
                              <IconButton
                                onClick={(e) => {
                                  e.stopPropagation();
                                  confirmRestore(product._id);
                                }}
                                color="red"
                                variant="text"
                                className="hidden group-hover:block"
                              >
                                {delLoading && deletingProductId === product._id ? (
                                  <ArrowPathIcon className="h-4 w-4 animate-spin" />
                                ) : (
                                  <ArrowPathRoundedSquareIcon className="h-4 w-4" />
                                )}
                              </IconButton>
                            </Tooltip>
                          </div>
                        </Button>
                      ))
                    ) : (
                      <div className="text-center text-gray-500">NO INSPECTION DUE PRODUCTS</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
      <AddProduct open={open} setOpen={setOpen} data={data} setData={setData} />
      <AddXL open1={open1} setOpen1={setOpen1} active={active} />
      <ProductDetails details={details} setDetails={setDetails} handleEditProduct={handleEditProduct} data={data} setData={setData} />
      <Dialog size="xs" open={alertOpen} handler={() => { setAlertOpen(false); setError(""); }}>
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
          <Typography variant="small" className="text-gray-700 pt-3 relative">
            <Textarea variant="outlined" size="md" label="Note" onChange={(e) => setProductNotes(e.target.value)} error={error} />
            {error && <div className="text-red-500 text-[11px] absolute -bottom-3 right-0">{error}</div>}
          </Typography>
        </DialogBody>
        <DialogFooter className="flex justify-end gap-2">
          <Button variant="outlined" color="gray" onClick={() => { setAlertOpen(false); setError(""); }}>
            Cancel
          </Button>
          <Button color="red" onClick={handleDelete}>
            {delLoading && deletingProductId === productToDelete ? (
              <div className="px-[13px]">
                <ArrowPathIcon className="h-4 w-4 animate-spin" />
              </div>
            ) : (
              "Delete"
            )}
          </Button>
        </DialogFooter>
      </Dialog>
      <Dialog size="xs" open={restoreOpen} handler={() => setRestoreOpen(false)}>
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
          <Button variant="outlined" color="gray" onClick={() => setRestoreOpen(false)}>
            Cancel
          </Button>
          <Button color="red" onClick={handleRestore}>
            {delLoading && deletingProductId === productToRestore ? (
              <div className="px-[18px]">
                <ArrowPathIcon className="h-4 w-4 animate-spin" />
              </div>
            ) : (
              "Restore"
            )}
          </Button>
        </DialogFooter>
      </Dialog>
      <Dialog size="xs" open={flagErrorOpen} handler={() => setFlagErrorOpen(false)}>
        <DialogHeader className="flex items-center gap-2">
          <div className="bg-red-100 p-2 rounded-full">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M4.293 4.293a1 1 0 011.414 0l14 14a1 1 0 01-1.414 1.414l-14-14a1 1 0 010-1.414z"></path>
            </svg>
          </div>
          <Typography variant="h6" className="text-red-600 font-semibold">
            Flagging Error
          </Typography>
        </DialogHeader>
        <DialogBody>
          <Typography variant="small" className="text-gray-700">{flagError}</Typography>
        </DialogBody>
        <DialogFooter>
          <Button variant="outlined" color="gray" onClick={() => setFlagErrorOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </Dialog>
      <Dialog size="xs" open={restoreErrorOpen} handler={() => setRestoreErrorOpen(false)}>
        <DialogHeader className="flex items-center gap-2">
          <div className="bg-red-100 p-2 rounded-full">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M4.293 4.293a1 1 0 011.414 0l14 14a1 1 0 01-1.414 1.414l-14-14a1 1 0 010-1.414z"></path>
            </svg>
          </div>
          <Typography variant="h6" className="text-red-600 font-semibold">
            Restore Error
          </Typography>
        </DialogHeader>
        <DialogBody>
          <Typography variant="small" className="text-gray-700">{restoreError}</Typography>
        </DialogBody>
        <DialogFooter>
          <Button variant="outlined" color="gray" onClick={() => setRestoreErrorOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </Dialog>
      <Dialog size="xs" open={inspectionDueDialogOpen} handler={() => setInspectionDueDialogOpen(false)}>
        <DialogHeader className="flex items-center gap-2">
          <div className="bg-orange-100 p-2 rounded-full">
            <FlagIcon className="w-6 h-6 text-orange-600" />
          </div>
          <Typography variant="h6" className="text-orange-600 font-semibold">
            Product Moved to Inspection Due
          </Typography>
        </DialogHeader>
        <DialogBody>
          <Typography variant="small" className="text-gray-700">
            This product has been flagged three times and has been moved to the Inspection Due category.
          </Typography>
        </DialogBody>
        <DialogFooter>
          <Button variant="outlined" color="gray" onClick={() => setInspectionDueDialogOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default ProductDesign;