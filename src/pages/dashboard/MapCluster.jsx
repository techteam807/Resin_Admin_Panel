// import React, { useEffect, useState } from "react";
// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   Popup,
//   Circle,
//   useMap,
// } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import L from "leaflet";
// import Loader from "../Loader";
// import { editCustomersClusterMap, getCustomersClusterMap, refreshCustomersClusterMap } from "@/feature/customer/customerSlice";
// import { useDispatch, useSelector } from "react-redux";
// import "./Home.css";
// import { Button, Typography } from "@material-tailwind/react";
// import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

// const clusterColors = [
//   "red", "blue", "green", "purple", "orange", "cyan", "magenta",
// ];

// const customerIcon = new L.Icon({
//   iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
//   iconSize: [30, 30],
//   iconAnchor: [15, 30],
//   popupAnchor: [0, -30],
// });

// const FitBounds = ({ locations }) => {
//   const map = useMap();
//   useEffect(() => {
//     if (locations.length > 0) {
//       const bounds = locations.map((loc) => [loc.lat, loc.lng]);
//       map.fitBounds(bounds);
//     }
//   }, [locations, map]);
//   return null;
// };

// const MapCluster = () => {
//   const dispatch = useDispatch();
//   const { customersClusterMap, mapLoading, refreshLoading, refreshData, updatedcustomersClusterMap } = useSelector((state) => state.customer);
//   const [data, setData] = useState([]);
//   const [showMap, setShowMap] = useState(false);

//   useEffect(() => {
//     dispatch(getCustomersClusterMap());
//   }, [dispatch]);

//   useEffect(() => {
//     if (customersClusterMap?.length) {
//       const formattedData = customersClusterMap.map(cluster => ({
//         name: `Cluster ${cluster.clusterNo + 1}`,
//         cartridge_qty: cluster.cartridge_qty,
//         customers: cluster.customers.map(c => ({
//           code: c.contact_number,
//           customerId: c._id,
//           displayName: c.display_name,
//         })),
//       }));
//       setData(formattedData);
//     }
//   }, [customersClusterMap]);

//   const onDragEnd = (result) => {
//     const { source, destination } = result;
//     if (!destination) return;

//     const sourceClusterIndex = parseInt(source.droppableId);
//     const destClusterIndex = parseInt(destination.droppableId);

//     const newData = [...data];
//     const [movedItem] = newData[sourceClusterIndex].customers.splice(source.index, 1);
//     newData[destClusterIndex].customers.splice(destination.index, 0, movedItem);

//     // newData[sourceClusterIndex].cartridge_qty = newData[sourceClusterIndex].customers.length;
//     // newData[destClusterIndex].cartridge_qty = newData[destClusterIndex].customers.length;

//     setData(newData);
//   };

//   const refreshCluster = () => {
//     dispatch(refreshCustomersClusterMap())
//       .unwrap()
//       .then(() => {
//           dispatch(getCustomersClusterMap());
//       })
//       .catch((error) => {
//         console.error('Refresh failed:', error);
//       });
//   };


//   const handleSave = () => {
//     const reassignments = [];

//     data.forEach((cluster, clusterIndex) => {
//       cluster.customers.forEach(customer => {
//         // Find the original cluster this customer belonged to
//         const originalCluster = customersClusterMap.find(c =>
//           c.customers.some(orig => orig._id === customer.customerId)
//         );

//         const originalClusterNo = originalCluster?.clusterNo;

//         if (originalClusterNo !== clusterIndex) {
//           reassignments.push({
//             customerId: customer.customerId,
//             newClusterNo: clusterIndex,
//           });
//         }
//       });
//     });

//     dispatch(editCustomersClusterMap({ reassignments: { reassignments: reassignments } })).unwrap()
//     .then(() => {
//       dispatch(getCustomersClusterMap());
//   })
//   .catch((error) => {
//     dispatch(getCustomersClusterMap());
//   });
//   };


