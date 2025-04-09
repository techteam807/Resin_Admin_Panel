import { getAllProducts, getProductsLogList } from '@/feature/productLog/productLogSlice';
import { BellIcon, CurrencyDollarIcon, HomeIcon } from '@heroicons/react/24/solid'
import { Button, Card, CardBody, CardHeader, Typography, Input, Chip } from '@material-tailwind/react'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
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

const ProductLog = () => {
  const dispatch = useDispatch();
  const dropdownRef = useRef();
  const { productsLogList, productsData, productLoading } = useSelector((state) => state.productLog);
  // console.log("productsData", productsData)
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    dispatch(getProductsLogList());
    const { startDate, endDate } = getDefaultDateRange();
    setStartDate(startDate);
    setEndDate(endDate);
    dispatch(getAllProducts({startDate,endDate}))
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

  const filteredProducts = productsLogList.filter(product =>
    product.productCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (product) => {
    setSelectedProduct(product);
    setSearchTerm(product.productCode);
    setShowDropdown(false);
  };

  const handleSearch = () => {
  
    dispatch(getAllProducts({
      productId: selectedProduct?._id,
      startDate,
      endDate
    }));
  };
  
  
  const handleClear = () => {
    const { startDate: defaultStart, endDate: defaultEnd } = getDefaultDateRange();
    setSearchTerm('');
    setStartDate(defaultStart);
    setEndDate(defaultEnd);
    setSelectedProduct(null);
    setShowDropdown(false);
    dispatch(getAllProducts({ startDate: defaultStart, endDate: defaultEnd }));
  };
  

  return (
    <div>
      <div className="bg-clip-border rounded-xl bg-white text-gray-700 border border-blue-gray-100 mt-9 shadow-sm">
        <Card className="h-full w-full">
        <CardHeader floated={false} shadow={false} className="rounded-none pb-5 overflow-visible">
          <div className="flex md:flex-row flex-col md:items-center justify-between md:gap-8 gap-4">
            <div>
              <Typography variant="h5" color="blue-gray">
                Product Log
              </Typography>
              <Typography color="gray" variant="small" className="mt-1 font-normal">
                See information about product
              </Typography>
            </div>

            <div className="flex flex-wrap items-end gap-4">
              {/* Search input with dropdown */}
              <div className="relative w-48" ref={dropdownRef}>
                <Input
                  label="Search product code"
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
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map((product) => (
                        <li
                          key={product._id}
                          className="px-3 py-2 cursor-pointer hover:bg-blue-50"
                          onClick={() => handleSelect(product)}
                        >
                          {product.productCode}
                        </li>
                      ))
                    ) : (
                      <li className="px-3 py-2 text-gray-400">No results found</li>
                    )}
                  </ul>
                )}
              </div>

              {/* Date inputs */}
              <div className="w-48">
                <Input
                  type="date"
                  label="Start Date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div className="w-48">
                <Input
                  type="date"
                  label="End Date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>

              <Button variant='gradient' onClick={handleSearch} >
                Search
              </Button>
              <Button variant="outlined" onClick={handleClear}>
                Clear
              </Button>
            </div>
          </div>
        </CardHeader>

         {productLoading ? <div className=''><Loader /></div> :
          <CardBody className='border-t border-blue-gray-100'>
            <div className='md:px-10'>
              <ol className="relative border-s border-blue-gray-100 dark:border-gray-700 md:mt-5">
                {productsData.map((log, idx) => (
                  <li key={log._id} className="md:mb-10 mb-5 ms-8">
                    <span className="absolute flex items-center justify-center w-8 h-8 bg-[#212121] rounded-full -start-4 ring-8 ring-white">
                      {log.status === 'inuse' ? (
                        <CurrencyDollarIcon className="h-4 w-4 text-white" />
                      ) : log.status === 'new' ? (
                        <HomeIcon className="h-4 w-4 text-white" />
                      ) : (
                        <BellIcon className="h-4 w-4 text-white" />
                      )}
                    </span>

                    <div className="p-4 bg-white border border-blue-gray-100 rounded-lg shadow-xs dark:bg-gray-700 dark:border-gray-600">
                      <div className="items-center justify-between mb-3 sm:flex">
                        <time className="mb-1 text-xs font-semibold text-gray-600 sm:order-last sm:mb-0">
                          {new Date(log.timestamp).toLocaleString()}
                        </time>
                        <div className="text-sm font-normal text-gray-500 dark:text-gray-300">
                          <span className="font-medium">{log.user_name || log.userId?.user_name}</span>{' '}
                          updated status to{' '}
                          <span className="font-semibold text-blue-600">{log.status}</span>
                        </div>
                      </div>

                      {log.products?.length > 0 && (
                        <div className="text-sm text-gray-600 dark:text-gray-300 items-center flex flex-wrap gap-2">
                          <span className="font-medium">Product Code:</span>
                          {log.products.map((p) => (
                            <Chip
                              key={p._id}
                              className="w-max"
                              variant="ghost"
                              size="sm"
                              color="brown"
                              value={p.productCode}
                            />
                            
                          ))}
                        </div>
                      )}


                      {log.customerId && log.status === 'inuse' && (
                        <div className="mt-2 text-sm text-gray-600 dark:text-gray-300 space-y-1">
                          <div>
                            <span className="font-medium">Customer Name:</span>{' '}
                            {log.customerId.display_name || "N/A"}
                          </div>
                          <div>
                            <span className="font-medium">Contact Code:</span>{' '}
                            {log.customerId.contact_number || 'N/A'}
                          </div>
                          <div>
                            <span className="font-medium">Mobile:</span>{' '}
                            {log.customerId.mobile || 'N/A'}
                          </div>
                          <div>
                            <span className="font-medium">Email:</span>{' '}
                            {log.customerId.email || 'N/A'}
                          </div>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </CardBody>
          }
        </Card>
      </div>
    </div>
  );
};

export default ProductLog;
