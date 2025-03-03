import React, { useEffect, useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { ArrowPathIcon, ArrowPathRoundedSquareIcon, PencilIcon, SquaresPlusIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/solid";
import {
  Card,
  CardHeader,
  Input,
  Typography,
  Button,
  CardBody,
  Chip,
  Tabs,
  TabsHeader,
  Tab,
  IconButton,
  Tooltip,
} from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";
import { deleteProduct, getProducts, restoreProduct } from "@/feature/product/productSlice";
import Loader from "../Loader";
import Pagination from "@/common/Pagination";
import AddProduct from "./AddProduct";

export function Product() {
  
const TABLE_HEAD = ["Connector", "Distributor", "Resin Type", "Product Code", "Size", "Action"];

const dispatch = useDispatch();
const { products, loading, pagination, delLoading } = useSelector((state) => state.product);
const [searchValue, setSearchValue] = useState("");
const [active, setActive] = useState(true);
const [open, setOpen] = useState(false);
const [data, setDate] = useState(null);
const [deletingProductId, setDeletingProductId] = useState(null);

useEffect(() => {
  dispatch(getProducts({ page: 1, active: active }));
}, [dispatch, active]);

const handleSearch = () => {
    dispatch(getProducts({ page: 1, active: active, search: searchValue }));
  }

  const searchClear = () => {
    setSearchValue('')
    dispatch(getProducts({ page: 1, active: active }));
  }

  const handlePaginationChange = (page) => {
    dispatch(getProducts({ page, active: active, search: searchValue }));
  };

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

  const handleEdit = (product) => {
    setDate(product)
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
    <>
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
            {/* <Button variant="outlined" className="w-full sm:w-max" size="sm">
              view all
            </Button> */}
            <Button onClick={() => setOpen(true)} className="flex items-center gap-2 w-full h-max py-3 sm:w-max" size="sm">
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
            <div>
            <CardBody className="px-0">
              <div className="overflow-x-auto">
                  <table className="mt-0 w-full min-w-max table-auto text-left">
                  <thead>
                      <tr>
                      {TABLE_HEAD.map((head) => (
                          <th
                          key={head}
                          className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                          >
                          <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal leading-none opacity-70"
                          >
                              {head}
                          </Typography>
                          </th>
                      ))}
                      </tr>
                  </thead>
                  <tbody>
                      {products?.map(
                      (product, index) => {
                          const isLast = index === products?.length - 1;
                          const classes = isLast
                          ? "p-4"
                          : "p-4 border-b border-blue-gray-50";
          
                          return (
                          <tr key={index} className="hover:bg-gray-50">
                              <td className={classes}>
                              <div className="flex items-center gap-3">
                                  <div className="flex flex-col">
                                  <Typography
                                      variant="small"
                                      color="blue-gray"
                                      className="font-normal"
                                  >
                                      {product?.connectorType}
                                  </Typography>
                                  </div>
                              </div>
                              </td>
                              <td className={classes}>
                              <div className="flex flex-col">
                                  <Typography
                                      variant="small"
                                      color="blue-gray"
                                      className="font-normal"
                                  >
                                      {product?.distributorType}
                                  </Typography>
                                  </div>
                              </td>
                              <td className={classes}>
                              <div className="flex flex-col">
                                  <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-normal"
                                  >
                                  {product?.resinType}
                                  </Typography>
                                  <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-normal opacity-70"
                                  >
                                  {/* {org} */}
                                  </Typography>
                              </div>
                              </td>
                              <td className={classes}>
                              <div className="w-max">
                                  <Chip
                                  variant="ghost"
                                  size="sm"
                                  value={product?.productCode}
                                  color='brown'
                                  />
                              </div>
                              </td>
                              <td className={classes}>
                              <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-normal"
                              >
                                  {product?.size}
                              </Typography>
                              </td>
                              {active === true ? 
                              <td className={classes}>
                                <Tooltip content="Edit Product">
                                    <IconButton onClick={() => handleEdit(product)} variant="text">
                                    <PencilIcon className="h-4 w-4" />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip content="Delete Product">
                                    <IconButton onClick={() => handleDelete(product?._id)} variant="text">
                                      {delLoading && deletingProductId === product?._id ? 
                                        <ArrowPathIcon className="h-4 w-4 animate-spin" /> 
                                      :
                                        <TrashIcon className="h-4 w-4" />
                                      }
                                    </IconButton>
                                </Tooltip>
                              </td>
                              :
                              <td className={classes}>
                                <Tooltip content="Restore Product">
                                    <IconButton onClick={() => handleRestore(product?._id)} variant="text">
                                    {delLoading && deletingProductId === product?._id ? 
                                      <ArrowPathIcon className="h-4 w-4 animate-spin" /> 
                                      :
                                      <ArrowPathRoundedSquareIcon className="h-4 w-4" />
                                    }
                                    </IconButton>
                                </Tooltip>
                              </td>
                              }
                          </tr>
                          );
                      },
                      )}
                  </tbody>
                  </table>
                  </div>
              </CardBody>
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onChange={handlePaginationChange}
              />
              </div>
            }
      </Card>
    </div>
    <AddProduct open={open} setOpen={setOpen} data={data} setData={setDate} />
   </div>
    </>
  );
}

export default Product;
