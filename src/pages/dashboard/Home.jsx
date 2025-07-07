import React, { useEffect, useState } from 'react'
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { ArrowPathIcon, PencilIcon, XMarkIcon, ClipboardIcon, CheckIcon, FlagIcon, EyeIcon } from "@heroicons/react/24/solid";
import {
  Card,
  CardHeader,
  Input,
  Typography,
  Button,
  CardBody,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";
import { getCustomers, refreshcustomers, sendMissedDelivery } from '@/feature/customer/customerSlice';
import Loader from '../Loader';
import Pagination from '@/common/Pagination';
import CustomerDetails from './CustomerDetails';

function Home() {
  const dispatch = useDispatch();
  const [searchValue, setSearchValue] = useState("");
  console.log("serch:",searchValue);
  
  const { customers, loading, pagination, sendLoading } = useSelector((state) => state.customer);
  console.log("customers", customers)
  console.log("pagination", pagination)
  const [copiedCustomerId, setCopiedCustomerId] = useState(null);
  const [open, setOpen] = useState(false);
  const [customerId, setCustomerId] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [statusValue, setStatusValue] = useState("");
  const [dayValue, setDayValue] = useState("");


  useEffect(() => {
    if (statusValue === 'active' || statusValue === 'inactive') {
      const isSubscription = statusValue === 'inactive' ? false : true;
      dispatch(getCustomers({ page: 1, isSubscription, Day: dayValue }));
    } else {
      // Optional: if "no status" selected, get all without filtering
      dispatch(getCustomers({ page: 1, Day: dayValue }));
    }
  }, [dispatch, statusValue, dayValue]);


  const handleSearch = () => {
    const payload = { page: 1, search: searchValue, Day: dayValue, };
    dispatch(getCustomers(payload)); // No isSubscription here
  };


  const handleRefresh = () => {
    dispatch(refreshcustomers()).then((action) => {
      if (refreshcustomers.fulfilled.match(action)) {
        dispatch(getCustomers({ page: 1, Day: dayValue }));
      }
    });
  };

  const sendMissDelivery = () => {
    dispatch(sendMissedDelivery({ customer_id: customerId }))
      .then(() => {
        setCustomerId(null);
        setOpen(false);
      });
  }

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
    const payload = { page, Day: dayValue };

    if (searchValue) {
      payload.search = searchValue;
    } else if (statusValue === 'active' || statusValue === 'inactive') {
      payload.isSubscription = statusValue === 'inactive' ? false : true;
    }

    dispatch(getCustomers(payload));
  };


  const TABLE_HEAD = ["Index", "Customer", "Number / Email", "Barcode", "Replacement Day", "Missed Delivery", "No. of Cartridge", "Action"];

  return (
    <div className="">
      {!selectedCustomer ? (
        <div className="bg-clip-border rounded-xl bg-white text-gray-700 border border-blue-gray-100 mt-9 shadow-sm">
          <Card className="h-full w-full">
            <CardHeader floated={false} shadow={false} className="rounded-none">
              <div className="flex md:flex-row flex-col md:items-center justify-between md:gap-8 gap-4">
                <div>
                  <Typography variant="h5" color="blue-gray">
                    Customer list
                  </Typography>
                  <Typography color="gray" variant='small' className="mt-1 font-normal">
                    See information about all <span className='font-semibold'>{pagination?.totalData || 0} </span> customers
                  </Typography>
                </div>
                <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                  <select
                    className="border border-gray-500 py-1.5 px-4 rounded-md"
                    value={statusValue}
                    onChange={(e) => {
                      const selectedStatus = e.target.value;
                      setStatusValue(selectedStatus); // triggers useEffect
                    }}
                  >
                    <option value="">All</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  <select
                    className="border border-gray-500 py-1.5 px-4 rounded-md"
                    value={dayValue}
                    onChange={(e) => {
                      const selectedDay = e.target.value;
                      setDayValue(selectedDay); // triggers useEffect
                    }}
                  >
                    <option value="">All Day</option>
                    <option value="Sunday">Sunday</option>
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                  </select>
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
            {loading ? <div className=''><Loader /></div> :
              <div>
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

                          const currentPage = pagination?.currentPage || 1;
                          const perPage = pagination?.perPage || 10;
                          const globalIndex = (currentPage - 1) * perPage + index + 1;


                          return (
                            // <tr key={index} className="hover:bg-gray-50">
                            <tr key={index} className="hover:bg-gray-50">
                              {/* Index column */}
                              <td className={classes}>
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-normal ps-2"
                                >
                                  {globalIndex}
                                </Typography>
                              </td>
                              <td className={classes}>
                                <div className="flex items-center gap-3">

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
                                {customer.cf_replacement_day}
                              </td>
                              <td className={classes}>
                                <Tooltip content="Missed Delivery">
                                  <IconButton size='sm' variant="outlined" color='red' onClick={() => { setOpen(true); setCustomerId(customer?._id) }}>
                                    <FlagIcon className="h-4 w-4" />
                                  </IconButton>
                                </Tooltip>
                              </td>
                              <td className={classes}>
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-normal text-center"
                                >
                                  {customer?.cf_cartridge_qty || "0"}
                                </Typography>
                              </td>
                              <td className='text-center'>
                                <Typography
                                  className='cursor-pointer'
                                  onClick={() => setSelectedCustomer(customer)}>
                                  <EyeIcon className='h-5 mx-auto ' />
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
                <Dialog size='xs' open={open} handler={() => { setOpen(false); setCustomerId(null) }}>
                  <DialogHeader className="flex items-center gap-2">
                    <div className="bg-red-100 p-2 rounded-full">
                      <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M4.293 4.293a1 1 0 011.414 0l14 14a1 1 0 01-1.414 1.414l-14-14a1 1 0 010-1.414z"></path>
                      </svg>
                    </div>
                    <Typography variant="h6" className="text-red-600 font-semibold">
                      Send Missed Delivery
                    </Typography>
                  </DialogHeader>
                  <DialogBody>
                    <Typography variant="small" className="text-gray-700">
                      Are you sure you want to send missed delivery notification? This action cannot be undone.
                    </Typography>
                  </DialogBody>
                  <DialogFooter className="flex justify-end gap-2">
                    <Button variant="outlined" color="gray" onClick={() => { setOpen(false); setCustomerId(null) }}>Cancel</Button>
                    <Button color="red" onClick={sendMissDelivery}>
                      {sendLoading ? (
                        <div className='px-[8px]'><ArrowPathIcon className="h-4 w-4 animate-spin" /></div>
                      ) : (
                        "Send"
                      )}
                    </Button>
                  </DialogFooter>
                </Dialog>
                <Pagination
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  onChange={handlePaginationChange}
                />
              </div>
            }
          </Card>
        </div>
      ) : (
        <div>
          <CustomerDetails
            customer={selectedCustomer}
            onBack={() => setSelectedCustomer(null)} />
        </div>
      )}
    </div>
  )
}

export default Home;