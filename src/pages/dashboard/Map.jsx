import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useDispatch, useSelector } from "react-redux";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import { getProducts, getProductsMap } from '@/feature/product/productSlice';
import { getCustomersMap } from '@/feature/customer/customerSlice';
import customer_icon from '../../../public/img/customer.png';
import product_icon from '../../../public/img/product.png';
import Loader from '../Loader';



const locationIcon = new L.Icon({
    iconUrl: product_icon,
    iconSize: [20, 30],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
});

const customerIcon  = new L.Icon({
    iconUrl:customer_icon,
    iconSize: [20, 30],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
});


const userLocationIcon = new L.Icon({
    iconUrl: "https://www.iconpacks.net/icons/2/free-location-icon-2955-thumb.png",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
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

const RouteLayer = ({ userLocation, destination }) => {
    const map = useMap();

    useEffect(() => {
        if (!userLocation || !destination) return;

        map.eachLayer(layer => {
            if (layer instanceof L.Routing.Control) {
                map.removeLayer(layer);
            }
        });

        const routingControl = L.Routing.control({
            waypoints: [
                L.latLng(userLocation.lat, userLocation.lng),
                L.latLng(destination.lat, destination.lng),
            ],
            routeWhileDragging: true,
            show: true,
            createMarker: () => null,
            lineOptions: {
                styles: [{ color: "blue", weight: 4, opacity: 0.7 }],
            },
        }).addTo(map);

        return () => {
            map.removeControl(routingControl);
        };
    }, [userLocation, destination, map]);

    return null;
};

const Map = () => {
    const dispatch = useDispatch();
    const { productsMap, loading } = useSelector((state) => state.product);
    const { customersMap, mapLoading } = useSelector((state) => state.customer);

    console.log("p:",productsMap)
    console.log(customersMap);
    


    const [locations, setLocations] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [userLocation, setUserLocation] = useState(null);
    const [destination, setDestination] = useState(null);
    console.log("locations", locations);
    
    // useEffect(() => {
    //     axios.get(`${BACKEND_URL}/admin/locations`)
    //         .then(response => setLocations([...locations, ...response.data]))
    //         .catch(error => console.log(error));
    // }, []);

    useEffect(() => {
        let watchId;
        if (navigator.geolocation) {
            watchId = navigator.geolocation.watchPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },
                (error) => console.log("Error getting location:", error),
                { enableHighAccuracy: true, maximumAge: 1000 }
            );
        }

        return () => {
            if (watchId) navigator.geolocation.clearWatch(watchId);
        };
    }, []);

    useEffect(() => {
        dispatch(getProductsMap());
        dispatch(getCustomersMap());
    }, [dispatch]);

    //for product icons
    useEffect(() => {
        if (productsMap?.length > 0) {
            const updatedLocations = productsMap
                .filter(item => item.geoCoordinates && item.geoCoordinates.coordinates?.length === 2 && item.customer?.products?.length > 0)
                .map(item => {
                    const { coordinates } = item.geoCoordinates;
                    const productNames = item.customer.products.map(p => p.productCode).join(", ");
                    const fName = item?.customer?.name;
                    return {
                        id: item.customer.id,
                        name: productNames,
                        lat: coordinates[1],
                        lng: coordinates[0],
                        fName: fName,
                    };
                });
    
            // Optional: Group by lat/lng if you want to cluster or avoid marker overlap
            const grouped = updatedLocations.reduce((acc, loc) => {
                const key = `${loc.lat},${loc.lng}`;
                if (!acc[key]) acc[key] = [];
                acc[key].push(loc);
                return acc;
            }, {});
    
            const finalLocations = Object.keys(grouped).map(key => {
                const group = grouped[key];
                
                return {
                    id: group[0].id,
                    lat: group[0].lat,
                    lng: group[0].lng,
                    name: group.map(g => g.name).join(', '),
                    fName: group[0].fName,
                    allProducts: group,
                };
            });
    
            setLocations(finalLocations);
        }
    }, [productsMap]);

    //for customer icons
    useEffect(() => {
        if (customersMap?.length > 0) {
            const customerLocations = customersMap
                .filter(item => item.geoCoordinates?.coordinates?.length === 2)
                .map(item => ({
                    id: item._id,
                    name: item.display_name,
                    lat: item.geoCoordinates.coordinates[1],
                    lng: item.geoCoordinates.coordinates[0],
                }));
            setCustomers(customerLocations);
        }
    }, [customersMap]);

  return (
    <div>
      <div className="bg-clip-border rounded-xl bg-white text-gray-700 border border-blue-gray-100 mt-9 shadow-sm">
      {loading || mapLoading ? (
          <div className='flex h-[80vh] items-center justify-center'>
            <Loader />
          </div>
          ) : (
      <div>
      <div className="p-2 absolute z-20 m-3 bg-white shadow-md rounded-lg right-4 font-medium">
        <div className="flex gap-4">
            {/* <div className="flex items-center">
                Customer: <img src={customer_icon} alt="Customer Icon" className="w-4 h-6 ml-2" />
            </div> */}
            <div className="flex items-center">
                Product: <img src={product_icon} alt="Product Icon" className="w-4 h-6 ml-2" />
            </div>
        </div>
      </div>
      <div className='flex h-[80vh] -z-10'>
            <div className='flex-1 z-10' >
                <MapContainer center={[23.0225, 72.5714]} zoom={12} className='rounded-xl' style={{ height: "100%", width: "100%" }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <FitBounds locations={[...locations, userLocation].filter(Boolean)} />

                    {/* {userLocation && (
                        <Marker position={[userLocation.lat, userLocation.lng]} icon={userLocationIcon}>
                            <Popup>My Current Location</Popup>
                        </Marker>
                    )} */}

                        {locations.map((loc, index) => (
                     

                        <Marker
                        key={index}
                        position={[loc.lat, loc.lng]}
                        icon={locationIcon}
                        eventHandlers={{
                            click: () => setDestination({ lat: loc.lat, lng: loc.lng }),
                        }}
                    >
                        <Popup>
                            <div>{loc.fName}</div>
                            <strong>{loc.name}</strong>
                        </Popup>
                    </Marker>
                    ))}

                    {/* {customers.map((customer, index) => (
                        <Marker
                            key={`cust-${index}`}
                            position={[customer.lat, customer.lng]}
                            icon={customerIcon}
                        >
                            <Popup>
                                <strong>{customer.name}</strong>
                            </Popup>
                        </Marker>
                    ))} */}

                    {/* {userLocation && destination && (
                        <RouteLayer userLocation={userLocation} destination={destination} />
                    )} */}
                </MapContainer>
            </div>
        </div>
        </div>
        )}
        </div>
      </div>
  )
}

export default Map
