// import React, { useEffect, useState } from 'react'
// import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import L from "leaflet";
// import { useDispatch, useSelector } from "react-redux";
// import "leaflet-routing-machine";
// import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
// import { getProducts, getProductsMap } from '@/feature/product/productSlice';
// import { getCustomersMap } from '@/feature/customer/customerSlice';
// import customer_icon from '../../../public/img/customer.png';
// import product_icon from '../../../public/img/product.png';
// import Loader from '../Loader';



// const locationIcon = new L.Icon({
//     iconUrl: product_icon,
//     iconSize: [20, 30],
//     iconAnchor: [20, 40],
//     popupAnchor: [0, -40],
// });

// const customerIcon  = new L.Icon({
//     iconUrl:customer_icon,
//     iconSize: [20, 30],
//     iconAnchor: [20, 40],
//     popupAnchor: [0, -40],
// });


// const userLocationIcon = new L.Icon({
//     iconUrl: "https://www.iconpacks.net/icons/2/free-location-icon-2955-thumb.png",
//     iconSize: [40, 40],
//     iconAnchor: [20, 40],
//     popupAnchor: [0, -40],
// });

// const FitBounds = ({ locations }) => {
//     const map = useMap();
//     useEffect(() => {
//         if (locations.length > 0) {
//             const bounds = locations.map(loc => [loc.lat, loc.lng]);
//             map.fitBounds(bounds);
//         }
//     }, [locations, map]);
//     return null;
// };

// const RouteLayer = ({ userLocation, destination }) => {
//     const map = useMap();

//     useEffect(() => {
//         if (!userLocation || !destination) return;

//         map.eachLayer(layer => {
//             if (layer instanceof L.Routing.Control) {
//                 map.removeLayer(layer);
//             }
//         });

//         const routingControl = L.Routing.control({
//             waypoints: [
//                 L.latLng(userLocation.lat, userLocation.lng),
//                 L.latLng(destination.lat, destination.lng),
//             ],
//             routeWhileDragging: true,
//             show: true,
//             createMarker: () => null,
//             lineOptions: {
//                 styles: [{ color: "blue", weight: 4, opacity: 0.7 }],
//             },
//         }).addTo(map);

//         return () => {
//             map.removeControl(routingControl);
//         };
//     }, [userLocation, destination, map]);

//     return null;
// };

// const Map = () => {
//     const dispatch = useDispatch();
//     const { productsMap, loading } = useSelector((state) => state.product);
//     const { customersMap, mapLoading } = useSelector((state) => state.customer);

//     console.log("p:",productsMap)
//     console.log("ccccccccccccccc",customersMap);



//     const [locations, setLocations] = useState([]);
//     const [customers, setCustomers] = useState([]);
//     const [userLocation, setUserLocation] = useState(null);
//     const [destination, setDestination] = useState(null);
//     console.log("locations", locations);

//     // useEffect(() => {
//     //     axios.get(`${BACKEND_URL}/admin/locations`)
//     //         .then(response => setLocations([...locations, ...response.data]))
//     //         .catch(error => console.log(error));
//     // }, []);

//     useEffect(() => {
//         let watchId;
//         if (navigator.geolocation) {
//             watchId = navigator.geolocation.watchPosition(
//                 (position) => {
//                     setUserLocation({
//                         lat: position.coords.latitude,
//                         lng: position.coords.longitude,
//                     });
//                 },
//                 (error) => console.log("Error getting location:", error),
//                 { enableHighAccuracy: true, maximumAge: 1000 }
//             );
//         }

//         return () => {
//             if (watchId) navigator.geolocation.clearWatch(watchId);
//         };
//     }, []);

//     useEffect(() => {
//         dispatch(getProductsMap());
//         dispatch(getCustomersMap());
//     }, [dispatch]);

//     //for product icons
//     useEffect(() => {
//         if (productsMap?.length > 0) {
//             const updatedLocations = productsMap
//                 .filter(item => item.geoCoordinates && item.geoCoordinates.coordinates?.length === 2 && item.customer?.products?.length > 0)
//                 .map(item => {
//                     const { coordinates } = item.geoCoordinates;
//                     const productNames = item.customer.products.map(p => p.productCode).join(", ");
//                     const fName = item?.customer?.name;
//                     return {
//                         id: item.customer.id,
//                         name: productNames,
//                         lat: coordinates[1],
//                         lng: coordinates[0],
//                         fName: fName,
//                     };
//                 });

//             // Optional: Group by lat/lng if you want to cluster or avoid marker overlap
//             const grouped = updatedLocations.reduce((acc, loc) => {
//                 const key = `${loc.lat},${loc.lng}`;
//                 if (!acc[key]) acc[key] = [];
//                 acc[key].push(loc);
//                 return acc;
//             }, {});

