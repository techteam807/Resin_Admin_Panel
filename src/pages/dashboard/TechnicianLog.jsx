import React, { useState } from 'react'
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
    Popover,
    PopoverHandler,
    PopoverContent,
} from "@material-tailwind/react";
import Loader from '../Loader';
import { FunnelIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";


const TechnicianLog = () => {
    const TABLE_HEAD = ["Name", "Number", "Date", "Location", "Action"];

    const [date, setDate] = useState(null);

    // const handleSearch = () => {
    //     dispatch(getTechnicians({ page: 1, user_status: user_status, search: searchValue }));
    //             }

    //  const searchClear = () => {
    //     setSearchValue('')
    //     dispatch(getTechnicians({ page: 1, user_status: user_status }));
    //             }


    return (
        <div className="">
            <div className="bg-clip-border rounded-xl bg-white text-gray-700 border border-blue-gray-100 mt-9 shadow-sm">
                <Card className="h-full w-full">
                    <CardHeader floated={false} shadow={false} className="rounded-none">
                        <div className="mb-3 flex flex-row md:items-center justify-between md:gap-8">
                            <div>
                                <Typography variant="h5" color="blue-gray">
                                    TechnicianLog list
                                </Typography>
                                <Typography color="gray" variant="small" className="mt-1 font-normal">
                                    See information about all technician log
                                </Typography>
                            </div>
                            <div className="flex shrink-0 gap-2 flex-row">
                                {/* <Button variant="outlined" className="w-full sm:w-max" size="sm">
              view all
            </Button> */}
                                {/* <Button onClick={() => setOpen(true)} className="flex items-center gap-2 w-full h-max py-3 sm:w-max" size="sm">
              <SquaresPlusIcon strokeWidth={2} className="h-4 w-4" /> Add Product
            </Button> */}
                            </div>
                        </div>
                    </CardHeader>
                    <Tabs value="all" className="w-full pt-2">
                        <div className="flex flex-col items-center justify-between gap-4 md:flex-row px-4">
                            {/* {TABS.map(({ label, value, icon, condition }) => (
                // <Tab key={value} value={value} onClick={() => setActive(condition)}>
                //     <div className="flex items-center gap-2 whitespace-nowrap">
                //         {React.createElement(icon, { className: "w-4 h-4" })}
                //         {label}
                //     </div>
                // </Tab>
              ))} */}
                            <div className="flex items-center gap-2">
                                <Popover placement="bottom">
                                    <PopoverHandler>
                                        <Input
                                            label="Select a Date"
                                            onChange={() => null}
                                            value={date instanceof Date ? format(date, "PPP") : ""}
                                            className='bg-white '
                                        />
                                    </PopoverHandler>
                                    <PopoverContent>
                                        <DayPicker
                                            mode="single"
                                            selected={date instanceof Date ? date : undefined}
                                            onSelect={setDate}
                                            showOutsideDays
                                            className="border-0"
                                            classNames={{
                                                caption: "flex justify-center py-2 mb-4 relative items-center",
                                                caption_label: "text-sm font-medium text-gray-900",
                                                nav: "flex items-center",
                                                nav_button:
                                                    "h-6 w-6 bg-transparent hover:bg-blue-gray-50 p-1 rounded-md transition-colors duration-300",
                                                nav_button_previous: "absolute left-1.5",
                                                nav_button_next: "absolute right-1.5",
                                                table: "w-full border-collapse",
                                                head_row: "flex font-medium text-gray-900",
                                                head_cell: "m-0.5 w-9 font-normal text-sm",
                                                row: "flex w-full mt-2",
                                                cell: "text-gray-600 rounded-md h-9 w-9 text-center text-sm p-0 m-0.5 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-gray-900/20 [&:has([aria-selected].day-outside)]:text-white [&:has([aria-selected])]:bg-gray-900/50 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                                                day: "h-9 w-9 p-0 font-normal",
                                                day_range_end: "day-range-end",
                                                day_selected:
                                                    "rounded-md bg-white text-white hover:bg-white-900 hover:text-white focus:bg-gray-900 focus:text-white",
                                                day_today: "rounded-md bg-gray-200 text-gray-900",
                                                day_outside:
                                                    "day-outside text-gray-500 opacity-50 aria-selected:bg-gray-500 aria-selected:text-gray-900 aria-selected:bg-opacity-10",
                                                day_disabled: "text-gray-500 opacity-50",
                                                day_hidden: "invisible",
                                            }}
                                            components={{
                                                IconLeft: ({ ...props }) => (
                                                    <ChevronLeftIcon {...props} className="h-4 w-4 stroke-2" />
                                                ),
                                                IconRight: ({ ...props }) => (
                                                    <ChevronRightIcon {...props} className="h-4 w-4 stroke-2" />
                                                ),
                                            }}
                                        />
                                    </PopoverContent>
                                </Popover>
                                <Button variant="gradient" className="px-4 py-3 flex items-center gap-2 w-full h-full" size="sm">
                                    <FunnelIcon className="h-4 w-4 text-white" />
                                    <span className="text-white">Apply</span>
                                </Button>
                            </div>


                            <div className="w-full md:w-72 relative flex gap-2">
                                <Input
                                    label="Search"
                                // value={}
                                // onChange={(e) => setSearchValue(e.target.value)}
                                // icon=<XMarkIcon  className="h-5 w-5 cursor-pointer" />
                                />
                                <Button variant="gradient" className="px-2.5" size="sm">
                                    <MagnifyingGlassIcon className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    </Tabs>
                    {/* <div><Loader /></div> */}
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
                                        {/* {products?.map(
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
                                  {product?.productStatus}
                              </Typography>
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
                              <td className={classes}>
                                <Tooltip content="Edit Product">
                                    <IconButton  variant="text">
                                    <PencilIcon className="h-4 w-4" />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip content="Delete Product">
                                    <IconButton  variant="text">
                                        <TrashIcon className="h-4 w-4" />
                                    </IconButton>
                                </Tooltip>
                              </td>
                              <td className={classes}>
                                <Tooltip content="Restore Product">
                                    <IconButton variant="text">
                                      <ArrowPathRoundedSquareIcon className="h-4 w-4" />
                                    </IconButton>
                                </Tooltip>
                              </td>
                          </tr>
                          );
                      },
                      )} */}
                                    </tbody>
                                </table>
                            </div>
                        </CardBody>

                    </div>
                </Card>
            </div>
            {/* <AddProduct open={open} setOpen={setOpen} data={data} setData={setDate} /> */}
        </div>
    )
}

export default TechnicianLog
