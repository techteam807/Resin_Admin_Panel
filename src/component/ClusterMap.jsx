import React, { useMemo, useState } from 'react';
import {
  GoogleMap,
  Marker,
  Circle,
  OverlayView,
  useLoadScript,
} from '@react-google-maps/api';
import { Select, Option, Typography } from '@material-tailwind/react';
import Loader from '@/pages/Loader';

const clusterColors = [
  'red',
  'blue',
  'green',
  'purple',
  'orange',
  'cyan',
  'magenta',
  'SteelBlue',
];

const LIBRARIES = ['places'];

const containerStyle = {
  width: '100%',
  height: '75vh',
};

const defaultCenter = { lat: 23.09762579093222, lng: 72.54794212155194 };

const ClusterMap = ({
  data,
  selected,
  setSelected,
  selectedVehicle,
  handleVehicleSelect,
  vehicles,
  handleMapLoad,
  clusterDrop,
  selectedClusterId,
  setSelectedClusterId,
  selectedClusterNumber,
  setSelectedClusterNumber,
}) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES,
  });

  console.log("data:",data);
  

  // Assign color to each cluster
  const clusterColorMap = useMemo(() => {
    const map = {};
    data.forEach((cluster, index) => {
      map[cluster.clusterId] = clusterColors[index % clusterColors.length];
    });
    return map;
  }, [data]);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-[80vh] text-gray-500">
        <Loader />
      </div>
    );
  }

  return (
    <>
    <div className="rounded-lg p-3 sm:p-4 flex flex-col gap-4 sm:gap-3 lg:flex-row lg:items-center lg:justify-between mb-2">
            <Typography variant="h5" color="blue-gray" className="text-center lg:text-left">
              Cluster Map
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
              <div className="w-full sm:w-48 lg:w-56">
                <Select label="Select Cluster" 
                 value={selectedClusterNumber}
                  onChange={(value) => {
                setSelectedClusterNumber(value);

                // find the selected cluster's number
                const cluster = clusterDrop.find(c => c._id === value);
                if (cluster) {
                  setSelectedClusterNumber(cluster.clusterNo); // 👈 set cluster number
                }
              }}
              disabled={!selectedVehicle}
              className={selectedVehicle ? 'bg-white' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}
              >
                  {clusterDrop.map((c) => (
                    <Option key={c._id} value={c.clusterNo}>
                      Cluster {c.clusterNo} - ({c.clusterName})
                    </Option>
                  ))}
                </Select>
              </div>
            </div>
          </div>
    <div className="relative w-full h-[75vh]">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={defaultCenter}
        zoom={10}
        onLoad={handleMapLoad}
        onClick={() => setSelected(null)}
      >
        {data
          .filter((cluster) => cluster.customers?.length > 0)
          // .filter((cluster) => !selectedClusterId || cluster.clusterId === selectedClusterId) 
          .map((cluster) => {
            const clusterColor = clusterColorMap[cluster.clusterId];

            return cluster.customers.map((cust, idx) => (
              <React.Fragment key={cust.customerId || `${cluster._id}-${idx}`}>
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
                    url: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
                    scaledSize: new window.google.maps.Size(30, 30),
                    anchor: new window.google.maps.Point(15, 30),
                  }}
                />
              </React.Fragment>
            ));
          })}


        {selected && (
          <OverlayView
            position={{ lat: selected.lat, lng: selected.lng }}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
          >
            <div
              className="p-3 rounded-lg text-white shadow-lg"
              style={{
                background: selected.clusterColor,
                minWidth: 160,
                maxWidth: 260,
                cursor: 'pointer',
                userSelect: 'none',
                whiteSpace: 'normal',
                wordBreak: 'break-word',
              }}
              onClick={() => setSelected(null)}
            >
              <strong>{selected.displayName}</strong>
              <br />
              {selected.code}
              <div
                style={{
                  margin: '8px auto 0',
                  width: 0,
                  height: 0,
                  borderLeft: '8px solid transparent',
                  borderRight: '8px solid transparent',
                  borderTop: `8px solid ${selected.clusterColor}`,
                }}
              />
            </div>
          </OverlayView>
        )}
      </GoogleMap>
    </div>
    </>
  );
};

export default ClusterMap;

    // <div className="mb-4">
    //     <h5 className="text-lg font-semibold text-gray-800">Cluster Map</h5>
    //     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
    //       {/* Vehicle Dropdown */}
    //       <div>
    //         <Select
    //           label="Select Vehicle"
    //           value={selectedVehicle}
    //           onChange={handleVehicleSelect}
    //           className="bg-white"
    //         >
    //           {vehicles.map((vehicle) => (
    //             <Option key={vehicle.id} value={vehicle.id}>
    //               {vehicle.name}
    //             </Option>
    //           ))}
    //         </Select>
    //       </div>

    //       {/* Cluster Dropdown */}
    //       <div>
    //         <Select
    //           label="Select Cluster"
    //           value={selectedClusterId}
    //           onChange={(value) => {
    //             setSelectedClusterId(value);

    //             // find the selected cluster's number
    //             const cluster = clusterDrop.find(c => c._id === value);
    //             if (cluster) {
    //               setSelectedClusterNumber(cluster.clusterNo); // 👈 set cluster number
    //             }
    //           }}
    //           disabled={!selectedVehicle}
    //           className={selectedVehicle ? 'bg-white' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}
    //         >
    //           {clusterDrop.map((c) => (
    //             <Option key={c._id} value={c._id}>
    //               Cluster {c.clusterNo} - ({c.clusterName})
    //             </Option>
    //           ))}
    //         </Select>
    //       </div>
    //     </div>
    //   </div>