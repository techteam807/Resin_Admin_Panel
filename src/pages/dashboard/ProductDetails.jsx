import { Button, Dialog, DialogBody, DialogFooter, DialogHeader } from '@material-tailwind/react';
import React from 'react'

const ProductDetails = ({ details, setDetails, handleEditProduct, data, setData }) => {
    console.log("data", data);

    const formatUTCDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "Invalid Date";

        const istOffset = 5.5 * 60 * 60 * 1000;
        const istDate = new Date(date.getTime() + istOffset);

        const day = String(istDate.getUTCDate()).padStart(2, "0");
        const month = String(istDate.getUTCMonth() + 1).padStart(2, "0");
        const year = istDate.getUTCFullYear();

        let hours = istDate.getUTCHours();
        const minutes = String(istDate.getUTCMinutes()).padStart(2, "0");
        const seconds = String(istDate.getUTCSeconds()).padStart(2, "0");

        const ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12;

        return `${day}/${month}/${year} ${hours}:${minutes}:${seconds} ${ampm}`;
    };

    return (
        <div>
            <Dialog
                open={details}
                handler={() => { setDetails(false); setData(null); }}
                data-dialog-mount="opacity-100"
                data-dialog-unmount="opacity-0"
                data-dialog-transition="transition-opacity"
            >
                <DialogHeader className='justify-center'>Product Details</DialogHeader>
                <DialogBody className='border border-blue-gray-100 rounded-md mx-5 p-0'>
                    <div className="">
                        <div className="flex justify-between border-b border-blue-gray-100 py-2.5 px-4">
                            <span className="font-semibold">Product Code:</span>
                            <span>{data?.productCode}</span>
                        </div>
                        <div className="flex justify-between border-b border-blue-gray-100 py-2.5 px-4">
                            <span className="font-semibold">Distributor Type:</span>
                            <span>{data?.distributorType}</span>
                        </div>
                        <div className="flex justify-between border-b border-blue-gray-100 py-2.5 px-4">
                            <span className="font-semibold">Resin Type:</span>
                            <span>{data?.resinType}</span>
                        </div>
                        <div className="flex justify-between border-b border-blue-gray-100 py-2.5 px-4">
                            <span className="font-semibold">Vessel Size:</span>
                            <span>{data?.vesselSize}</span>
                        </div>
                        <div className="flex justify-between border-b border-blue-gray-100 py-2.5 px-4">
                            <span className="font-semibold">Adapter Size:</span>
                            <span>{data?.adapterSize}</span>
                        </div>
                        <div className="flex justify-between border-b border-blue-gray-100 py-2.5 px-4">
                            <span className="font-semibold">Product Batch No:</span>
                            <span>{data?.productBatchNo}</span>
                        </div>
                        <div className="flex justify-between border-b border-blue-gray-100 py-2.5 px-4">
                            <span className="font-semibold">Product Status:</span>
                            <span>{data?.productStatus}</span>
                        </div>
                        <div className="flex justify-between border-b border-blue-gray-100 py-2.5 px-4">
                            <span className="font-semibold">Product Created At:</span>
                            <span>
                                {formatUTCDate(data?.createdAt)}
                            </span>
                        </div>
                        <div className="flex justify-between py-2.5 px-4">
                            <span className="font-semibold">Product Updated At:</span>
                            <span>
                                {formatUTCDate(data?.updatedAt)}
                            </span>
                        </div>
                    </div>
                </DialogBody>
                <DialogFooter className='flex gap-4'>
                    <Button variant="outlined" onClick={() => { setDetails(false); setData(null); }}>
                        Cancel
                    </Button>
                    <Button variant="gradient" onClick={() => handleEditProduct(data)} >
                        Edit
                    </Button>
                </DialogFooter>
            </Dialog>
        </div>
    )
}

export default ProductDetails
