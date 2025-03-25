import { Button, Dialog, DialogBody, DialogFooter, DialogHeader } from '@material-tailwind/react';
import React from 'react'

const ProductDetails = ({details, setDetails, handleEditProduct, data, setData}) => {
    console.log("data", data);
    
  return (
    <div>
      <Dialog
        open={details}
        handler={() => {setDetails(false); setData(null);}}
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
                    <span className="font-semibold">Product Status:</span>
                    <span>{data?.productStatus}</span>
                </div>
                <div className="flex justify-between py-2.5 px-4">
                    <span className="font-semibold">Date / Time:</span>
                    <span>{new Date(data?.updatedAt).toLocaleString()}</span>
                </div>
            </div>
        </DialogBody>
        <DialogFooter className='flex gap-4'>
                    <Button variant="outlined" onClick={() => {setDetails(false); setData(null);}}>
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