//   return (
//     <div className="bg-clip-border rounded-xl bg-white text-gray-700 border border-blue-gray-100 mt-9 shadow-sm">
//       {mapLoading ? (
//         <div className="flex h-[80vh] items-center justify-center">
//           <Loader />
//         </div>
//       ) : (
//         <>
//           <div className="p-4 border-blue-gray-100">
//             <div className="mb-4 border rounded-lg p-2 px-3 flex items-center justify-between">
//               <Typography variant="h5" color="blue-gray">
//                 Cluster {showMap ? "Map" : "List"}
//               </Typography>
//               <div className="flex gap-2">
//                 <Button size="sm" variant="outlined" onClick={() => setShowMap(!showMap)}>
//                   {showMap ? "Show Customers" : "Show Map"}
//                 </Button>
//                 {!showMap && (
//                   <>
//                     <Button size="sm" variant="gradient" onClick={refreshCluster}>
//                       Refresh Cluster
//                     </Button>
//                     <Button size="sm" variant="gradient" onClick={handleSave}>
//                       Save
//                     </Button>
//                   </>
//                 )}
//               </div>
//             </div>

//             {showMap ? (
//               mapLoading ? (
//                 <div className="flex h-[80vh] items-center justify-center">
//                   <Loader />
//                 </div>
//               ) : (
//                 <div className="h-[80vh]">
//                   <MapContainer center={[23.0225, 72.5714]} zoom={11} className="rounded-xl" style={{ height: "100%", width: "100%" }}>
//                     <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//                     <FitBounds
//                       locations={
//                         Array.isArray(customersClusterMap)
//                           ? customersClusterMap
//                               .flatMap(c => c.customers)
//                               .filter(c => c.geoCoordinates?.coordinates?.length === 2)
//                               .map(c => ({
//                                 lat: c.geoCoordinates.coordinates[1],
//                                 lng: c.geoCoordinates.coordinates[0],
//                               }))
//                           : []
//                       }
//                     />
//                     {Array.isArray(customersClusterMap)
//                       ? customersClusterMap.map((cluster) => {
//                           const clusterColor = clusterColors[cluster.clusterNo % clusterColors.length];
//                           return cluster.customers
//                             .filter(c => c.geoCoordinates?.coordinates?.length === 2)
//                             .map((cust, idx) => {
//                               const lat = cust.geoCoordinates.coordinates[1];
//                               const lng = cust.geoCoordinates.coordinates[0];
//                               return (
//                                 <React.Fragment key={`${cust._id}-${idx}`}>
//                                   <Circle
//                                     center={[lat, lng]}
//                                     radius={500}
//                                     pathOptions={{ color: clusterColor, fillOpacity: 0.3 }}
//                                   />
//                                   <Marker position={[lat, lng]} icon={customerIcon}>
//                                   <Popup>
//                                   <div style={{ backgroundColor: clusterColor, padding: '5px', borderRadius: '4px', color: '#fff' }}>
//                                     <strong>{cust.display_name}</strong> <br />
//                                     {cust.contact_number}
//                                   </div>
//                                 </Popup>
//                                   </Marker>
//                                 </React.Fragment>
//                               );
//                             });
//                         })
//                       : null}
//                   </MapContainer>
//                 </div>
//               )
//             ) : (
//               <DragDropContext onDragEnd={onDragEnd}>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
//                   {data.map((cluster, index) => (
//                     <div key={index} className="bg-white rounded-lg shadow-md min-w-[23vw] max-w-[320px] flex flex-col overflow-hidden">
//                       <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white text-center text-lg font-semibold py-3 px-4">
//                         {cluster.name}
//                       </div>

//                       <Droppable droppableId={`${index}`}>
//                         {(provided) => (
//                           <div
//                             ref={provided.innerRef}
//                             {...provided.droppableProps}
//                             className="flex-1 overflow-y-auto max-h-[45vh] scrollbar-thin p-3 space-y-3 bg-gray-50"
//                           >
//                             {cluster.customers.map((customer, idx) => {
//                               const clusterColor = clusterColors[index % clusterColors.length];
//                               return (
//                                 <Draggable key={customer.code} draggableId={customer.code} index={idx}>
//                                   {(provided, snapshot) => (
//                                     <div
//                                       ref={provided.innerRef}
//                                       {...provided.draggableProps}
//                                       {...provided.dragHandleProps}
//                                       className={`bg-white rounded-md text-sm hover:cursor-pointer w-full text-start p-4 border-l-2 ${snapshot.isDragging ? "bg-blue-50 shadow-md" : ""}`}
//                                       style={{
//                                         ...provided.draggableProps.style,
//                                         borderLeftColor: clusterColor,
//                                         color: clusterColor,
//                                       }}
//                                     >
//                                       {customer.code} <br />
//                                       {customer.displayName}
//                                     </div>
//                                   )}
//                                 </Draggable>
//                               );
//                             })}
//                             {provided.placeholder}
//                           </div>
//                         )}
//                       </Droppable>

