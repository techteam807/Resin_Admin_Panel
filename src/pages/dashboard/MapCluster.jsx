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
  const { customersClusterMap, mapLoading, refreshLoading } = useSelector((state) => state.customer);
  const [data, setData] = useState([]);

  console.log("refreshLoading", refreshLoading)

  useEffect(() => {
    dispatch(getCustomersClusterMap());
  }, [dispatch]);

  useEffect(() => {
    if (customersClusterMap?.length) {
      const formattedData = customersClusterMap.map(cluster => ({
        name: `Cluster ${cluster.clusterNo + 1}`,
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

    setData(newData);
  };

  const refreshCluster = () => {
    dispatch(refreshCustomersClusterMap()).unwrap()
    dispatch(getCustomersClusterMap());
  }

  const handleSave = () => {
    const reassignments = [];

    data.forEach((cluster, clusterIndex) => {
      cluster.customers.forEach(customer => {
        // Find the original cluster this customer belonged to
        const originalCluster = customersClusterMap.find(c =>
          c.customers.some(orig => orig._id === customer.customerId)
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

    console.log("Reassignments:", reassignments);

    // dispatch your update action here
    dispatch(editCustomersClusterMap({ reassignments: { reassignments: reassignments } })).unwrap();
    dispatch(getCustomersClusterMap());
  };


  return (
    <div className="bg-clip-border rounded-xl bg-white text-gray-700 border border-blue-gray-100 mt-9 shadow-sm">
       {refreshLoading ? (
        <div className="flex h-[80vh] items-center justify-center">
          <Loader />
        </div>
      ) : (
        <>
      <div className="p-4 overflow-x-auto border-blue-gray-100">
        <div className="mb-4 border rounded-lg p-2 px-3 flex items-center justify-between">
          <div>
            <Typography variant="h5" color="blue-gray">
              Cluster List
            </Typography>
          </div>
          <div className="flex gap-2">
            <div>
              <Button size="md" variant="gradient" onClick={refreshCluster}>
                Refresh Cluster
              </Button>
            </div>
            <div>
              <Button size="md" variant="gradient" onClick={handleSave}>
                Save
              </Button>
            </div>
          </div>
        </div>

        <DragDropContext onDragEnd={onDragEnd} >
          <div className="flex gap-6 w-max">
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
                      {cluster.customers.map((customer, idx) => (
                        // <Draggable
                        //   key={customer.code}
                        //   draggableId={customer.code}
                        //   index={idx}
                        // >
                        //   {(provided, snapshot) => (
                        //     <div
                        //       ref={provided.innerRef}
                        //       {...provided.draggableProps}
                        //       {...provided.dragHandleProps}
                        //       className={`bg-white rounded-md text-sm hover:cursor-pointer w-full text-start p-4 border-l-2 border-black ${snapshot.isDragging
                        //         ? "bg-blue-50 shadow-md"
                        //         : ""
                        //         }`}
                        //     >
                        //       {customer.code} <br />
                        //       {customer.displayName}
                        //     </div>
                        //   )}
                        // </Draggable>

                        <Draggable
                          key={customer.code}
                          draggableId={customer.code}
                          index={idx}
                        >
                          {(provided, snapshot) => {
                            const clusterColor = clusterColors[index % clusterColors.length];

                            return (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`bg-white rounded-md text-sm hover:cursor-pointer w-full text-start p-4 border-l-2 ${snapshot.isDragging ? "bg-blue-50 shadow-md" : ""}`}
                                style={{
                                  ...provided.draggableProps.style, // keep drag styles
                                  borderLeftColor: clusterColor,
                                  color: clusterColor,
                                }}
                              >
                                {customer.code} <br />
                                {customer.displayName}
                              </div>
                            );
                          }}
                        </Draggable>

                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>

                <div className="p-3 border-t border-gray-200 bg-gray-200 text-center text-sm text-gray-700">
                  {cluster.customers.length} customers
                </div>
              </div>
            ))}
          </div>
        </DragDropContext>
      </div>

      {mapLoading ? (
        <div className="flex h-[80vh] items-center justify-center">
          <Loader />
        </div>
      ) : (
        <div className="h-[80vh] mt-28">
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
                            <div>
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
      )}
      </>
    )}
    </div>
  );
};

export default MapCluster;
