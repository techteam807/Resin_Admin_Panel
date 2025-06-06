// // import React, { useEffect, useState, useRef } from "react";
// // import {
// //   GoogleMap,
// //   Marker,
// //   Polyline,
// //   Circle,
// //   OverlayView,
// //   useJsApiLoader,
// // } from "@react-google-maps/api";
// // import axios from "axios";

// // const containerStyle = {
// //   width: "100%",
// //   height: "90vh",
// // };

// // const center = {
// //   lat: 23.0225,
// //   lng: 72.5714,
// // };

// // const clusterColors = ["#ff5733", "#33c1ff", "#2ecc71", "#f1c40f", "#8e44ad"];

// // const RoutesMap = () => {
// //   const [data, setData] = useState([]);
// //   const [selected, setSelected] = useState(null);
// //   const mapRef = useRef(null);

// //   const { isLoaded } = useJsApiLoader({
// //     googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
// //   });

// //   useEffect(() => {
// //     const fetchData = async () => {
// //       try {
// //         const response = await axios.get(
// //           "http://localhost:5000/cluster/clusters/optimize-routes"
// //         );
// //         const fetchedData = response.data.data || [];
// //         setData(fetchedData);
// //         console.log("Fetched Data:", fetchedData);
// //       } catch (error) {
// //         console.error("Error fetching route data:", error);
// //       }
// //     };

// //     fetchData();
// //   }, []);

// //   // Save map instance on load
// //   const handleMapLoad = (map) => {
// //     mapRef.current = map;
// //   };

// //   // Fit map bounds whenever data changes and map is loaded
// //   useEffect(() => {
// //     if (mapRef.current && data.length > 0) {
// //       const bounds = new window.google.maps.LatLngBounds();
// //       data.forEach((cluster) =>
// //         cluster.visitSequence.forEach((v) => {
// //           if (!isNaN(v.lat) && !isNaN(v.lng)) {
// //             bounds.extend({ lat: v.lat, lng: v.lng });
// //           }
// //         })
// //       );
// //       if (!bounds.isEmpty()) {
// //         mapRef.current.fitBounds(bounds);
// //       }
// //     }
// //   }, [data]);

// //   if (!isLoaded) return <div>Loading Map...</div>;

// //   return (
// //     <GoogleMap
// //       mapContainerStyle={containerStyle}
// //       center={center}
// //       zoom={11}
// //       onLoad={handleMapLoad}
// //       onClick={() => setSelected(null)}
// //     >
// //       {data.map((cluster, clusterIndex) => {
// //         const clusterColor = clusterColors[clusterIndex % clusterColors.length];
// //         const routePath = cluster.visitSequence.map((v) => ({
// //           lat: v.lat,
// //           lng: v.lng,
// //         }));

// //         return (
// //           <React.Fragment key={clusterIndex}>
// //             {cluster.visitSequence.map((cust, idx) => (
// //               <React.Fragment key={`${clusterIndex}-${idx}`}>
// //                 <Circle
// //                   center={{ lat: cust.lat, lng: cust.lng }}
// //                   radius={500}
// //                   options={{
// //                     strokeColor: clusterColor,
// //                     fillColor: clusterColor,
// //                     strokeOpacity: 0.8,
// //                     fillOpacity: 0.25,
// //                     strokeWeight: 1,
// //                     clickable: false,
// //                     zIndex: 0,
// //                   }}
// //                 />
// //                 <Marker
// //                   position={{ lat: cust.lat, lng: cust.lng }}
// //                   onClick={() => setSelected({ ...cust, clusterColor })}
// //                   icon={{
// //                     url: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
// //                     scaledSize: new window.google.maps.Size(30, 30),
// //                     anchor: new window.google.maps.Point(15, 30),
// //                   }}
// //                 />
// //               </React.Fragment>
// //             ))}

// //             <Polyline
// //               path={routePath}
// //               options={{
// //                 strokeColor: clusterColor,
// //                 strokeOpacity: 0.8,
// //                 strokeWeight: 3,
// //               }}
// //             />
// //           </React.Fragment>
// //         );
// //       })}

