import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Loader from "../Loader";
import { editCustomersClusterMap, getCustomersClusterMap, refreshCustomersClusterMap } from "@/feature/customer/customerSlice";
import { useDispatch, useSelector } from "react-redux";
import "./Home.css";
import { Button, Typography } from "@material-tailwind/react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const clusterColors = [
  "red", "blue", "green", "purple", "orange", "cyan", "magenta",
];

const customerIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

const FitBounds = ({ locations }) => {
  const map = useMap();
  useEffect(() => {
    if (locations.length > 0) {
      const bounds = locations.map((loc) => [loc.lat, loc.lng]);
      map.fitBounds(bounds);
    }
  }, [locations, map]);
  return null;
};

const MapCluster = () => {
  const dispatch = useDispatch();
  const { customersClusterMap, mapLoading } = useSelector((state) => state.customer);
  const [data, setData] = useState([]);
  const [showMap, setShowMap] = useState(false);

  const [technicians, setTechnicians] = useState([
    { _id: "tech1", name: "Technician A" },
    { _id: "tech2", name: "Technician B" },
    { _id: "tech3", name: "Technician C" },
  ]);
  const [selectedTechnician, setSelectedTechnician] = useState({});
  const [selectedDay, setSelectedDay] = useState({});

  useEffect(() => {
    dispatch(getCustomersClusterMap());
  }, [dispatch]);

  useEffect(() => {
    if (customersClusterMap?.length) {
      const formattedData = customersClusterMap.map(cluster => ({
        name: `Cluster ${cluster.clusterNo + 1}`,
        cartridge_qty: cluster.cartridge_qty,
        customers: cluster.customers.map(c => ({
          code: c.contact_number,
          customerId: c._id,
          displayName: c.display_name,
        })),
      }));
      setData(formattedData);
    }
  }, [customersClusterMap]);

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceClusterIndex = parseInt(source.droppableId);
    const destClusterIndex = parseInt(destination.droppableId);

    const newData = [...data];
    const [movedItem] = newData[sourceClusterIndex].customers.splice(source.index, 1);
    newData[destClusterIndex].customers.splice(destination.index, 0, movedItem);

    // newData[sourceClusterIndex].cartridge_qty = newData[sourceClusterIndex].customers.length;
    // newData[destClusterIndex].cartridge_qty = newData[destClusterIndex].customers.length;

    setData(newData);
  };

  const handleTechnicianChange = (clusterIndex, techId) => {
    setSelectedTechnician((prev) => ({ ...prev, [clusterIndex]: techId }));
  };

  const handleDayChange = (clusterIndex, day) => {
    setSelectedDay((prev) => ({ ...prev, [clusterIndex]: day }));
  };

  const refreshCluster = () => {
    dispatch(refreshCustomersClusterMap())
      .unwrap()
      .then(() => {
        dispatch(getCustomersClusterMap());
      })
      .catch((error) => {
        console.error('Refresh failed:', error);
      });
  };


  // const handleSave = () => {
  //   const reassignments = [];

  //   data.forEach((cluster, clusterIndex) => {
  //     cluster.customers.forEach(customer => {
  //       // Find the original cluster this customer belonged to
  //       const originalCluster = customersClusterMap.find(c =>
  //         c.customers.some(orig => orig._id === customer.customerId)
  //       );

  //       const originalClusterNo = originalCluster?.clusterNo;

  //       if (originalClusterNo !== clusterIndex) {
  //         reassignments.push({
  //           customerId: customer.customerId,
  //           newClusterNo: clusterIndex,
  //         });
  //       }
  //     });
  //   });

  //   dispatch(editCustomersClusterMap({ reassignments: { reassignments: reassignments } })).unwrap()
  //     .then(() => {
  //       dispatch(getCustomersClusterMap());
  //     })
  //     .catch((error) => {
  //       dispatch(getCustomersClusterMap());
  //     });
  // };


  const handleSave = () => {
    const technicianAssignments = [];
    const dayAssignments = [];
  
    // Iterate over the data (clusters)
    data.forEach((cluster, clusterIndex) => {
      const selectedTechId = selectedTechnician[clusterIndex];
      const selectedDayValue = selectedDay[clusterIndex];
  
      // Only add to the arrays if the technician and day are assigned
      if (selectedTechId || selectedDayValue) {
        const assignment = {
          clusterNo: clusterIndex, // Cluster number
          technicianId: selectedTechId || null, // Technician ID (null if not selected)
          day: selectedDayValue || null, // Day (null if not selected)
        };
  
        if (selectedTechId) {
          technicianAssignments.push(assignment);
        }
  
        if (selectedDayValue) {
          dayAssignments.push(assignment);
        }
      }
    });
  
    // Log the technician and day assignments
    console.log("Technician Assignments:", technicianAssignments);
    console.log("Day Assignments:", dayAssignments);
  
    // Optionally, if you want to send this data to the backend, combine them into one object
    const dataToSave = {
      technicianAssignments,
      dayAssignments,
    };
  
    // Assuming you have an API or Redux action to save the data
    dispatch(editCustomersClusterMap({ data: dataToSave }))
      .unwrap()
      .then(() => {
        dispatch(getCustomersClusterMap());  // Refresh the customer cluster map
      })
      .catch((error) => {
        console.error("Save failed:", error);
        dispatch(getCustomersClusterMap());  // Optionally refresh even on failure
      });
  };
  
  return (
    <div className="bg-clip-border rounded-xl bg-white text-gray-700 border border-blue-gray-100 mt-9 shadow-sm">
      {mapLoading ? (
        <div className="flex h-[80vh] items-center justify-center">
          <Loader />
        </div>
      ) : (
        <>
          <div className="p-4 border-blue-gray-100">
            <div className="mb-4 border rounded-lg p-2 px-3 flex items-center justify-between">
              <Typography variant="h5" color="blue-gray">
                Cluster {showMap ? "Map" : "List"}
              </Typography>
              <div className="flex gap-2">
                <Button size="sm" variant="outlined" onClick={() => setShowMap(!showMap)}>
                  {showMap ? "Show Customers" : "Show Map"}
                </Button>
                {!showMap && (
                  <>
                    <Button size="sm" variant="gradient" onClick={refreshCluster}>
                      Refresh Cluster
                    </Button>
                    <Button size="sm" variant="gradient" onClick={handleSave}>
                      Save
                    </Button>
                  </>
                )}
              </div>
            </div>

            {showMap ? (
              mapLoading ? (
                <div className="flex h-[80vh] items-center justify-center">
                  <Loader />
                </div>
              ) : (
                <div className="h-[80vh]">
                  <MapContainer center={[23.0225, 72.5714]} zoom={11} className="rounded-xl" style={{ height: "100%", width: "100%" }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <FitBounds
                      locations={
                        Array.isArray(customersClusterMap)
                          ? customersClusterMap
                            .flatMap(c => c.customers)
                            .filter(c => c.geoCoordinates?.coordinates?.length === 2)
                            .map(c => ({
                              lat: c.geoCoordinates.coordinates[1],
                              lng: c.geoCoordinates.coordinates[0],
                            }))
                          : []
                      }
                    />
                    {Array.isArray(customersClusterMap)
                      ? customersClusterMap.map((cluster) => {
                        const clusterColor = clusterColors[cluster.clusterNo % clusterColors.length];
                        return cluster.customers
                          .filter(c => c.geoCoordinates?.coordinates?.length === 2)
                          .map((cust, idx) => {
                            const lat = cust.geoCoordinates.coordinates[1];
                            const lng = cust.geoCoordinates.coordinates[0];
                            return (
                              <React.Fragment key={`${cust._id}-${idx}`}>
                                <Circle
                                  center={[lat, lng]}
                                  radius={500}
                                  pathOptions={{ color: clusterColor, fillOpacity: 0.3 }}
                                />
                                <Marker position={[lat, lng]} icon={customerIcon}>
                                <Popup>
                                  <div style={{ backgroundColor: clusterColor, padding: '5px', borderRadius: '4px', color: '#fff' }}>
                                    <strong>{cust.display_name}</strong> <br />
                                    {cust.contact_number}
                                  </div>
                                </Popup>
                                </Marker>
                              </React.Fragment>
                            );
                          });
                      })
                      : null}
                  </MapContainer>
                </div>
              )
            ) : (
              <DragDropContext onDragEnd={onDragEnd}>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                  {data.map((cluster, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-md min-w-[23vw] max-w-[320px] flex flex-col overflow-hidden">
                      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white text-center text-lg font-semibold py-3 px-4">
                        {cluster.name}
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
                                      className={`bg-white rounded-md text-sm hover:cursor-pointer w-full text-start p-4 border-l-2 ${snapshot.isDragging ? "bg-blue-50 shadow-md" : ""}`}
                                      style={{
                                        ...provided.draggableProps.style,
                                        borderLeftColor: clusterColor,
                                        color: clusterColor,
                                      }}
                                    >
                                      {customer.code} <br />
                                      {customer.displayName}
                                    </div>
                                  )}
                                </Draggable>
                              );
                            })}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>

                      <div className="px-3 pt-2 pb-3 bg-gray-100 border-t mt-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">
                              Assign Technician
                            </label>
                            <select
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                              value={selectedTechnician[index] || ""}
                              onChange={(e) => handleTechnicianChange(index, e.target.value)}
                            >
                              <option value="">Select Technician</option>
                              {technicians.map((tech) => (
                                <option key={tech._id} value={tech._id}>
                                  {tech.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">
                              Assign Day
                            </label>
                            <select
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                              value={selectedDay[index] || ""}
                              onChange={(e) => handleDayChange(index, e.target.value)}
                            >
                              <option value="">Select Day</option>
                              {[
                                "monday",
                                "tuesday",
                                "wednesday",
                                "thursday",
                                "friday",
                                "saturday",
                              ].map((day) => (
                                <option key={day} value={day}>
                                  {day.charAt(0).toUpperCase() + day.slice(1)}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>


                      <div className="p-3 border-t border-gray-200 bg-gray-200 text-center text-sm text-gray-700">
                        {cluster.customers.length} Customers <br />
                        {cluster.cartridge_qty} Cartridge Quantity
                      </div>
                    </div>
                  ))}
                </div>
              </DragDropContext>
            )}
          </div>
        </>
      )}
    </div>
  );

};

export default MapCluster;
