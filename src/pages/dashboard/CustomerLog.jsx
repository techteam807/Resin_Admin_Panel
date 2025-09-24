import { getCustomersDropdown } from '@/feature/customer/customerSlice';
import { getAllProducts } from '@/feature/productLog/productLogSlice';
import {
    BriefcaseIcon,
    CheckIcon,
    ClipboardIcon,
    FunnelIcon,
    UserIcon
} from '@heroicons/react/24/solid';
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Dialog,
    DialogHeader,
    DialogBody,
    IconButton,
    Input,
    Tooltip,
    Typography
} from '@material-tailwind/react';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../Loader';

const formatUTCDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date";

    // Convert to IST (UTC + 5:30)
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istDate = new Date(date.getTime() + istOffset);

    const day = String(istDate.getUTCDate()).padStart(2, '0');
    const month = String(istDate.getUTCMonth() + 1).padStart(2, '0');
    const year = istDate.getUTCFullYear();

    let hours = istDate.getUTCHours();
    const minutes = String(istDate.getUTCMinutes()).padStart(2, '0');
    const seconds = String(istDate.getUTCSeconds()).padStart(2, '0');

    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds} ${ampm}`;
};

const getDefaultDateRange = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const start = new Date(currentYear, currentMonth, 1);
    const end = new Date(currentYear, currentMonth + 1, 0);

    return {
        startDate: start.toLocaleDateString('en-CA'),
        endDate: end.toLocaleDateString('en-CA'),
    };
};

const CustomerLog = () => {
    const dispatch = useDispatch();
    const dropdownRef = useRef();
    const { productsData, productLoading } = useSelector((state) => state.productLog);
    console.log("productsData", productsData)
    const { customersDropdown } = useSelector((state) => state.customer);

    const [searchTerm, setSearchTerm] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [copiedId, setCopiedId] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [openImage, setOpenImage] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const handleOpenImage = (imgUrl) => {
        setSelectedImage(imgUrl);
        setOpenImage(true);
    };

    const handleCloseImage = () => {
        setSelectedImage(null);
        setOpenImage(false);
    };

    useEffect(() => {
        dispatch(getCustomersDropdown());
        const { startDate, endDate } = getDefaultDateRange();
        setStartDate(startDate);
        setEndDate(endDate);
        dispatch(getAllProducts({ startDate, endDate, status: "inuse" }))
    }, [dispatch]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

    const filteredCustomers = customersDropdown.filter(customer =>
        customer.contact_number.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelect = (product) => {
        setSelectedCustomer(product);
        setSearchTerm(product.contact_number);
        setShowDropdown(false);
    };

    const handleSearch = () => {
        dispatch(getAllProducts({
            customerId: selectedCustomer?._id,
            startDate,
            endDate,
            status: "inuse"
        }));
    };

    const handleCopy = (key, value) => {
        navigator.clipboard.writeText(value);
        setCopiedId(key);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleClear = () => {
        const { startDate: defaultStart, endDate: defaultEnd } = getDefaultDateRange();
        setSearchTerm('');
        setStartDate(defaultStart);
        setEndDate(defaultEnd);
        setSelectedCustomer(null);
        setShowDropdown(false);
        dispatch(getAllProducts({ startDate: defaultStart, endDate: defaultEnd, status: "inuse" }));
    };

    return (
        <div>
            <div className="bg-clip-border rounded-xl bg-white text-gray-700 border border-blue-gray-100 mt-9 shadow-sm">
                <Card className="h-full w-full">
                    <CardHeader floated={false} shadow={false} className="rounded-none overflow-visible">
                        <div className="flex md:flex-row flex-col md:items-center justify-between md:gap-8 gap-4 mb-5">
                            <div>
                                <Typography variant="h5" color="blue-gray">
                                    Customer Log
                                </Typography>
                                <Typography color="gray" variant="small" className="mt-1 font-normal">
                                    See information about all customer log
                                </Typography>
                            </div>
                            <div className="flex md:flex-row flex-col flex-wrap lg:flex-nowrap items-end gap-3">
                                {/* Search input with dropdown */}
                                <div className="relative w-full" ref={dropdownRef}>
                                    <Input
                                        label="Search Customer"
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => {
                                            setSearchTerm(e.target.value);
                                            setShowDropdown(true);
                                        }}
                                        onFocus={() => setShowDropdown(true)}
                                        crossOrigin=""
                                    />
                                    {showDropdown && (
                                        <ul className="absolute z-50 w-full mt-1 bg-white border border-blue-gray-100 rounded-md shadow-md max-h-60 overflow-auto">
                                            {filteredCustomers?.length > 0 ? (
                                                filteredCustomers?.map((customer) => (
                                                    <li
                                                        key={customer?._id}
                                                        className="px-3 py-2 cursor-pointer hover:bg-blue-50"
                                                        onClick={() => handleSelect(customer)}
                                                    >
                                                        {customer?.contact_number}
                                                    </li>
                                                ))
                                            ) : (
                                                <li className="px-3 py-2 text-gray-400">No results found</li>
                                            )}
                                        </ul>
                                    )}
                                </div>

                                {/* Date inputs */}
                                <div className="w-full">
                                    <Input
                                        type="date"
                                        label="Start Date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                    />
                                </div>

                                <div className="w-full">
                                    <Input
                                        type="date"
                                        label="End Date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                    />
                                </div>
                                <div className='flex items-center gap-3'>
                                    <Button variant="gradient" className="px-4 py-3 flex items-center gap-2" onClick={handleSearch}>
                                        <FunnelIcon className="h-4 w-4 text-white" />
                                        <span className="text-white">Apply</span>
                                    </Button>
                                    <Button variant="outlined" onClick={handleClear}>
                                        Clear
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardBody className="border-t border-blue-gray-100 md:p-6 p-4">
                        {productLoading ? (
                            <div className="flex justify-center items-center min-h-[200px]">
                                <Loader />
                            </div>
                        ) : (
                            <div className="md:py-4">
                                <div className="flex flex-col gap-6 md:px-5">
                                    {productsData.map((log, index) => {
                                        const iconClass = 'bg-green-500';
                                        const Icon = BriefcaseIcon;

                                        return (
                                            <div key={log._id} className="flex gap-4 relative">
                                                {/* Left icon and line */}
                                                <div className="flex flex-col items-center">
                                                    <div className={`flex items-center justify-center w-12 h-12 rounded-full ${iconClass} text-white shadow-md z-10`}>
                                                        <Icon className="w-6 h-6" />
                                                    </div>
                                                    {index < productsData.length - 1 && (
                                                        <div className="flex-1 w-px bg-gray-300 mt-2 rounded-full" />
                                                    )}
                                                </div>

                                                {/* Main card */}
                                                <div className="flex-1 bg-white border border-gray-200 rounded-xl shadow p-4 hover:shadow-md transition-shadow duration-300">
                                                    <p className="text-xs text-gray-400 mb-2">
                                                        {formatUTCDate(log?.timestamp)}
                                                    </p>

                                                    {log.customerId && (
                                                        <div className="mb-3 text-xs text-gray-800 space-y-1 border-b pb-3 rounded-md bg-green-50 border-green-300 px-3 py-2 shadow-sm flex justify-between items-start">
                                                            <div className="space-y-1">
                                                                <div className="flex items-center gap-1 text-base pb-1 font-semibold text-green-500">
                                                                    <UserIcon className="h-4 w-4" />
                                                                    Customer Info
                                                                </div>
                                                                <p className='text-sm'>
                                                                    <span className="font-medium">Customer:</span> {log.customerId.first_name || 'N/A'}{" "} {log.customerId.last_name || 'N/A'}
                                                                </p>
                                                                <div className="flex items-center gap-2">
                                                                    <span className="font-medium text-sm">Customer Code:</span>
                                                                    <span className="text-xs font-medium text-gray-700 flex items-center gap-1 bg-white px-2 py-1 rounded-md border border-green-300 shadow-sm">
                                                                        {log.customerId.contact_number || 'N/A'}
                                                                    </span>
                                                                    {log.customerId.contact_number && (
                                                                        <Tooltip content={copiedId === log._id ? 'Copied' : 'Copy'}>
                                                                            <IconButton
                                                                                variant="text"
                                                                                size="sm"
                                                                                onClick={() => handleCopy(log._id, log.customerId.contact_number)}
                                                                            >
                                                                                {copiedId === log._id ? (
                                                                                    <CheckIcon className="h-4 w-4 text-green-600" />
                                                                                ) : (
                                                                                    <ClipboardIcon className="h-4 w-4 text-gray-600" />
                                                                                )}
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                    )}
                                                                </div>
                                                                <p className='text-sm'><span className="font-medium">Mobile:</span> {log.customerId.mobile || 'N/A'}</p>
                                                                <p className='text-sm'><span className="font-medium">Email:</span> {log.customerId.email || 'N/A'}</p>
                                                            </div>

                                                            {/* Thumbnail on the right */}
                                                            {log.fiterImgUrl && (
                                                                <div className="ml-4 flex-shrink-0">
                                                                    <img
                                                                        src={log.fiterImgUrl}
                                                                        alt="Customer Thumbnail"
                                                                        className="w-32 h-32 object-cover rounded-md cursor-pointer border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                                                                        onClick={() => handleOpenImage(log.fiterImgUrl)}
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}

                                                    <p className="text-sm text-gray-800">
                                                        <span className="font-semibold">
                                                            {log.user_name || log.userId?.user_name}
                                                        </span>{' '}
                                                        updated status to
                                                        <span className={`ml-1 px-2 py-0.5 rounded-md text-white text-xs ${iconClass}`}>
                                                            inuse
                                                        </span>
                                                    </p>

                                                    {log.products?.length > 0 && (
                                                        <div className="mt-3 flex flex-wrap gap-2">
                                                            {log.products.map((p) => {
                                                                const uniqueKey = `${log._id}-${p._id}`;
                                                                return (
                                                                    <div key={p._id} className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-lg shadow-sm">
                                                                        <span className="text-xs ps-2 font-medium text-gray-700">
                                                                            {p.productCode}
                                                                        </span>
                                                                        <Tooltip content={copiedId === uniqueKey ? 'Copied' : 'Copy'}>
                                                                            <IconButton variant="text" size="sm" onClick={() => handleCopy(uniqueKey, p.productCode)}>
                                                                                {copiedId === uniqueKey ? (
                                                                                    <CheckIcon className="h-4 w-4 text-green-600" />
                                                                                ) : (
                                                                                    <ClipboardIcon className="h-4 w-4 text-gray-600" />
                                                                                )}
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </CardBody>
                </Card>
            </div>

            {/* Image Preview Modal */}
            <Dialog open={openImage} handler={handleCloseImage} size="lg">
                <DialogHeader className="flex justify-between items-center">
                    <span>Customer Image</span>
                    <IconButton
                        variant="text"
                        size="sm"
                        onClick={handleCloseImage}
                        className="rounded-full hover:bg-gray-100"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-gray-700"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </IconButton>
                </DialogHeader>

                <DialogBody className="flex justify-center">
                    {selectedImage ? (
                        <img
                            src={selectedImage}
                            alt="Customer"
                            className="max-h-[70vh] rounded-lg object-contain"
                        />
                    ) : (
                        <p>No image available</p>
                    )}
                </DialogBody>
            </Dialog>
        </div>
    );
}

export default CustomerLog;
