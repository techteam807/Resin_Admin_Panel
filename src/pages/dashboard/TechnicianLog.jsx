import React, { useEffect, useRef, useState } from 'react'
import {
    Card,
    CardHeader,
    Input,
    Typography,
    Button,
    CardBody,
    IconButton,
    Tooltip,
    Chip,
} from "@material-tailwind/react";
import { BriefcaseIcon, CheckIcon, ClipboardIcon, ExclamationTriangleIcon, FolderPlusIcon, FunnelIcon } from '@heroicons/react/24/solid';
import { useDispatch, useSelector } from 'react-redux';
import { getAllProducts } from '@/feature/productLog/productLogSlice';
import { getTechnicianDropDown } from '@/feature/technician/technicianSlice';
import Loader from '../Loader';


const formatUTCDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Invalid Date";
  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const year = date.getUTCFullYear();
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
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


const TechnicianLog = () => {

    const dispatch = useDispatch();
    const dropdownRef = useRef();
    const { productsData, productLoading } = useSelector((state) => state.productLog);
    const { technicianDrop } = useSelector((state) => state.technician);
    const [searchTerm, setSearchTerm] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedTechnician, setSelectedTechnician] = useState(null);
    const [copiedId, setCopiedId] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    // console.log("productsData", productsData);
    
    

    useEffect(() => {
        dispatch(getTechnicianDropDown());
        const { startDate, endDate } = getDefaultDateRange();
        setStartDate(startDate);
        setEndDate(endDate);
        dispatch(getAllProducts({startDate, endDate}))
    }, []);

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

    const filteredTechnicians = technicianDrop.filter(technician =>
        technician.user_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelect = (product) => {
        setSelectedTechnician(product);
        setSearchTerm(product.user_name);
        setShowDropdown(false);
    };
          
    const handleSearch = () => {
        dispatch(getAllProducts({
        userId: selectedTechnician?._id,
        startDate,
        endDate,
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
        setSelectedTechnician(null);
        setShowDropdown(false);
        dispatch(getAllProducts({ startDate: defaultStart, endDate: defaultEnd }));
    };

    return (
        <div className="">
            <div className="bg-clip-border rounded-xl bg-white text-gray-700 border border-blue-gray-100 mt-9 shadow-sm">
                <Card className="h-full w-full">
                    <CardHeader floated={false} shadow={false} className="rounded-none  overflow-visible">
                        <div className="flex md:flex-row flex-col md:items-center justify-between md:gap-8 gap-4 mb-5">
                            <div>
                                <Typography variant="h5" color="blue-gray">
                                    Technician Log
                                </Typography>
                                <Typography color="gray" variant="small" className="mt-1 font-normal">
                                    See information about all technician log
                                </Typography>
                            </div>
                            <div className="flex md:flex-row flex-col flex-wrap lg:flex-nowrap items-end gap-3">
                                <div className="relative w-full" ref={dropdownRef}>
                                <Input
                                    label="Search Technician"
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
                                    {filteredTechnicians?.length > 0 ? (
                                        filteredTechnicians?.map((technician) => (
                                        <li
                                            key={technician?._id}
                                            className="px-3 py-2 cursor-pointer hover:bg-blue-50"
                                            onClick={() => handleSelect(technician)}
                                        >
                                            {technician?.user_name}
                                        </li>
                                        ))
                                    ) : (
                                        <li className="px-3 py-2 text-gray-400">No results found</li>
                                    )}
                                    </ul>
                                )}
                                </div>
                
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
                    <div>
                    <CardBody className="border-t border-blue-gray-100 md:p-6 p-4">
                        {productLoading ? (
                            <div className="flex justify-center items-center min-h-[200px]">
                            <Loader />
                            </div>
                        ) : (
                            <div className="md:py-4">
                                <div className="flex flex-col gap-6 md:px-5">
                                    {productsData.map((log, index) => {
                                    const iconClass =
                                        log.status === 'inuse'
                                        ? 'bg-green-500'
                                        : log.status === 'new'
                                        ? 'bg-blue-500'
                                        : 'bg-red-500';
                                    const Icon =
                                        log.status === 'inuse'
                                        ? BriefcaseIcon
                                        : log.status === 'new'
                                        ? FolderPlusIcon
                                        : ExclamationTriangleIcon;

                                    return (
                                        <div key={log._id} className="flex gap-4 relative">
                                        <div className="flex flex-col items-center">
                                        <div className={`flex items-center justify-center w-12 h-12 rounded-full ${iconClass} text-white shadow-md z-10`}>
                                            <Icon className="w-6 h-6" />
                                          </div>

                                            {index < productsData.length - 1 && (
                                            <div className="flex-1 w-px bg-gray-300 mt-2 rounded-full" />
                                            )}
                                        </div>
                                      
                                        <div className="flex-1 bg-white border border-gray-200 rounded-xl shadow p-4 hover:shadow-md transition-shadow duration-300">
                                            <p className="text-xs text-gray-400 mb-2">
                                             {formatUTCDate(log?.timestamp)}
                                            </p>
                                            <p className="text-sm text-gray-800">
                                            <span className="font-semibold">{log.user_name || log.userId?.user_name}</span> updated status to
                                            <span className={`ml-1 px-2 py-0.5 rounded-md text-white text-xs ${iconClass}`}>
                                                {log.status}
                                            </span>
                                            </p>

                                            {log.products?.length > 0 && (
                                            <div className="mt-3 flex flex-wrap gap-2">
                                                {log.products.map((p) => {
                                                const uniqueKey = `${log._id}-${p._id}`;
                                                return (
                                                    <div key={p._id} className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-lg shadow-sm">
                                                    <span className="text-xs ps-2 font-medium text-gray-700">{p.productCode}</span>
                                                    <Tooltip content={copiedId === uniqueKey ? 'Copied' : 'Copy'}>
                                                        <IconButton
                                                        variant="text"
                                                        size="sm"
                                                        onClick={() => handleCopy(uniqueKey, p.productCode)}
                                                        >
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

                                            {log.customerId && log.status === 'inuse' && (
                                            <div className="mt-3 text-xs text-gray-600 space-y-1 border-t pt-2">
                                                <p><span className="font-medium">Customer:</span>
                                                 {log.customerId.first_name || 'N/A'}{" "}
                                                 {log.customerId.last_name || 'N/A'}
                                                </p>
                                                <p><span className="font-medium">Customer Code:</span> {log.customerId.contact_number || 'N/A'}</p>
                                                <p><span className="font-medium">Mobile:</span> {log.customerId.mobile || 'N/A'}</p>
                                                <p><span className="font-medium">Email:</span> {log.customerId.email || 'N/A'}</p>
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
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default TechnicianLog