// //       {selected && (
// //         <OverlayView
// //           position={{ lat: selected.lat, lng: selected.lng }}
// //           mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
// //           onClick={() => setSelected(null)}
// //         >
// //           <div
// //             style={{
// //               background: selected.clusterColor,
// //               minWidth: 160,
// //               maxWidth: 260,
// //               color: "#fff",
// //               padding: "6px 10px",
// //               borderRadius: 6,
// //               lineHeight: 1.4,
// //               cursor: "pointer",
// //               userSelect: "none",
// //               whiteSpace: "normal",
// //               wordBreak: "break-word",
// //               boxShadow: "0 2px 6px rgba(0,0,0,.3)",
// //             }}
// //           >
// //             <strong>{selected.customerName}</strong>
// //             <br />
// //             Visit No: {selected.visitNumber}
// //           </div>
// //         </OverlayView>
// //       )}
// //     </GoogleMap>
// //   );
// // };

// // export default RoutesMap;

// // import React, { useState, useEffect } from "react";
// // import {
// //   GoogleMap,
// //   Marker,
// //   Circle,
// //   DirectionsRenderer,
// //   InfoWindow,
// //   useJsApiLoader,
// // } from "@react-google-maps/api";

// // const containerStyle = {
// //   width: "100vw",
// //   height: "100vh",
// // };

// // const center = {
// //   lat: 30.1575,
// //   lng: 71.5249,
// // };

// // const clusterColors = [
// //   "#e6194b",
// //   "#3cb44b",
// //   "#ffe119",
// //   "#4363d8",
// //   "#f58231",
// //   "#911eb4",
// //   "#46f0f0",
// //   "#f032e6",
// //   "#bcf60c",
// //   "#fabebe",
// // ];

// // const MapComponent = () => {
// //   const { isLoaded } = useJsApiLoader({
// //     googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY, // Replace with your key
// //   });

// //   const [data, setData] = useState([]);
// //   const [selectedClusterIndex, setSelectedClusterIndex] = useState(null);
// //   const [selectedMarker, setSelectedMarker] = useState(null);
// //   const [map, setMap] = useState(null);
// //   const [directionsResponse, setDirectionsResponse] = useState(null);

// //   // Fetch cluster data
// //   useEffect(() => {
// //     fetch("http://localhost:5000/cluster/clusters/optimize-routes") // Replace with your API URL
// //       .then((res) => res.json())
// //       .then((res) => {
// //         if (res.data) setData(res.data);
// //       })
// //       .catch(console.error);
// //   }, []);

// //   // Clear directions & selection when cluster changes
// //   useEffect(() => {
// //     setDirectionsResponse(null);
// //     setSelectedMarker(null);
// //   }, [selectedClusterIndex]);

// //   // Fit map bounds to cluster points
// //   useEffect(() => {
// //     if (!map || selectedClusterIndex === null || !data[selectedClusterIndex]) return;

// //     const bounds = new window.google.maps.LatLngBounds();
// //     data[selectedClusterIndex].visitSequence.forEach(({ lat, lng }) => {
// //       if (!isNaN(lat) && !isNaN(lng)) {
// //         bounds.extend({ lat, lng });
// //       }
// //     });
// //     if (!bounds.isEmpty()) map.fitBounds(bounds);
// //   }, [map, selectedClusterIndex, data]);

// //   // Get directions for selected cluster
// //   useEffect(() => {
// //     if (
// //       selectedClusterIndex === null ||
// //       !data[selectedClusterIndex] ||
// //       data[selectedClusterIndex].visitSequence.length < 2
// //     ) {
// //       setDirectionsResponse(null);
// //       return;
// //     }

// //     const cluster = data[selectedClusterIndex];

// //     const waypoints = cluster.visitSequence
// //       .slice(1, -1)
// //       .map(({ lat, lng }) => ({ location: { lat, lng }, stopover: true }));

// //     const origin = cluster.visitSequence[0];
// //     const destination = cluster.visitSequence[cluster.visitSequence.length - 1];

// //     const directionsService = new window.google.maps.DirectionsService();
// //     directionsService.route(
// //       {
// //         origin: { lat: origin.lat, lng: origin.lng },
// //         destination: { lat: destination.lat, lng: destination.lng },
// //         waypoints,
// //         travelMode: window.google.maps.TravelMode.DRIVING,
// //         optimizeWaypoints: false,
// //       },
// //       (result, status) => {
// //         if (status === "OK" && result) {
// //           setDirectionsResponse(result);
// //         } else {
// //           console.error("Directions request failed due to " + status);
// //           setDirectionsResponse(null);
// //         }
// //       }
// //     );
// //   }, [selectedClusterIndex, data]);

