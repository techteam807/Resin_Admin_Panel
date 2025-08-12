import React from 'react';
import { Button, Input, Option, Select, Typography } from '@material-tailwind/react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { XMarkIcon, MagnifyingGlassIcon, } from '@heroicons/react/24/solid';
import Loader from '@/pages/Loader';

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
}) => {

  return (
    <div>
      {saveLoading ? (
        <div className="flex items-center justify-center h-[80vh]">
          <Loader />
        </div>
      ) : (
        <>
          <div className="mt-2 rounded-lg p-2 px-3 flex items-center justify-between">
            <Typography variant="h5" color="blue-gray">
              Cluster List
            </Typography>
            <div className="flex items-center gap-2">
              <div>
                <Select label="Select Vehicle" onChange={handleVehicleSelect} value={selectedVehicle}>
                  {vehicles.map((vehicle) => (
                    <Option key={vehicle.id} value={vehicle.id}>
                      {vehicle.name}
                    </Option>
                  ))}
                </Select>
              </div>
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
              <div className="flex gap-2">
                <Button size="sm" variant="gradient" onClick={handleSave} className='p-3 px-4'>
                  Save
                </Button>
              </div>
            </div>
          </div>
        
      <hr className="mt-2" />
      <div className="overflow-auto max-h-[70vh] mt-4 scrollbar-thin">
        {mapLoading1 || data.length === 0 ? (
          <div className="flex h-[70vh] items-center justify-center">
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
            <div className="w-full grid grid-cols-3 gap-4 ">
              <div className={`${isVisible ? 'col-span-2 overflow-auto max-h-screen scrollbar-thin' : 'col-span-3'}`}>
                <div className={`grid gap-4 ${isVisible ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-3'}`}>
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
                                      className={`bg-white flex items-center rounded-lg shadow-lg text-sm hover:cursor-pointer w-full text-start p-4 border-l-2 ${snapshot.isDragging ? 'bg-blue-50 shadow-md' : ''
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

              {isVisible && (
                <div className="col-span-1 sticky top-0 self-start">
                  <div className="flex flex-col gap-4">
                    {data.slice(7).map((cluster, index) => {
                      const actualIndex = index + 7;
                      const clusterColor = clusterColors[actualIndex % clusterColors.length];
                      return (
                        <div
                          key={actualIndex}
                          className="bg-white rounded-b-lg shadow-lg min-w-[23vw] max-w-[320px] flex flex-col max-h-[70vh]"
                        >
                          <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white text-center text-lg font-semibold py-3 px-4 relative rounded-t-md">
                            {cluster.name} ({cluster.clusterName})
                          </div>
                          <Droppable droppableId={`${actualIndex}`}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className="bg-gray-50 shadow-md min-w-[23vw] max-w-[320px] flex flex-col overflow-auto p-3 space-y-3 scrollbar-thin"
                              >
                                {cluster.customers.map((customer, idx) => (
                                  <Draggable key={customer.code} draggableId={customer.code} index={idx}>
                                    {(provided, snapshot) => (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className={`bg-white flex items-center rounded-lg shadow-lg text-sm hover:cursor-pointer w-full text-start p-4 border-l-2 ${snapshot.isDragging ? 'bg-blue-50 shadow-md' : ''
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
                </div>
              )}

              <button
                style={{ writingMode: 'sideways-lr', textOrientation: 'mixed' }}
                onClick={() => setIsVisible((prev) => !prev)}
                className="absolute top-1/2 right-1 z-30 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white font-semibold rounded-lg p-2 shadow-lg transition text-xs"
              >
                {isVisible ? 'Hide' : 'Show'} Unassigned Cluster
              </button>
            </div>
          </DragDropContext>
        )}
      </div>
      </>
      )}
    </div>
  );
};

export default ClusterList;