//             const finalLocations = Object.keys(grouped).map(key => {
//                 const group = grouped[key];

//                 return {
//                     id: group[0].id,
//                     lat: group[0].lat,
//                     lng: group[0].lng,
//                     name: group.map(g => g.name).join(', '),
//                     fName: group[0].fName,
//                     allProducts: group,
//                 };
//             });

//             setLocations(finalLocations);
//         }
//     }, [productsMap]);

//     //for customer icons
//     useEffect(() => {
//         if (customersMap?.length > 0) {
//             const customerLocations = customersMap
//                 .filter(item => item.geoCoordinates?.coordinates?.length === 2)
//                 .map(item => ({
//                     id: item._id,
//                     name: item.display_name,
//                     lat: item.geoCoordinates.coordinates[1],
//                     lng: item.geoCoordinates.coordinates[0],
//                 }));
//             setCustomers(customerLocations);
//         }
//     }, [customersMap]);

//   return (
//     <div>
//       <div className="bg-clip-border rounded-xl bg-white text-gray-700 border border-blue-gray-100 mt-9 shadow-sm">
//       {loading || mapLoading ? (
//           <div className='flex h-[80vh] items-center justify-center'>
//             <Loader />
//           </div>
//           ) : (
//       <div>
//       <div className="p-2 absolute z-20 m-3 bg-white shadow-md rounded-lg right-4 font-medium">
//         <div className="flex gap-4">
//             <div className="flex items-center">
//                 Customer: <img src={customer_icon} alt="Customer Icon" className="w-4 h-6 ml-2" />
//             </div>
//             <div className="flex items-center">
//                 Product: <img src={product_icon} alt="Product Icon" className="w-4 h-6 ml-2" />
//             </div>
//         </div>
//       </div>
//       <div className='flex h-[80vh] -z-10'>
//             <div className='flex-1 z-10' >
//                 <MapContainer center={[23.0225, 72.5714]} zoom={12} className='rounded-xl' style={{ height: "100%", width: "100%" }}>
//                     <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//                     <FitBounds locations={[...locations, userLocation].filter(Boolean)} />

//                     {/* {userLocation && (
//                         <Marker position={[userLocation.lat, userLocation.lng]} icon={userLocationIcon}>
//                             <Popup>My Current Location</Popup>
//                         </Marker>
//                     )} */}

//                         {locations.map((loc, index) => (


//                         <Marker
//                         key={index}
//                         position={[loc.lat, loc.lng]}
//                         icon={locationIcon}
//                         // eventHandlers={{
//                         //     click: () => setDestination({ lat: loc.lat, lng: loc.lng }),
//                         // }}
//                     >
//                         <Popup>
//                             <div>{loc.fName}</div>
//                             <strong>{loc.name}</strong>
//                         </Popup>
//                     </Marker>
//                     ))}

//                     {customers.map((customer, index) => (
//                         <Marker
//                             key={`cust-${index}`}
//                             position={[customer.lat, customer.lng]}
//                             icon={customerIcon}
//                         >
//                             <Popup>
//                                 <strong>{customer.name}</strong>
//                             </Popup>
//                         </Marker>
//                     ))}

//                     {/* {userLocation && destination && (
//                         <RouteLayer userLocation={userLocation} destination={destination} />
//                     )} */}
//                 </MapContainer>
//             </div>
//         </div>

//         {customersMap?.length > 0 && (
//   <div className="p-4 mt-6 bg-white rounded-lg shadow-md border border-gray-200">
//     <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
//       Customers-Missing
//     </h2>

//     <div className="overflow-y-auto max-h-72">
//       {customersMap.filter(c =>
//         !c.geoCoordinates ||
//         !Array.isArray(c.geoCoordinates.coordinates) ||
//         c.geoCoordinates.coordinates.length !== 2
//       ).length === 0 ? (
//         <p className="text-sm text-gray-600 italic">All customers have valid locations 🎉</p>
//       ) : (
//         <table className="min-w-full text-sm text-left text-gray-700">
//           <thead className="bg-gray-100 text-gray-600 uppercase text-xs sticky top-0">
//             <tr>
//               <th className="px-3 py-2">#</th>
//               <th className="px-3 py-2">Customer Name</th>
//               <th className="px-3 py-2">Contact Number</th>
//             </tr>
//           </thead>
//           <tbody>
//             {customersMap
//               .filter(c =>
//                 !c.geoCoordinates ||
//                 !Array.isArray(c.geoCoordinates.coordinates) ||
//                 c.geoCoordinates.coordinates.length !== 2
//               )
//               .map((c, idx) => (
//                 <tr key={c._id || idx} className="border-b">
//                   <td className="px-3 py-2">{idx + 1}</td>
//                   <td className="px-3 py-2">{c.display_name || <em className="text-gray-400">Unnamed</em>}</td>
//                   <td className="px-3 py-2">{c.contact_number || <span className="text-gray-400 italic">No Contact</span>}</td>
//                 </tr>
//               ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   </div>
// )}