// //   if (!isLoaded) return <div>Loading Map...</div>;

// //   return (
// //     <>
// //       {/* Cluster Selector */}
// //       <div
// //         style={{
// //           position: "fixed",
// //           top: 10,
// //           left: 10,
// //           background: "white",
// //           padding: 10,
// //           zIndex: 1000,
// //           borderRadius: 5,
// //           boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
// //         }}
// //       >
// //         <label htmlFor="clusterSelect" style={{ marginRight: 10 }}>
// //           Select Cluster:
// //         </label>
// //         <select
// //           id="clusterSelect"
// //           onChange={(e) => setSelectedClusterIndex(Number(e.target.value))}
// //           value={selectedClusterIndex === null ? "" : selectedClusterIndex}
// //         >
// //           <option value="" disabled>
// //             -- Select Cluster --
// //           </option>
// //           {data.map((cluster, idx) => (
// //             <option key={idx} value={idx}>
// //               Cluster {cluster.clusterNo ?? idx + 1}
// //             </option>
// //           ))}
// //         </select>
// //       </div>

// //       <GoogleMap
// //         mapContainerStyle={containerStyle}
// //         center={center}
// //         zoom={6}
// //         onLoad={(mapInstance) => setMap(mapInstance)}
// //       >
// //         {/* If directionsResponse, render driving route */}
// //         {directionsResponse && (
// //           <DirectionsRenderer
// //             directions={directionsResponse}
// //             options={{
// //               polylineOptions: {
// //                 strokeColor:
// //                   clusterColors[selectedClusterIndex % clusterColors.length],
// //                 strokeWeight: 5,
// //               },
// //             }}
// //           />
// //         )}

// //         {/* Render markers and circles for selected cluster */}
// //         {selectedClusterIndex !== null &&
// //           data[selectedClusterIndex] &&
// //           data[selectedClusterIndex].visitSequence.map((point, idx) => (
// //             <React.Fragment key={idx}>
// //               <Circle
// //                 center={{ lat: point.lat, lng: point.lng }}
// //                 radius={500}
// //                 options={{
// //                   strokeColor:
// //                     clusterColors[selectedClusterIndex % clusterColors.length],
// //                   fillColor:
// //                     clusterColors[selectedClusterIndex % clusterColors.length],
// //                   strokeOpacity: 0.8,
// //                   fillOpacity: 0.25,
// //                   strokeWeight: 1,
// //                 }}
// //               />
// //               <Marker
// //                 position={{ lat: point.lat, lng: point.lng }}
// //                 onClick={() =>
// //                   setSelectedMarker({
// //                     ...point,
// //                     color: clusterColors[selectedClusterIndex % clusterColors.length],
// //                   })
// //                 }
// //                 icon={{
// //                   url: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
// //                   scaledSize: new window.google.maps.Size(30, 30),
// //                   anchor: new window.google.maps.Point(15, 30),
// //                 }}
// //               />
// //             </React.Fragment>
// //           ))}

// //         {/* InfoWindow on selected marker */}
// //         {selectedMarker && (
// //           <InfoWindow
// //             position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
// //             onCloseClick={() => setSelectedMarker(null)}
// //           >
// //             <div style={{ maxWidth: 200 }}>
// //               <h4>Customer ID: {selectedMarker.customerId ?? "N/A"}</h4>
// //               <p>
// //                 Lat: {selectedMarker.lat.toFixed(4)}, Lng:{" "}
// //                 {selectedMarker.lng.toFixed(4)}
// //               </p>
// //               <p>
// //                 Marker Color:{" "}
// //                 <span style={{ color: selectedMarker.color }}>{selectedMarker.color}</span>
// //               </p>
// //             </div>
// //           </InfoWindow>
// //         )}
// //       </GoogleMap>
// //     </>
// //   );
// // };

// // export default MapComponent;

