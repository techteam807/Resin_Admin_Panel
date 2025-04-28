import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Loader from "../Loader";
import { getCustomersClusterMap } from "@/feature/customer/customerSlice";
import { useDispatch, useSelector } from "react-redux";

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

  return (
    <div>
      {mapLoading ? (
        <div className="flex h-[80vh] items-center justify-center">
          <Loader />
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default MapCluster;
