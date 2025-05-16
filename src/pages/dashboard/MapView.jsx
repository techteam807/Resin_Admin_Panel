// ---------------- MapView.jsx ----------------
import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  Marker,
  Circle,
  InfoWindow,
  useLoadScript,
} from "@react-google-maps/api";

/* ─────────── static values OUTSIDE the component (prevents hot‑reload loops) */
const LIBRARIES   = ["places"];
const container   = { width: "100%", height: "80vh" };
const colors      = ["red", "blue", "green", "purple", "orange", "cyan", "magenta"];

/**
 * @param {Object[]} data    formatted clusters (see MapCluster)
 * @param {Object}   center  { lat, lng } fallback centre
 * @param {number}   mapKey  bump this to remount the <GoogleMap>
 */
const MapView = ({ data, center, mapKey }) => {
    console.log("MapView", data, center, mapKey);
    
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES,
    version: "weekly",
  });

  const [map , setMap]      = useState(null);
  const [info, setInfo]     = useState(null);   // selected marker for InfoWindow

  /* Auto‑fit when data OR map changes */
  useEffect(() => {
    if (!map || data.length === 0) return;

    const bounds = new window.google.maps.LatLngBounds();
    data.forEach(cl =>
      cl.customers.forEach(cu => bounds.extend({ lat: cu.lat, lng: cu.lng }))
    );
    if (!bounds.isEmpty()) map.fitBounds(bounds);
  }, [map, data]);

  if (!isLoaded) return null;

  return (
    <GoogleMap
      key={mapKey}                             // force remount on toggle
      mapContainerStyle={container}
      center={center}
      zoom={11}
      onLoad={setMap}
      onUnmount={() => setMap(null)}
      onClick={() => setInfo(null)}
    >
      {data.map((cl, idx) => {
        const color = colors[idx % colors.length];
        return cl.customers.map(cu => (
          <React.Fragment key={cu.customerId}>
            <Circle
              center={{ lat: cu.lat, lng: cu.lng }}
              radius={500}
              options={{
                strokeColor: color,
                fillColor  : color,
                strokeOpacity: 0.8,
                fillOpacity  : 0.25,
                strokeWeight : 1,
                clickable    : false,
              }}
            />
            <Marker
              position={{ lat: cu.lat, lng: cu.lng }}
              onClick={() => setInfo({ ...cu, color })}
              icon={{
                url: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
                scaledSize: new window.google.maps.Size(30, 30),
                anchor    : new window.google.maps.Point(15, 30),
              }}
            />
          </React.Fragment>
        ));
      })}

      {info && (
        <InfoWindow
          position={{ lat: info.lat, lng: info.lng }}
          onCloseClick={() => setInfo(null)}
        >
          <div style={{
            background : info.color,
            color      : "#fff",
            padding    : 6,
            borderRadius: 4,
            lineHeight : 1.3,
          }}>
            <strong>{info.displayName}</strong><br/>
            {info.code}
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
};

export default MapView;
