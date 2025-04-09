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
    { label: "Product", icon: <ArchiveBoxIcon className="h-5 w-5" /> },
    { label: "Status", icon: <CheckCircleIcon className="h-5 w-5" /> },
    ...(status === "inuse"
      ? [{ label: "Customer", icon: <UserIcon className="h-5 w-5" /> }]
      : []),
    { label: "Submit", icon: <BuildingStorefrontIcon className="h-5 w-5" /> },
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
    
      dispatch(changeProductStatus(superAdminData)).unwrap()
    };

    const filteredProducts = productsLogList.filter((item) =>
      item.productCode.toLowerCase().includes(searchTerm.toLowerCase())
    );
    

  return (
    <div className="py-6">
      <Card className="w-full max-w-6xl mx-auto shadow-lg border border-gray-200 rounded-3xl">
        <CardHeader className="bg-[#f5f7f8] p-6 rounded-t-3xl border-b mx-0 mt-0">
          <div className="flex justify-around items-center mt-6 px-2">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center gap-2 group">
                <div
                  className={`rounded-full w-10 h-10 flex items-center justify-center ${isComplete(step.label)
                    ? "bg-[#333333] text-white"
                    : "bg-gray-300 text-gray-700"
                    }`}
                >
                  {step.icon}
                </div>
                <Typography
                  className={`text-xs ${isComplete(step.label) ? "text-[#333333] font-semibold" : "text-gray-600"
                    }`}
                >
                  {step.label}
                </Typography>
                {/* {index !== steps.length - 1 && (
                    <div className="w-6 h-1 bg-gray-300  transition-all mx-1 rounded-full" />
                  )} */}
              </div>
            ))}
          </div>
        </CardHeader>
        <CardBody className="pt-8 space-y-6 px-4 sm:px-8">

          <div>
            <Typography variant="small" className="mb-2 font-semibold">
              Select Product
            </Typography>
            {productsLogList.length > 0 && (
              // <Select
              //   label="Product"
              //   value={product}
              //   onChange={(val) => setProduct(val)}
              //   className="bg-white"
              //   searchable
                
              // >
              //   {productsLogList.map((productItem) => (
              //     <Option key={productItem._id} value={productItem._id}>
              //       {productItem.productCode}
              //     </Option>
              //   ))}
              // </Select>
              <div className="relative">
 <Input
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
  icon={<ChevronDownIcon className="h-5 w-5 text-gray-500" />}
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
        >
          {item.productCode}
        </li>
      ))}
    </ul>
  )}
</div>

            )}


          </div>

          <div>
            <Typography variant="small" className="mb-2 font-semibold">
              Select Status
            </Typography>
            <Select
              label="Status"
              value={status}
              onChange={handleStatusChange}
              className="bg-white"
            >
              <Option value="new">new</Option>
              <Option value="inuse">inuse</Option>
              <Option value="exhausted">exhausted</Option>
            </Select>
          </div>

          {status === "inuse" && (
            <div className="transition-all duration-300 ease-in-out">
              <Typography variant="small" className="mb-2 font-semibold">
                Select Customer
              </Typography>
              {customersDropdown.length > 0 && (
            <div className="relative">
            <Input
              label="Search Customer"
              value={
                customersDropdown.find((c) => c._id === customer)?.contact_number ||
                customerSearchTerm
              }
              onChange={(e) => {
                setCustomerSearchTerm(e.target.value);
                setCustomer(""); // clear selection when user types
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
              icon={<ChevronDownIcon className="h-5 w-5 text-gray-500" />}
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
                    >
                      {c.contact_number}
                    </li>
                  ))}
              </ul>
            )}
          </div>
          
              )}
            </div>
          )}

          <div className="flex justify-end pt-6">
            <Button
              color="[#333333]"
              disabled={!product || !status || (status === "inuse" && !customer)}
              className="rounded-full px-8 py-3 shadow-md"
              onClick={handleSubmit}
              >
              {loading ? <div className='px-[7px]'><ArrowPathIcon className="h-4 w-4 animate-spin" /> </div> : "Submit"}
              {/* Submit */}
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default MasterAdmin;
