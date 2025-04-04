import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Option,
  Select,
  Typography,
} from "@material-tailwind/react";
import React, { useState } from "react";
import { CheckCircleIcon, UserIcon, ArchiveBoxIcon, BuildingStorefrontIcon } from "@heroicons/react/24/solid";

const MasterAdmin = () => {
  const [product, setProduct] = useState("");
  const [status, setStatus] = useState("");
  const [customer, setCustomer] = useState("");

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
            <Select
              label="Product"
              value={product}
              onChange={(val) => setProduct(val)}
              className="bg-white"
            >
              <Option value="1054.80.25.WND">1054.80.25.WND</Option>
              <Option value="1054.64.25.WND">1054.64.25.WND</Option>
              <Option value="1054.65.25.WND">1054.65.25.WND</Option>
            </Select>
          </div>

          <div>
            <Typography variant="small" className="mb-2 font-semibold">
              Select Status
            </Typography>
            <Select
              label="Status"
              value={status}
              onChange={(val) => setStatus(val)}
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
              <Select
                label="Customer"
                value={customer}
                onChange={(val) => setCustomer(val)}
                className="bg-white"
              >
                <Option value="BW-CUST-00001">BW-CUST-00001</Option>
                <Option value="BW-CUST-00002">BW-CUST-00002</Option>
                <Option value="BW-CUST-00003">BW-CUST-00003</Option>
              </Select>
            </div>
          )}

          <div className="flex justify-end pt-6">
            <Button
              color="[#333333]"
              disabled={!product || !status || (status === "inuse" && !customer)}
              className="rounded-full px-8 py-3 shadow-md"
            >
              Submit
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default MasterAdmin;