// import React, { useEffect, useState } from "react";
// import {
//   GoogleMap,
//   Marker,
//   DirectionsRenderer,
//   InfoWindow,
//   useJsApiLoader,
//   Circle,
// } from "@react-google-maps/api";

// const containerStyle = {
//   width: "100vw",
//   height: "100vh",
// };

// const center = {
//   lat: 23.0811,
//   lng: 72.4972,
// };

// const clusterColors = [
//   "#e6194b", "#3cb44b", "#ffe119", "#4363d8", "#f58231",
//   "#911eb4", "#46f0f0", "#f032e6", "#bcf60c", "#fabebe",
// ];

// const RoutesMap = ({ selectedClusterIndex, setSelectedClusterIndex }) => {
//   const { isLoaded } = useJsApiLoader({
//     googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY, // Replace with actual key
//   });

//   const [data, setData] = useState([]);
//   const [selectedClusterIndex, setSelectedClusterIndex] = useState(null);
//   const [directionsResponse, setDirectionsResponse] = useState(null);
//   const [map, setMap] = useState(null);
//   const [selectedMarker, setSelectedMarker] = useState(null);

//   useEffect(() => {
//     fetch("http://localhost:5000/cluster/clusters/optimize-routes") // Replace with your actual API URL
//       .then((res) => res.json())
//       .then((res) => setData(res.data || []))
//       .catch(console.error);
//   }, []);

//   console.log(data);
  

//   useEffect(() => {
//     if (!map || selectedClusterIndex === null || !data[selectedClusterIndex]) return;

//     const cluster = data[selectedClusterIndex];
//     const bounds = new window.google.maps.LatLngBounds();
//     cluster.visitSequence.forEach((point) => {
//       bounds.extend({ lat: point.lat, lng: point.lng });
//     });

//     if (!bounds.isEmpty()) {
//       map.fitBounds(bounds);
//     }
//   }, [map, selectedClusterIndex, data]);

//   useEffect(() => {
//     if (selectedClusterIndex === null) return;

//     const cluster = data[selectedClusterIndex];
//     if (!cluster || !cluster.visitSequence) return;

//     const customerPoints = cluster.visitSequence.filter(
//       (p) => p.customerName?.trim().toLowerCase() !== "warehouse"
//     );

//     if (customerPoints.length < 2) {
//       setDirectionsResponse(null);
//       return;
//     }

//     const origin = customerPoints[0];
//     const destination = customerPoints[customerPoints.length - 1];
//     const waypoints = customerPoints.slice(1, -1).map((p) => ({
//       location: { lat: p.lat, lng: p.lng },
//       stopover: true,
//     }));

//     const service = new window.google.maps.DirectionsService();
//     service.route(
//       {
//         origin: { lat: origin.lat, lng: origin.lng },
//         destination: { lat: destination.lat, lng: destination.lng },
//         waypoints,
//         travelMode: "DRIVING",
//       },
//       (result, status) => {
//         if (status === "OK") {
//           setDirectionsResponse(result);
//         } else {
//           console.warn("Directions error:", status);
//           setDirectionsResponse(null);
//         }
//       }
//     );
//   }, [selectedClusterIndex, data]);

//   if (!isLoaded) return <div>Loading map...</div>;

//   return (
//     <>
//       <div
//         style={{
//           position: "fixed",
//           top: 10,
//           left: 10,
//           zIndex: 999,
//           background: "#fff",
//           padding: 10,
//           borderRadius: 5,
//         }}
//       >
//         <label>Select Cluster: </label>
//         <select
//           value={selectedClusterIndex ?? ""}
//           onChange={(e) => setSelectedClusterIndex(Number(e.target.value))}
//         >
//           <option value="" disabled>
//             -- Choose --
//           </option>
//           {data.map((_, idx) => (
//             <option key={idx} value={idx}>
//               Cluster {idx + 1}
//             </option>
//           ))}
//         </select>
//       </div>

//       <GoogleMap
//         mapContainerStyle={containerStyle}
//         center={center}
//         zoom={10}
//         onLoad={setMap}
//       >
//         {selectedClusterIndex !== null &&
//           data[selectedClusterIndex]?.visitSequence.map((point, idx) => {
//             const isWarehouse =
//               point.customerName?.trim().toLowerCase() === "warehouse";

