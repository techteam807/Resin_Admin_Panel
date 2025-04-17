import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useDispatch, useSelector } from "react-redux";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import { getProducts } from '@/feature/product/productSlice';

const locationIcon = new L.Icon({
    iconUrl: "https://png.pngtree.com/png-vector/20230413/ourmid/pngtree-3d-location-icon-clipart-in-transparent-background-vector-png-image_6704161.png",
    iconSize: [40, 40],
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
    const { products, loading } = useSelector((state) => state.product);
    console.log("p:",products)


    const [locations, setLocations] = useState([]);
    const [userLocation, setUserLocation] = useState(null);
    const [destination, setDestination] = useState(null);

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
        dispatch(getProducts({ search: '', active: true, productStatus:"inuse" }));
    }, [dispatch]);
    

    useEffect(() => {
        if (products?.inuseProducts?.length > 0) {
          const updatedLocations = products.inuseProducts
            .filter(p => p.geoCoordinates && p.geoCoordinates.coordinates?.length === 2)
            .map(p => ({
              _id: p._id,
              name: p.productCode,
              lat: p.geoCoordinates.coordinates[1],
              lng: p.geoCoordinates.coordinates[0],
            }));
    
          // Group products by the same coordinates
          const groupedLocations = updatedLocations.reduce((acc, loc) => {
            const key = `${loc.lat},${loc.lng}`;
            if (!acc[key]) {
              acc[key] = [];
            }
            acc[key].push(loc);
            return acc;
          }, {});
    
          // Convert the grouped locations into an array
          const finalLocations = Object.keys(groupedLocations).map(key => {
            const group = groupedLocations[key];
            return {
              _id: group[0]._id, // Use the first product's ID (just for uniqueness)
              lat: group[0].lat,
              lng: group[0].lng,
              name: group.map(product => product.name).join(', '), // Join all names
              products: group,
            };
          });
    
          setLocations(finalLocations);
        }
      }, [products]);
    

  return (
    <div>
      <div className="bg-clip-border rounded-xl bg-white text-gray-700 border border-blue-gray-100 mt-9 shadow-sm">
      <div className='flex h-[80vh]'>
            <div className='flex-1' >
                <MapContainer center={[23.0225, 72.5714]} zoom={12} className='rounded-xl' style={{ height: "100%", width: "100%" }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <FitBounds locations={[...locations, userLocation].filter(Boolean)} />

                    {/* {userLocation && (
                        <Marker position={[userLocation.lat, userLocation.lng]} icon={userLocationIcon}>
                            <Popup>My Current Location</Popup>
                        </Marker>
                    )} */}

                    {locations.map((location) => (
                        <Marker
                            key={location._id}
                            position={[location.lat, location.lng]}
                            icon={locationIcon}
                            eventHandlers={{ click: () => setDestination(location),
                                             popupclose: () => setDestination(null)
                                            }}
                        >
                            <Popup>{location.name}</Popup>
                        </Marker>
                    ))}

                    {/* {userLocation && destination && (
                        <RouteLayer userLocation={userLocation} destination={destination} />
                    )} */}
                </MapContainer>
            </div>
        </div>
      </div>
    </div>
  )
}

export default Map
