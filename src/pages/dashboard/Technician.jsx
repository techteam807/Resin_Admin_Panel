import React, { useEffect, useState } from "react";
import { CheckCircleIcon, MagnifyingGlassIcon, PauseCircleIcon } from "@heroicons/react/24/outline";
import { ArrowPathIcon, ArrowPathRoundedSquareIcon, CheckBadgeIcon, PencilIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { Card, CardHeader, Input, Typography, Button, CardBody, Tabs, TabsHeader, Tab, Tooltip, IconButton, Dialog, DialogHeader, DialogBody, DialogFooter } from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";
import { approveTechnician, deletePerTechnician, deleteTechnician, getTechnicians, restoreTechnician } from "@/feature/technician/technicianSlice";
import Loader from "../Loader";
import Pagination from "@/common/Pagination";

const Technician = () => {
    const TABLE_HEAD = ["Name", "Number", "Action"];

    const dispatch = useDispatch();
    const { technicians, loading, pagination, delLoading } = useSelector((state) => state.technician);
    const [searchValue, setSearchValue] = useState("");
    const [user_status, setUser_status] = useState('pending');
    const [deletingTechnicianId, setDeletingTechnicianId] = useState(null);
    const [alertOpen, setAlertOpen] = useState(false);
    const [technicianToDelete, setTechnicianToDelete] = useState(null);
    const [approveOpen, setApproveOpen] = useState(false);
    const [technicianToApprove, setTechnicianToApprove] = useState(null);
    const [restoreOpen, setRestoreOpen] = useState(false);
    const [technicianToRestore, setTechnicianToRestore] = useState(null);
    const [perDeleteOpen, setPerDeleteOpen] = useState(false);
    const [technicianToPerDelete, setTechnicianToPerDelete] = useState(null);

    useEffect(() => {
        dispatch(getTechnicians({ page: 1, user_status: user_status }));
    }, [dispatch, user_status]);

    const handleSearch = () => {
        dispatch(getTechnicians({ page: 1, user_status: user_status, search: searchValue }));
    }

    const searchClear = () => {
        setSearchValue('')
        dispatch(getTechnicians({ page: 1, user_status: user_status }));
    }

    const handlePaginationChange = (page) => {
        dispatch(getTechnicians({ page, user_status: user_status, search: searchValue }));
    };

    const confirmDelete = (technicianId) => {
        setTechnicianToDelete(technicianId);
        setAlertOpen(true);
    };

    const handleDelete = () => {
        const mobile_number = { mobile_number: technicianToDelete}
        if (technicianToDelete) {
            setDeletingTechnicianId(technicianToDelete);
            dispatch(deleteTechnician( mobile_number )).then(() => {
                setDeletingTechnicianId(null);
                setAlertOpen(false);
            });
        }
    }

    const confirmPerDelete = (technicianId) => {
        setTechnicianToPerDelete(technicianId);
        setPerDeleteOpen(true);
    };

    const handlePerDelete = () => {
        const mobile_number = { mobile_number: technicianToPerDelete}
        if (technicianToPerDelete) {
            setDeletingTechnicianId(technicianToPerDelete);
            dispatch(deletePerTechnician( mobile_number ))
            .then(() => {
                setDeletingTechnicianId(null);
                setPerDeleteOpen(false);
            });
        }
    }

    const confirmRestore = (technicianId) => {
        setTechnicianToRestore(technicianId);
        setRestoreOpen(true);
    };

    const handleRestore = () => {
        const mobile_number = { mobile_number: technicianToRestore}
        if (technicianToRestore) {
            setDeletingTechnicianId(technicianToRestore);
            dispatch(restoreTechnician( mobile_number )).then(() => {
                setDeletingTechnicianId(null);
                setRestoreOpen(false);
            });
        }
    }

    const confirmApprove = (technicianId) => {
        setTechnicianToApprove(technicianId);
        setApproveOpen(true);
    };

    const handleApprove = () => {
        const mobile_number = { mobile_number: technicianToApprove}
        if (technicianToApprove) {
            setDeletingTechnicianId(technicianToApprove);
            dispatch(approveTechnician( mobile_number )).then(() => {
                setDeletingTechnicianId(null);
                setApproveOpen(false);
            });
        }
    }

    const TABS = [
        {
            label: "Pending",
            value: "pending",
            icon: PauseCircleIcon,
            condition: true,
        },
        {
            label: "Approved",
            value: "approve",
            icon: CheckBadgeIcon,
            condition: true,
        },
        {
            label: "Deleted",
            value: "delete",
            icon: TrashIcon,
            condition: false,
        },
    ];

    return (
        <div className="">
            <div className="bg-clip-border rounded-xl bg-white text-gray-700 border border-blue-gray-100 mt-9 shadow-sm">
                <Card className="h-full w-full">
                    <CardHeader floated={false} shadow={false} className="rounded-none">
                        <div className="mb-3 flex flex-row md:items-center justify-between md:gap-8">
                            <div>
                                <Typography variant="h5" color="blue-gray">
                                    Technician list
                                </Typography>
                                <Typography color="gray" variant="small" className="mt-1 font-normal">
                                    See information about all technician
                                </Typography>
                            </div>
                        </div>
                    </CardHeader>
                    <Tabs value="pending" className="w-full pt-2">
                        <div className="flex flex-col items-center justify-between gap-4 md:flex-row px-4">
                            <TabsHeader>
                                {TABS.map(({ label, value, icon }) => (
                                    <Tab key={value} value={value} onClick={() => setUser_status(value)}>
                                        <div className="flex items-center gap-2 whitespace-nowrap">
                                            {React.createElement(icon, { className: "w-4 h-4" })}
                                            {label}
                                        </div>
                                    </Tab>
                                ))}
                            </TabsHeader>
                            <div className="w-full md:w-72 relative flex gap-2">
                                <Input
                                    label="Search"
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                    icon={searchValue ? <XMarkIcon onClick={searchClear} className="h-5 w-5 cursor-pointer" /> : null}
                                />
                                <Button onClick={handleSearch} variant="gradient" className="px-2.5" size="sm">
                                    <MagnifyingGlassIcon className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    </Tabs>
                    {loading ? (
                        <div><Loader /></div>) :
                        (
                            <div>
                                <CardBody className="px-0">
                                    <div className="overflow-x-auto">
                                        <table className="mt-0 w-full min-w-max table-auto text-left">
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
                                                {technicians?.map(
                                                    (technician, index) => {
                                                        const isLast = index === technicians?.length - 1;
                                                        const classes = isLast
                                                            ? "p-4"
                                                            : "p-4 border-b border-blue-gray-50";

                                                        return (
                                                            <tr key={index} className="hover:bg-gray-50">
                                                                <td className={classes}>
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="flex flex-col">
                                                                            <Typography
                                                                                variant="small"
                                                                                color="blue-gray"
                                                                                className="font-normal"
                                                                            >
                                                                                {technician?.user_name}
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
                                                                            {technician?.mobile_number}
                                                                        </Typography>
                                                                    </div>
                                                                </td>
                                                                 {user_status === 'pending' &&
                                                                    <td className={classes}>
                                                                        <Tooltip content="Approve">
                                                                            <IconButton onClick={() => confirmApprove(technician?.mobile_number)}variant="text">
                                                                            {delLoading && deletingTechnicianId === technician?.mobile_number ?
                                                                                    <ArrowPathIcon className="h-4 w-4 animate-spin" />
                                                                                    :
                                                                                <CheckBadgeIcon className="h-5 w-5" />
                                                                            }
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                    </td>
                                                                }
                                                                {user_status === 'approve' &&
                                                                    <td className={classes}>
                                                                        <Tooltip content="Delete">
                                                                            <IconButton onClick={() => confirmDelete(technician?.mobile_number)} variant="text">
                                                                                {delLoading && deletingTechnicianId === technician?.mobile_number ?
                                                                                    <ArrowPathIcon className="h-4 w-4 animate-spin" />
                                                                                    :
                                                                                    <TrashIcon className="h-4 w-4" />
                                                                                }
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                    </td>
                                                                }
                                                                {user_status === 'delete' &&
                                                                    <td className={classes}>
                                                                        <Tooltip content="Restore">
                                                                            <IconButton onClick={() => confirmRestore(technician?.mobile_number)} variant="text">
                                                                            {delLoading && deletingTechnicianId === technician?.mobile_number ?
                                                                             <ArrowPathIcon className="h-4 w-4 animate-spin" />
                                                                             :
                                                                                <ArrowPathRoundedSquareIcon className="h-4 w-4" />
                                                                            }
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                        <Tooltip content="Permanent Delete">
                                                                            <IconButton onClick={() => confirmPerDelete(technician?.mobile_number)} variant="text">
                                                                            {delLoading && deletingTechnicianId === technician?.mobile_number ?
                                                                             <ArrowPathIcon className="h-4 w-4 animate-spin" />
                                                                             :
                                                                                <TrashIcon className="h-4 w-4" />
                                                                            }
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                    </td>
                                                                } 
                                                            </tr>
                                                        );
                                                    },
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </CardBody>
                                <Pagination
                                    currentPage={pagination.currentPage}
                                    totalPages={pagination.totalPages}
                                    onChange={handlePaginationChange}
                                />

                            </div>

                         )}
                </Card>
            </div>
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
                        Are you sure you want to delete this Technician? This action cannot be undone.
                    </Typography>
                </DialogBody>
                <DialogFooter className="flex justify-end gap-2">
                    <Button variant="outlined" color="gray" onClick={() => setAlertOpen(false)}>Cancel</Button>
                    <Button color="red" onClick={handleDelete}>
                        {delLoading && deletingTechnicianId === technicianToDelete ? (
                            <div className='px-[13px]'><ArrowPathIcon className="h-4 w-4 animate-spin" /></div>
                        ) : (
                            "Delete"
                        )}
                    </Button>
                </DialogFooter>
            </Dialog>
            <Dialog size='xs' open={restoreOpen} handler={() => setRestoreOpen(false)}>
                <DialogHeader className="flex items-center gap-2">
                    <div className="bg-red-100 p-2 rounded-full">
                        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M4.293 4.293a1 1 0 011.414 0l14 14a1 1 0 01-1.414 1.414l-14-14a1 1 0 010-1.414z"></path>
                        </svg>
                    </div>
                    <Typography variant="h6" className="text-red-600 font-semibold">
                        Confirm Restore
                    </Typography>
                </DialogHeader>
                <DialogBody>
                    <Typography variant="small" className="text-gray-700">
                        Are you sure you want to restore this Technician? This action cannot be undone.
                    </Typography>
                </DialogBody>
                <DialogFooter className="flex justify-end gap-2">
                    <Button variant="outlined" color="gray" onClick={() => setRestoreOpen(false)}>Cancel</Button>
                    <Button color="red" onClick={handleRestore}>
                        {delLoading && deletingTechnicianId === technicianToRestore ? (
                            <div className='px-[18px]'><ArrowPathIcon className="h-4 w-4 animate-spin" /></div>
                        ) : (
                            "Restore"
                        )}
                    </Button>
                </DialogFooter>
            </Dialog>
            <Dialog size='xs' open={approveOpen} handler={() => setApproveOpen(false)}>
                <DialogHeader className="flex items-center gap-2">
                    <div className="bg-red-100 p-2 rounded-full">
                        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M4.293 4.293a1 1 0 011.414 0l14 14a1 1 0 01-1.414 1.414l-14-14a1 1 0 010-1.414z"></path>
                        </svg>
                    </div>
                    <Typography variant="h6" className="text-red-600 font-semibold">
                        Confirm Approve
                    </Typography>
                </DialogHeader>
                <DialogBody>
                    <Typography variant="small" className="text-gray-700">
                        Are you sure you want to approve this Technician? This action cannot be undone.
                    </Typography>
                </DialogBody>
                <DialogFooter className="flex justify-end gap-2">
                    <Button variant="outlined" color="gray" onClick={() => setApproveOpen(false)}>Cancel</Button>
                    <Button color="red" onClick={handleApprove}>
                        {delLoading && deletingTechnicianId === technicianToApprove ? (
                            <div className='px-[19px]'><ArrowPathIcon className="h-4 w-4 animate-spin" /></div>
                        ) : (
                            "Approve"
                        )}
                    </Button>
                </DialogFooter>
            </Dialog>
            <Dialog size='xs' open={perDeleteOpen} handler={() => setPerDeleteOpen(false)}>
                <DialogHeader className="flex items-center gap-2">
                    <div className="bg-red-100 p-2 rounded-full">
                        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M4.293 4.293a1 1 0 011.414 0l14 14a1 1 0 01-1.414 1.414l-14-14a1 1 0 010-1.414z"></path>
                        </svg>
                    </div>
                    <Typography variant="h6" className="text-red-600 font-semibold">
                        Confirm Permanent Delete
                    </Typography>
                </DialogHeader>
                <DialogBody>
                    <Typography variant="small" className="text-gray-700">
                        Are you sure you want to permanent delete this Technician? This action cannot be undone.
                    </Typography>
                </DialogBody>
                <DialogFooter className="flex justify-end gap-2">
                    <Button variant="outlined" color="gray" onClick={() => setPerDeleteOpen(false)}>Cancel</Button>
                    <Button color="red" onClick={handlePerDelete}>
                        {delLoading && deletingTechnicianId === technicianToPerDelete ? (
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

export default Technician
