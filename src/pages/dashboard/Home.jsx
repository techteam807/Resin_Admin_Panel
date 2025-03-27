import React, { useEffect, useState } from 'react'
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { ArrowPathIcon, PencilIcon, XMarkIcon, ClipboardIcon, CheckIcon } from "@heroicons/react/24/solid";
import {
  Card,
  CardHeader,
  Input,
  Typography,
  Button,
  CardBody,
  Chip,
  CardFooter,
  Avatar,
  IconButton,
  Tooltip,
} from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";
import { getCustomers, refreshcustomers } from '@/feature/customer/customerSlice';
import Loader from '../Loader';
import Pagination from '@/common/Pagination';

function Home() {
  const dispatch = useDispatch();
  const [searchValue, setSearchValue] = useState("");
  const { customers, loading, pagination } = useSelector((state) => state.customer);
  const [copiedCustomerId, setCopiedCustomerId] = useState(null);
  

  useEffect(() => {
    dispatch(getCustomers({ page: 1 }));
  }, [dispatch]);

  const handleSearch = () => {
    dispatch(getCustomers({ page: 1, search: searchValue }));
  }

  const handleRefresh = () => {
    dispatch(refreshcustomers()).then((action) => {
      if (refreshcustomers.fulfilled.match(action)) {
        dispatch(getCustomers({ page: 1 }));
      }
    });
  };  

  const handleCopy = (customerId, contactNumber) => {
    if (contactNumber) {
      navigator.clipboard.writeText(contactNumber).then(() => {
        setCopiedCustomerId(customerId);
        setTimeout(() => {
          setCopiedCustomerId(null);
        }, 1000);
      }).catch(err => {
        console.error('Failed to copy text: ', err);
      });
    }
  };

  const searchClear = () => {
    setSearchValue('')
    dispatch(getCustomers({ page: 1 }));
  }

  const handlePaginationChange = (page) => {
    dispatch(getCustomers({ page, search: searchValue }));
  };

  const TABLE_HEAD = ["Customer", "Number / Email", "Barcode", "GST Type"];

  return (
    <div className="">
    {loading ? <div className='flex items-center justify-center h-[calc(100vh-100px)] w-full'><Loader /></div> :
    <div className="bg-clip-border rounded-xl bg-white text-gray-700 border border-blue-gray-100 mt-9 shadow-sm">
      <Card className="h-full w-full">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="flex md:flex-row flex-col md:items-center justify-between md:gap-8 gap-4">
          <div>
            <Typography variant="h5" color="blue-gray">
              Customer list
            </Typography>
            <Typography color="gray" variant='small' className="mt-1 font-normal">
              See information about all customers
            </Typography>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <Button onClick={handleRefresh} className="flex items-center gap-3 whitespace-nowrap" size="sm" variant='gradient'>
              <ArrowPathIcon strokeWidth={2} className="h-4 w-4" /> Refresh Customer
            </Button>
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
        </div>
      </CardHeader>
      <CardBody className="px-0">
      <div className="overflow-x-auto">
        <table className="w-full min-w-max table-auto text-left">
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
            {customers?.map((customer, index) => {
                const isLast = index === customers.length - 1;
                const classes = isLast
                  ? "p-4"
                  : "p-4 border-b border-blue-gray-50";
                const isCopied = copiedCustomerId === customer._id;
 
                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className={classes}>
                      <div className="flex items-center gap-3">
                        {/* <Avatar src={'https://via.placeholder.com/40'} alt={customer?.customer_name} size="sm" /> */}
                        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 font-medium">
                          {customer?.first_name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {customer?.customer_name}
                          </Typography>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal opacity-70"
                          >
                            {customer?.first_name} {customer?.last_name}
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
                          {customer?.mobile}
                        </Typography>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal opacity-70"
                        >
                          {customer?.email}
                        </Typography>
                      </div>
                    </td>
                    <td className={classes}>
                    <div className="w-max flex items-center gap-2">
                      <Chip
                        variant="ghost"
                        size="sm"
                        value={customer.contact_number}
                        color="brown"
                      />
                      <Tooltip content={isCopied ? "Copied!" : "Copy"}>
                        <IconButton
                          variant="text"
                          onClick={() => handleCopy(customer._id, customer.contact_number)}
                          size="sm"
                        >
                          {isCopied ? (
                            <CheckIcon className="h-4 w-4 text-green-600" />
                          ) : (
                            <ClipboardIcon className="h-4 w-4 text-gray-600" />
                          )}
                        </IconButton>
                      </Tooltip>
                    </div>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                        >
                       {customer.gst_treatment}
                      </Typography>
                    </td>
                    {/* <td className={classes}>
                      <Tooltip content="Edit Customer">
                        <IconButton variant="text">
                          <PencilIcon className="h-4 w-4" />
                        </IconButton>
                      </Tooltip>
                    </td> */}
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
    </Card>
    </div>
    }
   </div>
  )
}

export default Home;