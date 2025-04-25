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
import { getTechnicianDropDown, getTechnicianScoreLogs } from '@/feature/technician/technicianSlice';
import Loader from '../Loader';

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

const TechnicianScorrLog = () => {

      const dispatch = useDispatch();
      const dropdownRef = useRef();
      const { technicianScoreData, tecnicianLoading, technicianDrop } = useSelector((state) => state.technician);
      const [searchTerm, setSearchTerm] = useState('');
      const [showDropdown, setShowDropdown] = useState(false);
      const [selectedTechnician, setSelectedTechnician] = useState(null);
      const [copiedId, setCopiedId] = useState(null);
      const [startDate, setStartDate] = useState('');
      const [endDate, setEndDate] = useState('');

      useEffect(() => {
          dispatch(getTechnicianDropDown());
          const { startDate, endDate } = getDefaultDateRange();
          setStartDate(startDate);
          setEndDate(endDate);
          dispatch(getTechnicianScoreLogs({startDate, endDate}))
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
          dispatch(getTechnicianScoreLogs({
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
          dispatch(getTechnicianScoreLogs({ startDate: defaultStart, endDate: defaultEnd }));
      };

      const TABLE_HEAD = ["Index", "Technician", "Efficiency Score", "Total Replacements"];

  return (
    <div>
        <div className="bg-clip-border rounded-xl bg-white text-gray-700 border border-blue-gray-100 mt-9 shadow-sm">
        <Card className="h-full w-full">
            <CardHeader floated={false} shadow={false} className="rounded-none  overflow-visible">
                <div className="flex md:flex-row flex-col md:items-center justify-between md:gap-8 gap-4 mb-5">
                    <div>
                        <Typography variant="h5" color="blue-gray">
                            Technician Score Log
                        </Typography>
                        <Typography color="gray" variant="small" className="mt-1 font-normal">
                            See information about all Score log
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
            <CardBody className="border-t border-blue-gray-100 p-0">
                {tecnicianLoading ? (
                    <div className="flex justify-center items-center min-h-[200px]">
                    <Loader />
                    </div>
                ) : (
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
                      {technicianScoreData?.map((customer, index) => {
                          const isLast = index === technicianScoreData.length - 1;
                          const classes = isLast
                            ? "p-4"
                            : "p-4 border-b border-blue-gray-50";
           
                          return (
                              <tr key={index} className="hover:bg-gray-50">
                              {/* Index column */}
                              <td className={classes}>
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-normal ps-2"
                                >
                                  {index + 1}
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
                                      {customer?.technician}
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
                                    {customer?.averageEfficiencyScore}
                                  </Typography>
                                </div>
                              </td>
                              <td className={classes}>
                              <div className="w-max flex items-center gap-2">
                                <Chip
                                  variant="ghost"
                                  size="sm"
                                  value={customer.totalReplacements}
                                  color="brown"
                                />
                              </div>
                              </td>
                            </tr>
                          );
                        },
                      )}
                    </tbody>
                  </table>
                  </div>
                )}
                </CardBody>
            </div>
        </Card>
        </div>
    </div>
  )
}

export default TechnicianScorrLog