//                       <div className="p-3 border-t border-gray-200 bg-gray-200 text-center text-sm text-gray-700">
//                         {cluster.customers.length} Customers <br />
//                         {cluster.cartridge_qty} Cartridge Quantity
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </DragDropContext>
//             )}
//           </div>
//         </>
//       )}
//     </div>
//   );

// };

// export default MapCluster;

import React, { useEffect, useRef, useState } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  Circle,
  InfoWindow,
  OverlayView,
  DirectionsRenderer
} from "@react-google-maps/api";
import { useDispatch, useSelector } from "react-redux";
import {
  editCustomersClusterMap,
  getCustomersClusterMap,
  refreshCustomersClusterMap,
  fetchClusterRoute,
} from "@/feature/customer/customerSlice";
import Loader from "../Loader";
import { Button, Option, Select, Typography } from "@material-tailwind/react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
// import "./Home.css";

const clusterColors = [
  "red",
  "blue",
  "green",
  "purple",
  "orange",
  "cyan",
  "magenta",
];

const LIBRARIES = ["places"];
const containerStyle = {
  width: "100%",
  height: "80vh",
};

const center = { lat: 23.09762579093222, lng: 72.54794212155194 };

const MapCluster = () => {
  const dispatch = useDispatch();

  const mapRef = useRef(null);

  /* === 1. keep a handle to the map === */
  const handleMapLoad = (map) => {
    mapRef.current = map;
  };


  const { customersClusterMap, mapLoading1, mapLoading, clusteroute, loading } = useSelector(
    (state) => state.customer
  );

  console.log("cr:", clusteroute)
  console.log("mapLoading1", mapLoading1);

  console.log("customersClusterMap", customersClusterMap);

  const [data, setData] = useState([]);
  const [showMap, setShowMap] = useState(false);
  const [selected, setSelected] = useState(null);
  const [selectedCluster, setSelectedCluster] = useState('');
  const [showRoute, setShowRoute] = useState(false);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  console.log("dir:", directionsResponse);

  const [selectedMarker, setSelectedMarker] = useState(null);
  console.log("mark:", selectedMarker);


  console.log(selectedCluster);


  console.log("data", data);


  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES,
  });

  useEffect(() => {
    if (showMap) {
      dispatch(getCustomersClusterMap());
    }
  }, [dispatch, showMap]);

  useEffect(() => {
    dispatch(getCustomersClusterMap());
  }, [dispatch]);

  useEffect(() => {
    if (!mapRef.current || !data.length) return;

    const bounds = new window.google.maps.LatLngBounds();
    data.forEach((cl) =>
      cl.customers.forEach((cu) => {
        if (!isNaN(cu.lat) && !isNaN(cu.lng)) {
          bounds.extend({ lat: cu.lat, lng: cu.lng });
        }
      })
    );
    if (!bounds.isEmpty()) mapRef.current.fitBounds(bounds);
  }, [data]);

  useEffect(() => {
    // while the request is in‑flight make the list empty
    if (mapLoading1) {
      setData([]);
      return;
    }

    // once loading is finished, format what came back
    if (customersClusterMap?.length) {
      const formatted = customersClusterMap.map((cluster) => ({
        clusterNo: cluster.clusterNo,
        name: `Cluster ${cluster.clusterNo + 1}`,
        cartridge_qty: cluster.cartridge_qty,
        customers: cluster.customers.map((c) => ({
          code: c.contact_number,
          customerId: c.customerId,
          displayName: c.name,
          vistSequnceNo: c.sequenceNo,
          lat: Number(c.geoCoordinates?.coordinates[1]),
          lng: Number(c.geoCoordinates?.coordinates[0]),
        })),
      }));
      setData(formatted);
    } else {
      setData([]);          // nothing came back ⇒ empty
    }
  }, [mapLoading1, customersClusterMap]);




  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceClusterIndex = parseInt(source.droppableId);
    const destClusterIndex = parseInt(destination.droppableId);

    const newData = [...data];
    const [movedItem] = newData[sourceClusterIndex].customers.splice(
      source.index,
      1
    );
    newData[destClusterIndex].customers.splice(destination.index, 0, movedItem);

    setData(newData);
  };

  const refreshCluster = () => {
    dispatch(refreshCustomersClusterMap())
      .unwrap()
      .then(() => {
        dispatch(getCustomersClusterMap());
      })
      .catch((error) => {
        console.error("Refresh failed:", error);
      });
  };

  const handleSave = () => {
    const reassignments = [];

    data.forEach((cluster, clusterIndex) => {
      cluster.customers.forEach((customer) => {
        const originalCluster = customersClusterMap.find((c) =>
          c.customers.some((orig) => orig._id === customer.customerId)
        );
        const originalClusterNo = originalCluster?.clusterNo;

        if (originalClusterNo !== clusterIndex) {
          reassignments.push({
            customerId: customer.customerId,
            newClusterNo: clusterIndex,
          });
        }
      });
    });

    dispatch(editCustomersClusterMap({ reassignments: { reassignments } }))
      .unwrap()
      .then(() => {
        dispatch(getCustomersClusterMap());
      })
      .catch(() => {
        dispatch(getCustomersClusterMap());
      });
  };

  const handleClusterSelect = (value) => {
    console.log(value, ":valus");

    const clusterNo = value;
    setSelectedCluster(clusterNo);
    setShowRoute(true);

    if (!isNaN(clusterNo)) {
      dispatch(fetchClusterRoute(clusterNo));
    }
  };

  useEffect(() => {
    if (selectedCluster === '') {
      setDirectionsResponse(null);
      return;
    }

    const cluster = clusteroute.find(
      (c) => String(c.clusterNo) === String(selectedCluster)
    );
    console.log("uc:", cluster);


    if (!cluster || !cluster.visitSequence) {
      setDirectionsResponse(null);
      return;
    }

    const customerPoints = cluster.visitSequence.filter(
      (p) => p.customerName?.trim().toLowerCase() !== "warehouse" &&
        p.customerName?.trim().toLowerCase() !== "return to warehouse"
    );

    console.log("ucp:", customerPoints);


    if (customerPoints.length < 2) {
      setDirectionsResponse(null);
      return;
    }

    const origin = customerPoints[0];
    const destination = customerPoints[customerPoints.length - 1];
    const waypoints = customerPoints.slice(1, -1).map((p) => ({
      location: { lat: p.lat, lng: p.lng },
      stopover: true,
    }));

    console.log("way:", waypoints);


    const service = new window.google.maps.DirectionsService();
    service.route(
      {
        origin: { lat: origin.lat, lng: origin.lng },
        destination: { lat: destination.lat, lng: destination.lng },
        waypoints,
        travelMode: "DRIVING",
      },
      (result, status) => {
        if (status === "OK") {
          setDirectionsResponse(result);
        } else {
          console.warn("Directions error:", status);
          setDirectionsResponse(null);
        }
      }
    );
  }, [selectedCluster, clusteroute]);



  if (!isLoaded) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="bg-clip-border rounded-xl bg-white text-gray-700 border border-blue-gray-100 mt-9 shadow-sm">
      {mapLoading1 || mapLoading ? (
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
                {showMap && (
                  <>
                    <Select label="Select Cluster" onChange={handleClusterSelect}>
                      {data.map((item, index) => {
                        const color = clusterColors[index % clusterColors.length];
                        return (
                          <Option key={item.clusterNo} value={item.clusterNo}>
                            <span className="inline-block w-3 h-3 rounded-full mr-2" style={{ backgroundColor: color }} />
                            {item.name}
                          </Option>
                        );
                      })}
                    </Select>
                  </>
                )}
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
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={10}
                // onLoad={(map) => {
                //   const bounds = new window.google.maps.LatLngBounds();
                //   data.forEach((cl) =>
                //     cl.customers.forEach((cu) => {
                //       if (!isNaN(cu.lat) && !isNaN(cu.lng)) {
                //         bounds.extend({ lat: cu.lat, lng: cu.lng });
                //       }
                //     })
                //   );
                //   if (!bounds.isEmpty()) map.fitBounds(bounds);
                // }}
                onLoad={handleMapLoad}
                onClick={() => setSelected(null)}
              >
                {showRoute ?
                  (
                    //show routes
                    clusteroute.map((cluster, index) => {
                      const clusterColor = clusterColors[index % clusterColors.length];

                      return cluster.visitSequence.map((point, idx) => {
                        const isWarehouse =
                          point.customerName === "Warehouse" ||
                          point.customerName === "Return to Warehouse";

                        return (
                          <React.Fragment key={`${cluster.clusterNo}-${idx}`}>
                            {!isWarehouse && (
                              <Circle
                                center={{ lat: point.lat, lng: point.lng }}
                                radius={10}
                                options={{
                                  strokeColor: clusterColor,
                                  fillColor: clusterColor,
                                  strokeOpacity: 0.8,
                                  fillOpacity: 0.2,
                                }}
                              />
                            )}
                            <Marker
                              position={{ lat: point.lat, lng: point.lng }}
                              onClick={() => setSelectedMarker(point)}
                              icon={{
                                url: isWarehouse
                                  ? "https://maps.google.com/mapfiles/ms/icons/red-dot.png"
                                  : "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                                scaledSize: new window.google.maps.Size(32, 32),
                              }}
                            />
                          </React.Fragment>
                        );
                      });
                    })
                  ) : (
                    // show clusters
                    data.map((cluster, clusterIndex) => {
                      const clusterColor =
                        clusterColors[clusterIndex % clusterColors.length];

                      return cluster.customers
                        .filter((cust) => !isNaN(cust.lat) && !isNaN(cust.lng))
                        .map((cust) => (
                          <React.Fragment key={cust.customerId}>
                            <Circle
                              center={{ lat: cust.lat, lng: cust.lng }}
                              radius={500}
                              options={{
                                strokeColor: clusterColor,
                                fillColor: clusterColor,
                                strokeOpacity: 0.8,
                                fillOpacity: 0.25,
                                strokeWeight: 1,
                                clickable: false,
                                zIndex: 0,
                              }}
                            />
                            <Marker
                              position={{ lat: cust.lat, lng: cust.lng }}
                              onClick={() => setSelected({ ...cust, clusterColor })}
                              icon={{
                                url: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
                                scaledSize: new window.google.maps.Size(30, 30),
                                anchor: new window.google.maps.Point(15, 30),
                              }}
                            />
                            <span>hello</span>
                          </React.Fragment>
                        ));
                    })
                  )}

                {/* {selected && (
                  <InfoWindow
                    position={{ lat: selected.lat, lng: selected.lng }}
                    onCloseClick={() => setSelected(null)}
                  >
                    <div
                      style={{
                        background: selected.clusterColor,
                        color: "#fff",
                        padding: 6,
                        borderRadius: 4,
                        lineHeight: 1.3,
                      }}
                    >
                      <strong>{selected.displayName}</strong>
                      <br />
                      {selected.code}
                    </div>
                  </InfoWindow>
                )} */}


                {directionsResponse && (
                  <DirectionsRenderer
                    directions={directionsResponse}
                    options={{
                      polylineOptions: {
                        strokeColor: clusterColors[selectedCluster % clusterColors.length],
                        strokeOpacity: 0.8,
                        strokeWeight: 5,
                      },
                    }}
                  />
                )}

                {selectedMarker && (
                  <InfoWindow
                    position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
                    onCloseClick={() => setSelectedMarker(null)}
                  >
                    <div>
                      <h4>{selectedMarker.customerName}</h4>
                      <p>
                        Lat: {selectedMarker.lat}, Lng: {selectedMarker.lng}
                      </p>
                    </div>
                  </InfoWindow>
                )}
                {selected && (
                  <OverlayView
                    position={{ lat: selected.lat, lng: selected.lng }}
                    mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                    onClick={() => setSelected(null)}
                  >
                    <div
                      style={{
                        background: selected.clusterColor,
                        minWidth: 160,
                        maxWidth: 260,
                        color: "#fff",
                        padding: "6px 10px",
                        borderRadius: 6,
                        lineHeight: 1.4,
                        cursor: "pointer",
                        userSelect: "none",
                        whiteSpace: "normal",   // allow wrapping
                        wordBreak: "break-word", // prevent long words from breaking layout
                        boxShadow: "0 2px 6px rgba(0,0,0,.3)",
                      }}
                    >
                      <strong>{selected.displayName}</strong>
                      <br />
                      {selected.code}
                    </div>
                  </OverlayView>
                )}

              </GoogleMap>
            ) : (
              <DragDropContext onDragEnd={onDragEnd}>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                  {data.map((cluster, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg shadow-md min-w-[23vw] max-w-[320px] flex flex-col overflow-hidden"
                    >
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
                                <Draggable
                                  key={customer.code}
                                  draggableId={customer.code}
                                  index={idx}
                                >
                                  {(provided, snapshot) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className={`bg-white rounded-md text-sm hover:cursor-pointer w-full text-start p-4 border-l-2 ${snapshot.isDragging ? "bg-blue-50 shadow-md" : ""
                                        }`}
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