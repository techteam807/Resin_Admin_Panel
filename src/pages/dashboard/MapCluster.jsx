import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Loader from "../Loader";
import { getCustomersClusterMap } from "@/feature/customer/customerSlice";
import { useDispatch, useSelector } from "react-redux";
import "./Home.css";
import { Button, Typography } from "@material-tailwind/react";

// Different cluster colors
const clusterColors = ["red", "blue", "green", "purple", "orange", "cyan", "magenta"];

const customerIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149071.png", // any customer icon
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

const FitBounds = ({ locations }) => {
  const map = useMap();
  useEffect(() => {
    if (locations.length > 0) {
      const bounds = locations.map(loc => [loc.lat, loc.lng]);
      map.fitBounds(bounds);
    }
  }, [locations, map]);
  return null;
};

const MapCluster = () => {
    const dispatch = useDispatch()
    const { customersClusterMap, mapLoading } = useSelector((state) => state.customer);
    const numClusters = 3;
    const maxCustomersPerCluster = 5;

useEffect(()=> {
    dispatch(getCustomersClusterMap({numClusters}))
}, [dispatch])

const data = [
  {
    name: 'Cluster 1',
    cutomer: [
      {code: "BW-CUST-089"},
      {code: "BW-CUST-090"},
      {code: "BW-CUST-000"},
      {code: "BW-CUST-000"},
      {code: "BW-CUST-000"},
      {code: "BW-CUST-000"},
      {code: "BW-CUST-000"},
      {code: "BW-CUST-000"},
      {code: "BW-CUST-000"},
      {code: "BW-CUST-000"},
      {code: "BW-CUST-000"},
      {code: "BW-CUST-000"},
      {code: "BW-CUST-000"},
      {code: "BW-CUST-000"},
    ],
  },
  {
    name: 'Cluster 2',
    cutomer: [
      {code: "BW-CUST-050"},
      {code: "BW-CUST-051"},
      {code: "BW-CUST-052"},
    ],
  },
  {
    name: 'Cluster 3',
    cutomer: [
      {code: "BW-CUST-040"},
      {code: "BW-CUST-041"},
      {code: "BW-CUST-042"},
    ],
  },
]

  return (
    <div className="bg-clip-border rounded-xl bg-white text-gray-700 border border-blue-gray-100 mt-9 shadow-sm">
      <div className="p-4 overflow-x-auto border-blue-gray-100">
        <div className="mb-4 border rounded-lg p-2 px-3 flex items-center justify-between">
          <div className="">
            <Typography variant="h5" color="blue-gray">
              Cluster List
            </Typography>
          </div>
          <div>
            <Button size="md" variant='gradient'>
              Save
            </Button>
          </div>
        </div>
        <div className="flex gap-6 w-max">
          {data.map((cluster, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md min-w-[23vw] max-w-[320px] flex flex-col overflow-hidden"
            >
              <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white text-center text-lg font-semibold py-3 px-4">
                {cluster.name}
              </div>
              <div className="flex-1 overflow-y-auto max-h-[70vh] scrollbar-thin p-3 space-y-3 bg-gray-50">
                {cluster.cutomer.map((customer, idx) => (
                  <Button
                    variant="text"
                    key={idx}
                    color=""
                    className="bg-white rounded-md group text-sm hover:cursor-pointer w-full text-start relative p-4 border-l-2 border-black"
                  >
                    {customer.code}
                  </Button>
                  // <div
                  //   key={idx}
                  //   className="bg-white shadow-sm hover:shadow-md border border-gray-200 hover:border-blue-400 transition rounded-md px-4 py-3 text-sm font-medium cursor-pointer"
                  // >
                  //   {customer.code}
                  // </div>
                ))}
              </div>
              <div className="p-3 border-t border-gray-200 bg-gray-200 text-center text-sm text-gray-700">
                {cluster.cutomer.length} customers
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* {mapLoading ? (
        <div className="flex h-[80vh] items-center justify-center">
          <Loader />
        </div>
      ) : ( */}
        <div className="h-[80vh]">
          <MapContainer center={[23.0225, 72.5714]} zoom={11} className="rounded-xl" style={{ height: "100%", width: "100%" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <FitBounds locations={
                customersClusterMap
                .filter(c => c.geoCoordinates?.coordinates?.length === 2)
                .map(c => ({
                    lat: c.geoCoordinates.coordinates[1],
                    lng: c.geoCoordinates.coordinates[0],
                }))
            } />

            {customersClusterMap
                .filter(cust => cust.geoCoordinates?.coordinates?.length === 2) // ✅ safe
                .map((cust, idx) => {
                  const lat = cust.geoCoordinates.coordinates[1];
                  const lng = cust.geoCoordinates.coordinates[0];
                  return (
                    <React.Fragment key={idx}>
                      <Circle
                        center={[lat, lng]}
                        radius={500}
                        pathOptions={{ color: clusterColors[cust.cluster % clusterColors.length], fillOpacity: 0.3 }}
                      />
                      <Marker position={[lat, lng]} icon={customerIcon}>
                        <Popup>
                          <div>
                            <strong>{cust.display_name}</strong> <br />
                            Cluster: {cust.cluster}
                          </div>
                        </Popup>
                      </Marker>
                    </React.Fragment>
                  );
                })}
          </MapContainer>
        </div>
      {/* )} */}
    </div>
  );
};

export default MapCluster;
