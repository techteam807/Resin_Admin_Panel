import React, { useEffect, useState } from "react";
import { Button, Input, Option, Select, Typography, Dialog, DialogHeader, DialogBody, DialogFooter } from '@material-tailwind/react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { XMarkIcon, MagnifyingGlassIcon, EyeIcon, EllipsisHorizontalIcon, EllipsisVerticalIcon } from '@heroicons/react/24/solid';
import Loader from '@/pages/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { editCustomerFreeze, getCustomersClusterMap } from "@/feature/customer/customerSlice";

const clusterColors = ['red', 'blue', 'green', 'purple', 'orange', 'cyan', 'magenta', 'SteelBlue'];

const ClusterList = ({
  data,
  mapLoading1,
  saveLoading,
  selectedVehicle,
  searchValue,
  isVisible,
  setSearchValue,
  setIsVisible,
  vehicles,
  handleVehicleSelect,
  handleSearch,
  searchClear,
  handleSave,
  onDragEnd,
  onFreezeUpdate,
}) => {
  console.log("data", data)
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  console.log("selectedCustomer", selectedCustomer)
  const { customerLoading } = useSelector((state) => state.customer);


  const handleOpen = (customer, clusterId) => {
    setSelectedCustomer({
      ...customer, clusterId, isFreezed: customer.isFreezed, originalIsFreezed: customer.isFreezed,
      originalReplaceMentNotes: customer.replaceMentNotes,
    });
    setOpen(true);
  };
  // 🔄 Refresh data on mount
  useEffect(() => {
    dispatch(getCustomersClusterMap());
  }, [dispatch]);

  const handleConfirm = async () => {
    if (!selectedCustomer) return;

    const payload = {
      clusterId: selectedCustomer.clusterId,
      customerId: selectedCustomer.customerId,
    };

    if (selectedCustomer.isFreezed !== selectedCustomer.originalIsFreezed) {
      payload.isFreezed = selectedCustomer.isFreezed;
    }

    if (
      (selectedCustomer.replaceMentNotes || "") !==
      (selectedCustomer.originalReplaceMentNotes || "")
    ) {
      payload.replaceMentNotes = selectedCustomer.replaceMentNotes;
    }


    try {
      const res = await dispatch(editCustomerFreeze(payload)).unwrap();
      await dispatch(getCustomersClusterMap());
      setOpen(false);

    } catch (err) {
      console.error("Error freezing customer:", err);
    }
  };

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      const hasUnsavedChanges = data.some((cluster, i) =>
        cluster.customers.some((cust, j) => cust.indexNo !== j)
      );
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [data]);

  return (
    <div>
      {saveLoading || data.length === 0 ? (
        <div className="flex items-center justify-center h-[80vh]">
          <Loader />
        </div>
      ) : (
        <>
          <div className="mt-2 rounded-lg p-3 sm:p-4 flex flex-col gap-4 sm:gap-3 lg:flex-row lg:items-center lg:justify-between">
            <Typography variant="h5" color="blue-gray" className="text-center lg:text-left">
              Cluster List
            </Typography>
            <div className="flex flex-col gap-3 sm:gap-2 lg:flex-row lg:flex-wrap lg:items-center">
              <div className="w-full sm:w-48 lg:w-56">
                <Select label="Select Vehicle" onChange={handleVehicleSelect} value={selectedVehicle}>
                  {vehicles.map((vehicle) => (
                    <Option key={vehicle.id} value={vehicle.id}>
                      {vehicle.name}
                    </Option>
                  ))}
                </Select>
              </div>
              <div className="w-full sm:w-64 lg:w-72 relative flex gap-2">
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
              <div className="flex gap-2 w-full sm:w-auto justify-center lg:justify-start">
                <Button size="sm" variant="gradient" onClick={handleSave} className='px-4 py-3'>
                  Save
                </Button>
              </div>
            </div>
          </div>

                    <hr className="mt-2" />
          <div className="overflow-auto max-h-[60vh] sm:max-h-[65vh] lg:max-h-[70vh] mt-4 scrollbar-thin">
            {mapLoading1 || data.length === 0 ? (
              <div className="flex h-[60vh] sm:h-[65vh] lg:h-[70vh] items-center justify-center">
                <Typography variant="h5" color="blue-gray">
                  {mapLoading1 ? <Loader /> : 'No Clusters Available'}
                </Typography>
              </div>
            ) : (
              <DragDropContext onDragEnd={onDragEnd}>
                {/* <div className="w-full grid grid-cols-3 gap-4 scrollbar-thin">
              <div className={`${isVisible ? 'col-span-2' : 'col-span-3'} overflow-auto max-h-full`}>
                <div
                  className={`grid gap-4  ${isVisible ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-3'
                    }`}
                >
                  {data.slice(0, 7).map((cluster, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg shadow-md min-w-[23vw] max-w-[320px] flex flex-col overflow-hidden"
                    >
                      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white text-center text-lg font-semibold py-3 px-4">
                        {cluster.name} ({cluster.clusterName})
                      </div>
                      <Droppable droppableId={`${index}`}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="flex-1 overflow-y-auto max-h-[45vh] scrollbar-thin p-3 space-y-3 bg-gray-50"
                          >
                            {cluster.customers.map((customer, idx) => {
                              const clusterColor = clusterColors[index % clusterColors.length];
                              return (
                                <Draggable key={customer.code} draggableId={customer.code} index={idx}>
                                  {(provided, snapshot) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className={`bg-white flex items-center rounded-md text-sm hover:cursor-pointer w-full text-start p-4 border-l-2 ${snapshot.isDragging ? 'bg-blue-50 shadow-md' : ''
                                        }`}
                                      style={{
                                        ...provided.draggableProps.style,
                                        borderLeftColor: clusterColor,
                                        color: clusterColor,
                                      }}
                                    >
                                      <div className="pr-2 text-lg font-semibold">{idx + 1}.</div>
                                      <div className="flex-1">
                                        <div
                                          onClick={() => {
                                            navigator.clipboard.writeText(customer.code);
                                          }}
                                          title="Click to copy"
                                          className="cursor-pointer hover:underline transition"
                                        >
                                          {customer.code}
                                        </div>
                                        <div>{customer.displayName}</div>
                                      </div>
                                      <div className="ml-auto flex flex-col justify-end items-end text-right">
                                        <div>Qty: {customer.qty}</div>
                                        <div>Size: {customer.size}</div>
                                      </div>
                                    </div>
                                  )}
                                </Draggable>
                              );
                            })}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                      <div className="p-3 border-t border-gray-200 bg-gray-200 text-center text-sm text-gray-700 flex justify-between">
                        <div className="text-left">
                          {cluster.customers.length} Customers <br />
                          {cluster.cartridge_qty} Cartridge Quantity
                        </div>
                        <div>
                          {Object.entries(cluster.size).map(([size, count]) => (
                            <div key={size}>
                              {size}: {count}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <button
                style={{ writingMode: 'sideways-lr', textOrientation: 'mixed' }}
                onClick={() => setIsVisible((prev) => !prev)}
                className="fixed top-[300px] right-1 z-30 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white font-semibold rounded-lg p-2 shadow-lg transition text-xs"
              >
                {isVisible ? 'Hide' : 'Show'} Unassigned Cluster
              </button>
              <div className="grid grid-cols-1">
                {isVisible &&
                  data.slice(7, 8).map((cluster, index) => {
                    const actualIndex = index + 7;
                    const clusterColor = clusterColors[actualIndex % clusterColors.length];
                    return (
                      <div
                        key={actualIndex}
                        className="bg-white rounded-lg shadow-md min-w-[23vw] max-w-[320px] flex flex-col overflow-hidden"
                      >
                        <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white text-center text-lg font-semibold py-3 px-4 relative">
                          {cluster.name} ({cluster.clusterName})
                        </div>
                        <Droppable droppableId={`${actualIndex}`}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              className="bg-gray-50 shadow-md min-w-[23vw] max-w-[320px] flex flex-col overflow-hidden p-3 space-y-3"
                            >
                              {cluster.customers.map((customer, idx) => (
                                <Draggable key={customer.code} draggableId={customer.code} index={idx}>
                                  {(provided, snapshot) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className={`bg-white flex items-center rounded-md text-sm hover:cursor-pointer w-full text-start p-4 border-l-2 ${snapshot.isDragging ? 'bg-blue-50 shadow-md' : ''
                                        }`}
                                      style={{
                                        ...provided.draggableProps.style,
                                        borderLeftColor: clusterColor,
                                        color: clusterColor,
                                      }}
                                    >
                                      <div className="pr-2 text-lg font-semibold">{idx + 1}.</div>
                                      <div className="flex-1">
                                        <div
                                          onClick={() => {
                                            navigator.clipboard.writeText(customer.code);
                                          }}
                                          title="Click to copy"
                                          className="cursor-pointer hover:underline transition"
                                        >
                                          {customer.code}
                                        </div>
                                        <div>{customer.displayName}</div>
                                      </div>
                                      <div className="ml-auto flex flex-col justify-end items-end text-right">
                                        <div>Qty: {customer.qty}</div>
                                        <div>Size: {customer.size}</div>
                                      </div>
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                        <div className="p-3 border-t border-gray-200 bg-gray-200 text-center text-sm text-gray-700 flex justify-between rounded-md shadow-md">
                          <div className="text-left">
                            {cluster.customers.length} Customers <br />
                            {cluster.cartridge_qty} Cartridge Quantity
                          </div>
                          <div>
                            {Object.entries(cluster.size).map(([size, count]) => (
                              <div key={size}>
                                {size}: {count}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div> */}
                <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className={`${isVisible ? 'col-span-2 overflow-auto max-h-[65vh] scrollbar-thin' : 'col-span-3'}`}>
                    <div className={`grid gap-4 ${isVisible
                      ? 'grid-cols-1 md:grid-cols-1 lg:grid-cols-2'
                      : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
                      {data.slice(0, 7).map((cluster, index) => {
                        const clusterId = cluster.clusterId
                        return (
                          <div
                            key={index}
                            className="bg-white rounded-lg shadow-md w-full flex flex-col overflow-hidden"
                          >
                            <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white text-center text-lg font-semibold py-3 px-4">
                              {cluster.name} ({cluster.clusterName})
                            </div>
                            <Droppable droppableId={`${index}`}>
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.droppableProps}
                                  className="flex-1 overflow-y-auto max-h-[45vh] scrollbar-thin p-3 space-y-3 bg-gray-50"
                                >
                                  {cluster.customers.map((customer, idx) => {
                                    const clusterColor = clusterColors[index % clusterColors.length];
                                    return (
                                      <Draggable key={customer.code} draggableId={customer.code} index={idx}>
                                        {(provided, snapshot) => {
                                          const isFreezed = customer.isFreezed;
                                          return (
                                            <div
                                              ref={provided.innerRef}
                                              {...provided.draggableProps}
                                              {...provided.dragHandleProps}
                                              className={`flex items-center rounded-lg shadow-lg text-sm w-full text-start p-4 border-l-2 transition
                                                  ${snapshot.isDragging ? "bg-blue-50 shadow-md" : ""}
                                                  ${isFreezed
                                                  ? "bg-gray-200 text-gray-500 opacity-70 cursor-not-allowed"
                                                  : "bg-white hover:cursor-pointer"}`
                                              }
                                              style={{
                                                ...provided.draggableProps.style,
                                                borderLeftColor: clusterColor,
                                                color: isFreezed ? "gray" : clusterColor, // frozen text muted
                                              }}
                                            >
                                              <div className="pr-2 text-lg font-semibold">{idx + 1}.</div>
                                              <div className="flex-1">
                                                <div
                                                  onClick={() => {
                                                    if (!isFreezed) navigator.clipboard.writeText(customer.code);
                                                  }}
                                                  title={isFreezed ? "Frozen - cannot copy" : "Click to copy"}
                                                  className={`transition ${isFreezed ? "line-through cursor-not-allowed" : "cursor-pointer hover:underline"}`}
                                                >
                                                  {customer.code}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                  <span>{customer.displayName}</span>
                                                  {!customer.status && (
                                                    <span className="px-2 py-0.5 text-xs rounded-full font-medium bg-red-100 text-red-700">
                                                      Inactive
                                                    </span>
                                                  )}
                                                </div>
                                              </div>

                                              <div className="ml-auto flex flex-col justify-end items-end text-right">
                                                <div>Qty: {customer.qty}</div>
                                                <div>Size: {customer.size}</div>
                                              </div>
                                              <div>
                                                <EllipsisVerticalIcon
                                                  className="h-5 w-5 text-gray-900 cursor-pointer mx-2"
                                                  onClick={() => handleOpen(customer, clusterId)}
                                                />
                                              </div>
                                            </div>
                                          );
                                        }}
                                      </Draggable>
                                    );
                                  })}
                                  {provided.placeholder}
                                </div>
                              )}
                            </Droppable>
                            <div className="p-3 border-t border-gray-200 bg-gray-200 text-center text-sm text-gray-700 flex justify-between">
                              <div className="text-left">
                                {cluster.customers.length} Customers <br />
                                {cluster.cartridge_qty} Cartridge Quantity
                              </div>
                              <div>
                                {Object.entries(cluster.size).map(([size, count]) => (
                                  <div key={size}>
                                    {size}: {count}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {isVisible && (
                    <div className={`col-span-1 ${isVisible ? 'block' : 'hidden'} md:block`}>
                      <div className="flex flex-col gap-4">
                        {data.slice(7).map((cluster, index) => {
                          const actualIndex = index + 7;
                          const clusterColor = clusterColors[actualIndex % clusterColors.length];
                          return (
                            <div
                              key={actualIndex}
                              className="bg-white rounded-lg shadow-md w-full flex flex-col overflow-hidden"
                            >
                              <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white text-center text-lg font-semibold py-3 px-4">
                                {cluster.name} ({cluster.clusterName})
                              </div>
                              <Droppable droppableId={`${actualIndex}`}>
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className="flex-1 overflow-y-auto max-h-[50vh] scrollbar-thin p-3 space-y-3 bg-gray-50"
                                  >
                                    {cluster.customers.map((customer, idx) => (
                                      <Draggable key={customer.code} draggableId={customer.code} index={idx}>
                                        {(provided, snapshot) => (
                                          <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            className={`bg-white flex flex-col sm:flex-row sm:items-center rounded-lg shadow-lg text-sm hover:cursor-pointer w-full text-start p-3 sm:p-4 border-l-2 ${snapshot.isDragging ? 'bg-blue-50 shadow-md' : ''
                                              }`}
                                            style={{
                                              ...provided.draggableProps.style,
                                              borderLeftColor: clusterColor,
                                              color: clusterColor,
                                            }}
                                          >
                                            <div className="flex items-center gap-2 mb-2 sm:mb-0">
                                              <div className="text-lg font-semibold">{idx + 1}.</div>
                                              <div className="flex-1">
                                                <div
                                                  onClick={() => {
                                                    navigator.clipboard.writeText(customer.code);
                                                  }}
                                                  title="Click to copy"
                                                  className="cursor-pointer hover:underline transition font-medium"
                                                >
                                                  {customer.code}
                                                </div>
                                                <div className="text-sm text-gray-600">{customer.displayName}</div>
                                              </div>
                                            </div>
                                            <div className="flex justify-between sm:ml-auto sm:flex-col sm:justify-end sm:items-end sm:text-right">
                                              <div className="text-sm">Qty: {customer.qty}</div>
                                              <div className="text-sm">Size: {customer.size}</div>
                                            </div>
                                          </div>
                                        )}
                                      </Draggable>
                                    ))}
                                    {provided.placeholder}
                                  </div>
                                )}
                              </Droppable>
                              <div className="p-3 border-t border-gray-200 bg-gray-200 text-center text-sm text-gray-700 flex justify-between">
                                <div className="text-left">
                                  {cluster.customers.length} Customers <br />
                                  {cluster.cartridge_qty} Cartridge Quantity
                                </div>
                                <div>
                                  {Object.entries(cluster.size).map(([size, count]) => (
                                    <div key={size}>
                                      {size}: {count}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}


                  <button
                    onClick={() => setIsVisible((prev) => !prev)}
                    className="fixed md:bottom-2 lg:bottom-0 right-4 lg:absolute lg:top-1/2 lg:right-1 z-30 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white font-semibold rounded-lg p-2 shadow-lg transition text-xs md:text-sm lg:[writing-mode:sideways-lr] lg:[text-orientation:mixed]"
                  >
                    {isVisible ? 'Hide' : 'Show'} Unassigned Cluster
                  </button>
                </div>
              </DragDropContext>
            )}
          </div>
          {open && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              {/* Dark overlay */}
              <div
                className="absolute inset-0 bg-black bg-opacity-50"
                onClick={() => setOpen(false)}
              />

              {/* Modal box */}
              <div className="relative bg-white rounded-lg shadow-lg w-[90%] max-w-md p-6 z-10">
                {/* Close button (X) */}
                <button
                  onClick={() => setOpen(false)}
                  className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>

                <h2 className="text-lg font-semibold mb-4">Customer Details</h2>

                {selectedCustomer && (
                  <div className="space-y-2">
                    <p className="font-semibold">Do you want to freeze this customer?</p>
                    <p><span className="font-medium">Code:</span> {selectedCustomer.code}</p>
                    <p><span className="font-medium">Name:</span> {selectedCustomer.displayName}</p>
                    <p><span className="font-medium">Qty:</span> {selectedCustomer.qty}</p>
                    <p><span className="font-medium">Size:</span> {selectedCustomer.size}</p>
                    {/* Toggle Switch */}
                    <div className="flex items-center gap-3 mt-4">
                      <span className="font-medium">Freeze:</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedCustomer?.isFreezed || false}
                          onChange={() =>
                            setSelectedCustomer((prev) =>
                              prev ? { ...prev, isFreezed: !prev.isFreezed } : prev
                            )
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none 
                rounded-full peer peer-checked:after:translate-x-full 
                peer-checked:after:border-white after:content-[''] after:absolute 
                after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 
                after:border after:rounded-full after:h-5 after:w-5 
                after:transition-all peer-checked:bg-green-500"></div>
                      </label>
                    </div>
                    <p>
                      <span className="font-medium">Status:</span>{" "}
                      {selectedCustomer?.status ? "Active" : "Inactive"}
                    </p>
                    <div className="mt-4">
                      <label className="block text-sm font-semibold text-black">
                        Replacement Notes:
                      </label>
                      <textarea
                        value={selectedCustomer?.replaceMentNotes || ""}
                        onChange={(e) =>
                          setSelectedCustomer((prev) =>
                            prev ? { ...prev, replaceMentNotes: e.target.value } : prev
                          )
                        }
                        placeholder="Enter replacement notes"
                        className="mt-1 block w-full rounded-md border-black shadow-sm 
                   focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        rows={3}
                      />
                    </div>

                  </div>
                )}

                <div className="mt-6 flex justify-end gap-3">
                  <Button
                    variant="outlined"
                    color="red"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="gradient"
                    color="green"
                    onClick={handleConfirm}
                  >
                    {customerLoading ? "Saving..." : "Confirm"}
                  </Button>
                </div>
              </div>
            </div>
          )}

        </>
      )}
    </div>
  );
};

export default ClusterList;