//             const clusterColor =
//               clusterColors[selectedClusterIndex % clusterColors.length];

//             return (
//               <React.Fragment key={idx}>
//                 {!isWarehouse && (
//                   <Circle
//                     center={{ lat: point.lat, lng: point.lng }}
//                     radius={400}
//                     options={{
//                       strokeColor: clusterColor,
//                       fillColor: clusterColor,
//                       strokeOpacity: 0.8,
//                       fillOpacity: 0.2,
//                     }}
//                   />
//                 )}
//                 <Marker
//                   position={{ lat: point.lat, lng: point.lng }}
//                   onClick={() => setSelectedMarker(point)}
//                   icon={{
//                     url: isWarehouse
//                       ? "https://maps.google.com/mapfiles/ms/icons/red-dot.png"
//                       : "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
//                     scaledSize: new window.google.maps.Size(32, 32),
//                   }}
//                 />
//               </React.Fragment>
//             );
//           })}

//         {directionsResponse && (
//           <DirectionsRenderer
//             directions={directionsResponse}
//             options={{
//               polylineOptions: {
//                 strokeColor:
//                   clusterColors[selectedClusterIndex % clusterColors.length],
//                 strokeOpacity: 0.8,
//                 strokeWeight: 5,
//               },
//             }}
//           />
//         )}

//         {selectedMarker && (
//           <InfoWindow
//             position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
//             onCloseClick={() => setSelectedMarker(null)}
//           >
//             <div>
//               <h4>{selectedMarker.customerName}</h4>
//               <p>
//                 Lat: {selectedMarker.lat}, Lng: {selectedMarker.lng}
//               </p>
//             </div>
//           </InfoWindow>
//         )}
//       </GoogleMap>
//     </>
//   );
// };

// export default RoutesMap;

import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
  InfoWindow,
  useJsApiLoader,
  Circle,
} from "@react-google-maps/api";

const containerStyle = {
  width: "100vw",
  height: "100vh",
};

const center = {
  lat: 23.0811,
  lng: 72.4972,
};

const clusterColors = [
  "#e6194b", "#3cb44b", "#ffe119", "#4363d8", "#f58231",
  "#911eb4", "#46f0f0", "#f032e6", "#bcf60c", "#fabebe",
];

const RoutesMap = ({ selectedClusterIndex, setSelectedClusterIndex }) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const [data, setData] = useState([]);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [map, setMap] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/cluster/clusters/optimize-routes")
      .then((res) => res.json())
      .then((res) => setData(res.data || []))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!map || selectedClusterIndex === null || !data[selectedClusterIndex]) return;

    const cluster = data[selectedClusterIndex];
    const bounds = new window.google.maps.LatLngBounds();
    cluster.visitSequence.forEach((point) => {
      bounds.extend({ lat: point.lat, lng: point.lng });
    });

    if (!bounds.isEmpty()) {
      map.fitBounds(bounds);
    }
  }, [map, selectedClusterIndex, data]);

  useEffect(() => {
    if (selectedClusterIndex === null) return;

    const cluster = data[selectedClusterIndex];
    if (!cluster || !cluster.visitSequence) return;

    const customerPoints = cluster.visitSequence.filter(
      (p) => p.customerName?.trim().toLowerCase() !== "warehouse"
    );

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
  }, [selectedClusterIndex, data]);

  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <div className="bg-clip-border rounded-xl bg-white text-gray-700 border border-blue-gray-100 mt-9 shadow-sm">
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={10}
      onLoad={setMap}
    >
      {selectedClusterIndex !== null &&
        data[selectedClusterIndex]?.visitSequence.map((point, idx) => {
          const isWarehouse = point.customerName?.trim().toLowerCase() === "warehouse";

          const clusterColor = clusterColors[selectedClusterIndex % clusterColors.length];

          return (
            <React.Fragment key={idx}>
              {!isWarehouse && (
                <Circle
                  center={{ lat: point.lat, lng: point.lng }}
                  radius={400}
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
        })}

      {directionsResponse && (
        <DirectionsRenderer
          directions={directionsResponse}
          options={{
            polylineOptions: {
              strokeColor: clusterColors[selectedClusterIndex % clusterColors.length],
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
    </GoogleMap>
    </div>
  );
};

export default RoutesMap;
