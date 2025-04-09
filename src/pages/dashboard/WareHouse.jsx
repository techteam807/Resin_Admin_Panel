import { createWarehouse, deleteWarehouse, getWarehouse } from '@/feature/warehouse/warehouseSlice';
import { Alert, Button, Card, CardBody, CardHeader, Chip, Dialog, DialogBody, DialogFooter, DialogHeader, IconButton, Input, Tooltip, Typography } from '@material-tailwind/react';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../Loader';
import { ArrowPathIcon, CheckIcon, ClipboardIcon, SquaresPlusIcon, TrashIcon } from '@heroicons/react/24/solid';
import { HiStar } from 'react-icons/hi2';

const WareHouse = () => {

    const dispatch = useDispatch();
    const { warehouses, loading, deleteLoading, createLoading } = useSelector((state) => state.warehouse);
    const [deletingWarehouseId, setDeletingWarehouseId] = useState(null);
    const [copiedStates, setCopiedStates] = useState({});
    const [open, setOpen] = useState(false);
    const [warehouseData, setWarehouseData] = useState({ wareHouse_code: '' });
    const [alertOpen, setAlertOpen] = useState(false);
    const [warehouseToDelete, setWarehouseToDelete] = useState(null);

    useEffect(() => {
        dispatch(getWarehouse());
      }, [dispatch]);

      const confirmDelete = (warehouseId) => {
        setWarehouseToDelete(warehouseId);
        setAlertOpen(true);
    };

    const handleDelete = () => {
      if (warehouseToDelete) {
          setDeletingWarehouseId(warehouseToDelete);
          dispatch(deleteWarehouse(warehouseToDelete)).then(() => {
              setDeletingWarehouseId(null);
              setAlertOpen(false);
          });
      }
  };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setWarehouseData((prev) => ({ ...prev, [name]: value }));
    };


    const handleCopy = (warehouseId, wareHouseCode) => {
        if (wareHouseCode) {
            navigator.clipboard.writeText(wareHouseCode).then(() => {
                setCopiedStates((prev) => ({ ...prev, [warehouseId]: true }));
                setTimeout(() => {
                    setCopiedStates((prev) => ({ ...prev, [warehouseId]: false }));
                }, 1000);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
            });
        }
    };

    const handleSubmit = () => {
            dispatch(createWarehouse(warehouseData))
            setOpen(false)
            setWarehouseData({ wareHouse_code: '' })
        }

    const formatDate = (dateString) => {
        const options = {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        };
        return new Date(dateString).toLocaleString('en-GB', options);
      };

      const TABLE_HEAD = ["Warehouse", "Create Date/Time", "Action"];

  return (
    <div>
    <div className="bg-clip-border rounded-xl bg-white text-gray-700 border border-blue-gray-100 mt-9 shadow-sm">
      <Card className="h-full w-full">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="flex md:flex-row flex-col md:items-center justify-between md:gap-8 gap-4">
          <div>
            <Typography variant="h5" color="blue-gray">
              Warehouse list
            </Typography>
            <Typography color="gray" variant='small' className="mt-1 font-normal">
              See information about all warehouse
            </Typography>
          </div>
          <div className="flex shrink-0 gap-2 flex-row">
            <Button onClick={() => setOpen(true)} className="flex items-center gap-2 w-full h-max py-3 sm:w-max" size="sm">
            <SquaresPlusIcon strokeWidth={2} className="h-4 w-4" /> Add Warehouse
            </Button>
        </div>
        </div>
      </CardHeader>
      <CardBody className="px-0">
      {loading ? <div className=''><Loader /></div> :
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
            {warehouses?.map((warehouse, index) => {
                const isLast = index === warehouses.length - 1;
                const classes = isLast
                  ? "p-4"
                  : "p-4 border-b border-blue-gray-50";
                const isCopied = copiedStates[warehouse._id];
 
                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className={classes}>
                        <div className="w-max flex items-center gap-2">
                            <Chip
                                variant="ghost"
                                size="sm"
                                value={warehouse?.wareHouseCode}
                                color="brown"
                            />
                            <Tooltip content={isCopied ? "Copied!" : "Copy Code"}>
                                <IconButton
                                    variant="text"
                                    onClick={() => handleCopy(warehouse._id, warehouse?.wareHouseCode)}
                                    size='sm'
                                >
                                    {isCopied ? (
                                        <CheckIcon className="h-4 w-4 text-green-600" />
                                    ) : (
                                        <ClipboardIcon className="h-4 w-4 text-gray-600" />
                                    )}
                                </IconButton>
                            </Tooltip>
                        </div>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                        >
                       {formatDate(warehouse?.createdAt)}
                      </Typography>
                    </td>
                    <td className={classes}>
                    <Tooltip content="Delete">
                        <IconButton onClick={() => confirmDelete(warehouse?._id)} variant="text">
                            {deleteLoading && deletingWarehouseId === warehouse?._id ?
                                <ArrowPathIcon className="h-4 w-4 animate-spin" />
                                    :
                                <TrashIcon className="h-4 w-4" />
                            }
                        </IconButton>
                    </Tooltip>
                    </td>
                  </tr>
                );
              },
            )}
          </tbody>
        </table>
        </div>
    }
      </CardBody>
    </Card>
    </div>
    <Dialog
        open={open}
        handler={() => {setOpen(false); setWarehouseData({ wareHouse_code: '' })}}
        data-dialog-mount="opacity-100"
        data-dialog-unmount="opacity-0"
        data-dialog-transition="transition-opacity"
    >
        <DialogHeader className='justify-center'>Add Warehouse</DialogHeader>
        <DialogBody>
            <div className='grid grid-cols-1 gap-5 px-0 md:px-5'>
                <Input 
                    variant='standard' 
                    label='Warehouse Code' 
                    name="wareHouse_code"
                    value={warehouseData.wareHouse_code} 
                    onChange={handleChange}
                />

            </div>
            <div className='text-[10px] font-bold px-0 md:px-5 text-red-600 flex gap-1'> <HiStar className='pt-1' />AB-ABCD-01</div>
        </DialogBody>
        <DialogFooter className='flex gap-4'>
            <Button variant="outlined" onClick={() => {setOpen(false); setWarehouseData({ wareHouse_code: '' })}}>
                Cancel
            </Button>
            <Button variant="gradient" onClick={handleSubmit} >
                {createLoading ? <div className='px-[7px]'><ArrowPathIcon className="h-4 w-4 animate-spin" /> </div> : "Save"}
            </Button>
        </DialogFooter>
        </Dialog>
        <Dialog size='xs' open={alertOpen} handler={() => setAlertOpen(false)}>
          <DialogHeader className="flex items-center gap-2">
              <div className="bg-red-100 p-2 rounded-full">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M4.293 4.293a1 1 0 011.414 0l14 14a1 1 0 01-1.414 1.414l-14-14a1 1 0 010-1.414z"></path>
                  </svg>
              </div>
              <Typography variant="h6" className="text-red-600 font-semibold">
                  Confirm Deletion
              </Typography>
          </DialogHeader>
          <DialogBody>
              <Typography variant="small" className="text-gray-700">
                  Are you sure you want to delete this warehouse? This action cannot be undone.
              </Typography>
          </DialogBody>
          <DialogFooter className="flex justify-end gap-2">
              <Button variant="outlined" color="gray" onClick={() => setAlertOpen(false)}>Cancel</Button>
              <Button color="red" onClick={handleDelete}>
                  {deleteLoading && deletingWarehouseId === warehouseToDelete ? (
                      <div className='px-[13px]'><ArrowPathIcon className="h-4 w-4 animate-spin" /></div>
                  ) : (
                      "Delete"
                  )}
              </Button>
          </DialogFooter>
        </Dialog>

    </div>
  )
}

export default WareHouse