//         </div>
//         )}
//         </div>
//       </div>
//   )
// }

// export default Map















import React, { useEffect, useRef, useState } from "react";
import { GoogleMap, useLoadScript } from "@react-google-maps/api";
import { useDispatch, useSelector } from "react-redux";
import product_icon from "/img/product.png";
import customer_icon from "/img/customer.png";
import { getCustomersMap } from "@/feature/customer/customerSlice";
import { getProductsMap } from "@/feature/product/productSlice";
import Loader from "../Loader";

const LIBRARIES = ["places"];

const Map = () => {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries: LIBRARIES,
    });

    const dispatch = useDispatch();
    const { productsMap } = useSelector((state) => state.product);
    console.log("productsMap", productsMap);
    
    const { customersMap } = useSelector((state) => state.customer);
    console.log("customersMap", customersMap);

    const mapRef = useRef(null);
    const markersRef = useRef([]); // store markers to clear later
    const infoWindowRef = useRef(null);

    useEffect(() => {
        dispatch(getProductsMap());
        dispatch(getCustomersMap());
    }, [dispatch]);

    useEffect(() => {
        if (!isLoaded || !mapRef.current || !productsMap || !customersMap) return;

        const map = mapRef.current;

        // Clear previous markers
        markersRef.current.forEach((marker) => marker.setMap(null));
        markersRef.current = [];

        if (!infoWindowRef.current) {
            infoWindowRef.current = new window.google.maps.InfoWindow();
        }

        // Add product markers
        productsMap?.forEach((item) => {
            const coords = item.geoCoordinates?.coordinates;
            const customer = item.customer;
            if (coords?.length === 2) {
                const [lng, lat] = coords;
                const marker = new window.google.maps.Marker({
                    position: { lat, lng },
                    map,
                    title: customer?.name || "Product",
                    icon: {
                        url: product_icon,
                        scaledSize: new window.google.maps.Size(28, 40),
                        anchor: new window.google.maps.Point(15, 40),
                    },
                });

                marker.addListener("click", () => {
                    infoWindowRef.current.setContent(
                        // `<div><strong>${customer?.name || "Product"}</strong></div>`
                        `<div>Product<br>${customer.name || "No display name"}</div>`
                    );
                    infoWindowRef.current.open(map, marker);
                });

                markersRef.current.push(marker);
            }
        });

        // Add customer markers
        customersMap?.forEach((customer) => {
            const coords = customer.geoCoordinates?.coordinates;
            if (coords?.length === 2) {
                const [lng, lat] = coords;
                const marker = new window.google.maps.Marker({
                    position: { lat, lng },
                    map,
                    title: customer.name || "Customer",
                    icon: {
                        url: customer_icon,
                        scaledSize: new window.google.maps.Size(28, 40),
                        anchor: new window.google.maps.Point(15, 40),
                    },
                });

                marker.addListener("click", () => {
                    infoWindowRef.current.setContent(
                        `<div><strong>${customer.name || "Customer"}</strong><br>${customer.display_name || "No display name"}</div>`
                    );
                    infoWindowRef.current.open(map, marker);
                });

                markersRef.current.push(marker);
            }
        });

        // Center map to first product location
        const first = productsMap?.[0]?.geoCoordinates?.coordinates;
        if (first?.length === 2) {
            map.setCenter({ lat: first[1], lng: first[0] });
            map.setZoom(13);
        }

    }, [isLoaded, productsMap, customersMap]);

    if (loadError) {
        return <div className="text-red-600 font-semibold">Error loading Google Maps API.</div>;
    }

    if (!isLoaded || !productsMap || !customersMap) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <Loader />
            </div>
        );
    }

    return (
        <div className="bg-clip-border rounded-xl bg-white text-gray-700 border border-blue-gray-100 mt-9 shadow-sm relative">
            {/* Legend */}
            <div className="p-2 absolute z-20 m-2 bg-white shadow-md rounded-none right-12 font-medium">
                <div className="flex gap-4">
                    <div className="flex items-center">
                        Product: <img src={product_icon} alt="Product Icon" className="w-4 h-6 ml-2" />
                    </div>
                    <div className="flex items-center">
                        Customer: <img src={customer_icon} alt="Customer Icon" className="w-4 h-6 ml-2" />
                    </div>
                </div>
            </div>

            {/* Map */}
            <div className="flex h-[80vh]">
                <div className="flex-1">
                    <GoogleMap
                        mapContainerClassName="w-full h-full"
                        center={{ lat: 23.0618, lng: 72.515 }}
                        zoom={13}
                        onLoad={(map) => {
                            mapRef.current = map;
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default Map;
