import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Option,
  Select,
  Typography,
  Input 
} from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import { CheckCircleIcon, UserIcon, ArchiveBoxIcon, BuildingStorefrontIcon, ArrowPathIcon } from "@heroicons/react/24/solid";
import { getProductsLogList } from "@/feature/productLog/productLogSlice";
import { useDispatch, useSelector } from "react-redux";
import { getCustomersDropdown } from "@/feature/customer/customerSlice";
import { changeProductStatus } from "@/feature/superAdmin/superAdminSlice";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

const MasterAdmin = () => {
    const dispatch = useDispatch();
    const { productsLogList } = useSelector((state) => state.productLog);
    const { customersDropdown } = useSelector((state) => state.customer);
    const { loading } = useSelector((state) => state.superAdmin);
    const [product, setProduct] = useState("");
    const [status, setStatus] = useState("");
    const [customer, setCustomer] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const [customerSearchTerm, setCustomerSearchTerm] = useState("");
    const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
    

  const selectedProduct = productsLogList.find(p => p._id === product);

  const steps = [
    { label: "Product", icon: <ArchiveBoxIcon className="md:h-5 md:w-5 h-4 w-4" /> },
    { label: "Status", icon: <CheckCircleIcon className="md:h-5 md:w-5 h-4 w-4" /> },
    ...(status === "inuse"
      ? [{ label: "Customer", icon: <UserIcon className="md:h-5 md:w-5 h-4 w-4" /> }]
      : []),
    { label: "Submit", icon: <BuildingStorefrontIcon className="md:h-5 md:w-5 h-4 w-4" /> },
  ];


  const isComplete = (label) => {
    if (label === "Product") return !!product;
    if (label === "Status") return !!status;
    if (label === "Customer") return status !== "inuse" || !!customer;
    return false;
  };

  const handleStatusChange = (val) => {
    setStatus(val);
    if (val === "inuse") {
      dispatch(getCustomersDropdown());
    } else {
      setCustomer(""); 
    }
  };


   useEffect(() => {
      dispatch(getProductsLogList());
    }, [dispatch]);

    const handleSubmit = () => {
      const superAdminData = {
        productId: product,
        productStatus: status,
        ...(status === "inuse" && { customerId: customer }),
      };
    
      dispatch(changeProductStatus(superAdminData))
        .unwrap()
        .then(() => {
          setProduct("");
          setStatus("");
          setCustomer("");
          setSearchTerm("");
          setCustomerSearchTerm("");
          setShowDropdown(false);
          setShowCustomerDropdown(false);
        })
        .catch((error) => {
          console.error("Status change failed:", error);
        });
    };

    const filteredProducts = productsLogList.filter((item) =>
      item.productCode.toLowerCase().includes(searchTerm.toLowerCase())
    );
    

  return (
    <div className="">
      <Card className="bg-clip-border rounded-xl bg-white text-gray-700 border border-blue-gray-100 mt-9 shadow-sm">
        <CardHeader className="bg-white md:p-6 p-4 rounded-t-xl border-b border-blue-gray-100 mx-0 mt-0 shadow-none rounded-b-none">
          <div className="flex md:flex-row flex-row flex-wrap justify-evenly gap-3 items-center px-2">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center gap-2 group">
                <div
                  className={`rounded-full md:w-14 md:h-14 h-10 w-10 flex items-center justify-center ${isComplete(step.label)
                    ? "bg-[#333333] text-white"
                    : "bg-gray-200 text-gray-700"
                    }`}
                >
                  {step.icon}
                </div>
                <Typography
                  className={`text-sm font-semibold uppercase ${isComplete(step.label) ? "text-[#333333] font-semibold" : "text-gray-600"
                    }`}
                >
                  {step.label}
                </Typography>
              </div>
            ))}
          </div>
        </CardHeader>
        <CardBody className="pt-14 pb-10 space-y-8 px-4 sm:px-8 max-w-xl w-full mx-auto md:rounded-xl md:border md:my-5 border-blue-gray-100 md:shadow-lg">
          <div className="">
              <div className="relative">
                <Input
                  variant="static"
                  label="Search Product"
                  value={selectedProduct?.productCode || searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setProduct(""); 
                    setShowDropdown(true);
                  }}
                  onKeyDown={(e) => {
                    if ((e.key === "Backspace" || e.key === "Delete") && !searchTerm) {
                      setProduct("");
                      setSearchTerm("");
                    }
                  }}
                  onFocus={() => setShowDropdown(true)}
                  onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                  icon={<ChevronDownIcon className="h-3.5 w-3.5 text-gray-700" />}
                  crossOrigin={undefined}
                />
                  {showDropdown && filteredProducts.length > 0 && (
                    <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-md max-h-48 overflow-auto">
                      {filteredProducts.map((item) => (
                        <li
                          key={item._id}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                          onClick={() => {
                            setProduct(item._id);
                            setSearchTerm(item.productCode);
                            setShowDropdown(false);
                          }}
                          onMouseDown={() => {
                            setProduct(item._id);
                            setSearchTerm(item.productCode);
                            setShowDropdown(false);
                          }}
                          
                        >
                          {item.productCode}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
          </div>

          <div>
            <Select
              label="Status"
              value={status}
              variant="static"
              onChange={handleStatusChange}
              className="bg-white"
            >
              <Option value="new">NEW</Option>
              <Option value="inuse">INUSE</Option>
              <Option value="exhausted">EXHAUSTED</Option>
            </Select>
          </div>

          {status === "inuse" && (
            <div className="transition-all duration-300 ease-in-out">
            <div className="relative">
            <Input
              label="Search Customer"
              variant="static"
              value={
                customersDropdown.find((c) => c._id === customer)?.contact_number ||
                customerSearchTerm
              }
              onChange={(e) => {
                setCustomerSearchTerm(e.target.value);
                setCustomer(""); 
                setShowCustomerDropdown(true);
              }}
              onKeyDown={(e) => {
                if ((e.key === "Backspace" || e.key === "Delete") && !customerSearchTerm) {
                  setCustomer("");
                  setCustomerSearchTerm("");
                }
              }}
              onFocus={() => setShowCustomerDropdown(true)}
              onBlur={() => setTimeout(() => setShowCustomerDropdown(false), 150)}
              icon={<ChevronDownIcon className="h-3.5 w-3.5 text-gray-700" />}
              crossOrigin={undefined}
            />
          
            {showCustomerDropdown && customersDropdown.length > 0 && (
              <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-md max-h-48 overflow-auto">
                {customersDropdown
                  .filter((c) =>
                    c.contact_number
                      .toLowerCase()
                      .includes(customerSearchTerm.toLowerCase())
                  )
                  .map((c) => (
                    <li
                      key={c._id}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                      onClick={() => {
                        setCustomer(c._id);
                        setCustomerSearchTerm(c.contact_number);
                        setShowCustomerDropdown(false);
                      }}
                      onMouseDown={() => {
                        setCustomer(c._id);
                        setCustomerSearchTerm(c.contact_number);
                        setShowCustomerDropdown(false);
                      }}
                      
                    >
                      {c.contact_number}
                    </li>
                  ))}
              </ul>
            )}
          </div>
            </div>
          )}

          <div className="flex justify-center">
            <Button
              variant="gradient"
              disabled={!product || !status || (status === "inuse" && !customer)}
              className="px-8 py-3 shadow-md"
              onClick={handleSubmit}
              >
              {loading ? <div className='px-[7px]'><ArrowPathIcon className="h-4 w-4 animate-spin" /> </div> : "Submit"}
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default MasterAdmin;
