import { getProducts } from '@/feature/product/productSlice';
import { ArrowPathIcon } from '@heroicons/react/24/solid';
import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, Input } from '@material-tailwind/react'
import React, { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import * as XLSX from "xlsx";

const AddXL = ({open1, setOpen1, active}) => {
    const dispatch = useDispatch();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);
    const [alertMessage, setAlertMessage] = useState({});

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        setAlertMessage({})
        reader.onload = (event) => {
          const data = new Uint8Array(event.target.result);
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
    
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
          const headers = jsonData[0]; 
          const ProductCode = headers.indexOf("Bar Code Number");
          const VesselSize = headers.indexOf("Vessel Size");
          const AdapterSize = headers.indexOf("Adapter Size");
          const ResinType = headers.indexOf("Resin Type");
    
          if (ProductCode === -1 || VesselSize === -1 || AdapterSize === -1 || ResinType === -1) {
            console.error("Required columns not found!");
            return;
          }
    
         
          const extractedData = jsonData
          .slice(1)
          .filter(row => row.some(cell => cell !== null && cell !== ""))
          .map((row) => ({
            productCode: row[ProductCode],
            isActive:true,
            createdAt: new Date().toISOString(),
            resinType: row[ResinType],
            vesselSize: row[VesselSize],
            adapterSize: row[AdapterSize],
            productStatus:"new"
          }));
    
          setUsers(extractedData);
        };
    
        reader.readAsArrayBuffer(file);
      };

      const handleSubmit = async () => {
        // if (users.length === 0) {
        //     alert("No data to upload. Please upload a valid Excel file.");
        //     return;
        // }
        setLoading(true);
        try {
          const response = await fetch(`${import.meta.env.VITE_APP_BASE_URL}products/uploadProducts`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ Products:users }),
          });
      
          const result = await response.json();

          setLoading(false);
          setAlertMessage(result.message);
          dispatch(getProducts({active: active }));
          console.log(result);
          if (fileInputRef.current) fileInputRef.current.value = "";
          setUsers([]);
        } catch (error) {
          console.error("Error submitting users:", error);
          setLoading(false);
        }
      };
      
  return (
    <div>
      <Dialog
        open={open1}
        handler={() => {setOpen1(false); setUsers([]); setAlertMessage({})}}
        data-dialog-mount="opacity-100"
        data-dialog-unmount="opacity-0"
        data-dialog-transition="transition-opacity"
        className="max-h-screen overflow-y-auto"
      >
        <DialogHeader className='justify-center'>Add Excel File</DialogHeader>
        <DialogBody>
            <div className='text-center'>
                <Input variant='standard' label='Upload File' type="file" accept=".xlsx, .xls" onChange={handleFileUpload} inputRef={fileInputRef} />
                <div className='text-left text-[10px] pt-2 text-red-600'>* Duplicate products are skipped automatically.</div>
            </div>
            {alertMessage && Object.keys(alertMessage).length > 0 && (
              <div className='pt-3 text-xs'>
                {alertMessage?.insertedCount > 0 && (
                  <div>Added Product Count: {alertMessage.insertedCount}</div>
                )}

                {Array.isArray(alertMessage?.insertedProductCodes) && alertMessage.insertedProductCodes.length > 0 && (
                  <div className='flex gap-x-5'>
                    <span>Added Product Code:</span>
                    <ul className="list-disc grid lg:grid-cols-4 md:grid-cols-4 grid-cols-2 gap-x-5 gap-y-1">
                      {alertMessage.insertedProductCodes.map((product, index) => (
                        <li key={index} className="break-words">{product}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {alertMessage?.duplicateCount > 0 && (
                  <div>Duplicate Product Count: {alertMessage.duplicateCount}</div>
                )}

                {Array.isArray(alertMessage?.duplicateProductCodes) && alertMessage.duplicateProductCodes.length > 0 && (
                  <div className='flex gap-x-5'>
                    <span>Duplicate Product Code:</span>
                    <ul className="list-disc grid lg:grid-cols-4 md:grid-cols-4 grid-cols-2 gap-x-5 gap-y-1">
                      {alertMessage.duplicateProductCodes.map((product, index) => (
                        <li key={index} className="break-words">{product}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
        </DialogBody>
        <DialogFooter className='flex gap-4'>
            <Button variant="outlined" onClick={() => {setOpen1(false); setUsers([]); setAlertMessage('')}}>
                Cancel
            </Button>
            <Button variant="gradient" onClick={handleSubmit} disabled={loading || users.length === 0}>
               {loading ? <div className='px-[15px]'><ArrowPathIcon className="h-4 w-4 animate-spin" /> </div> : "Upload"} 
            </Button>
        </DialogFooter>
      </Dialog>
    </div>
  )
}

export default AddXL
