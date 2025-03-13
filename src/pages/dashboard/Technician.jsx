import React, { useEffect, useState } from "react";
import { CheckCircleIcon, MagnifyingGlassIcon, PauseCircleIcon } from "@heroicons/react/24/outline";
import { ArrowPathIcon, ArrowPathRoundedSquareIcon, CheckBadgeIcon, PencilIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { Card, CardHeader, Input, Typography, Button, CardBody, Tabs, TabsHeader, Tab, Tooltip, IconButton } from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";
import { approveTechnician, deleteTechnician, getTechnicians, restoreTechnician } from "@/feature/technician/technicianSlice";
import Loader from "../Loader";
import Pagination from "@/common/Pagination";

const Technician = () => {
    const TABLE_HEAD = ["Name", "Number", "Action"];

    const dispatch = useDispatch();
    const { technicians, loading, pagination, delLoading } = useSelector((state) => state.technician);
    const [searchValue, setSearchValue] = useState("");
    const [user_status, setUser_status] = useState('pending');
    const [deletingTechnicianId, setDeletingTechnicianId] = useState(null);


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

    const handleDelete = (technicianId) => {
        const mobile_number = { mobile_number: technicianId}
        if (technicianId) {
            setDeletingTechnicianId(technicianId);
            dispatch(deleteTechnician( mobile_number )).then(() => {
                setDeletingTechnicianId(null);
            });
        }
    }

    const handleRestore = (technicianId) => {
        const mobile_number = { mobile_number: technicianId}
        if (technicianId) {
            setDeletingTechnicianId(technicianId);
            dispatch(restoreTechnician( mobile_number )).then(() => {
                setDeletingTechnicianId(null);
            });
        }
    }

    const handleApprove = (technicianId) => {
        const mobile_number = { mobile_number: technicianId}
        if (technicianId) {
            setDeletingTechnicianId(technicianId);
            dispatch(approveTechnician( mobile_number )).then(() => {
                setDeletingTechnicianId(null);
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
                            <div className="flex shrink-0 gap-2 flex-row">
                                {/* <Button variant="outlined" className="w-full sm:w-max" size="sm">
              view all
            </Button> */}
                                {/* <Button onClick={() => setOpen(true)} className="flex items-center gap-2 w-full h-max py-3 sm:w-max" size="sm">
              <SquaresPlusIcon strokeWidth={2} className="h-4 w-4" /> Add Product
            </Button> */}

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
                                                                            <IconButton onClick={() => handleApprove(technician?.mobile_number)}variant="text">
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
                                                                            <IconButton onClick={() => handleDelete(technician?.mobile_number)} variant="text">
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
                                                                            <IconButton onClick={() => handleRestore(technician?.mobile_number)} variant="text">
                                                                            {delLoading && deletingTechnicianId === technician?.mobile_number ?
                                                                             <ArrowPathIcon className="h-4 w-4 animate-spin" />
                                                                             :
                                                                                <ArrowPathRoundedSquareIcon className="h-4 w-4" />
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
            {/* <AddProduct open={open} setOpen={setOpen} data={data} setData={setDate} /> */}
        </div>
    )
}

export default Technician
