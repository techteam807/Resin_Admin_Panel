import React, { useEffect, useRef, useState } from 'react';
import {
    ClipboardDocumentListIcon,
    MapPinIcon,
    MapIcon,
} from '@heroicons/react/24/outline';
import { useDispatch, useSelector } from 'react-redux';
import {
    editCustomersClusterMap,
    getCustomersClusterMap,
    refreshCustomersClusterMap,
    // fetchClusterRoute,
    getClusterDropDown,
} from '@/feature/customer/customerSlice';
import ClusterList from '@/component/ClusterList.jsx';
import ClusterMap from '@/component/ClusterMap.jsx';
import ClusterRoute from '@/component/ClusterRoute.jsx';
import vehicles from '../../global.js';


const tabs = [
    { key: 'list', label: 'Cluster List', icon: ClipboardDocumentListIcon },
    { key: 'map', label: 'Cluster Map', icon: MapPinIcon },
    // { key: 'route', label: 'Cluster Route', icon: MapIcon },
];

const MapClusterCopy = () => {
    const dispatch = useDispatch();
    // const mapRef = useRef(null);

    const handleMapLoad = (map) => {
        mapRef.current = map;
    };
    const { customersClusterMap, mapLoading1, mapLoading,
        // clusteroute,
        clusterDrop } = useSelector(
            (state) => state.customer
        );
        console.log("customersClusterMap",customersClusterMap)

    const [activeTab, setActiveTab] = useState('list');
    const [data, setData] = useState([]);
    const [route, setRoute] = useState([]);
    const [selected, setSelected] = useState(null);
    const [selectedCluster, setSelectedCluster] = useState(null);
    const [showRoute, setShowRoute] = useState(false);
    const [showCluster, setShowCluster] = useState(true);
    const [directionsResponse, setDirectionsResponse] = useState(null);
    const [searchValue, setSearchValue] = useState('');
    const [selectedVehicle, setSelectedVehicle] = useState(1);
    const [selectedClusterId, setSelectedClusterId] = useState("");
    const [selectedClusterNumber, setSelectedClusterNumber] = useState("null");    
    const [isVisible, setIsVisible] = useState(true);
    const [saveLoading, setSaveLoading] = useState(false);


    // Fetch clusters based on vehicle
    useEffect(() => {
        const payload = { vehicleNo: Number(selectedVehicle), clusterNo: Number(selectedClusterNumber) };
        dispatch(getCustomersClusterMap(payload));
    }, [dispatch, selectedVehicle,selectedClusterNumber]);

    useEffect(() => {
        dispatch(getClusterDropDown(Number(selectedVehicle)));
    }, [dispatch, selectedVehicle]);

    // Ensure vehicle 1 data is loaded when map tab is active
    useEffect(() => {
        if (activeTab === 'map') {
            setSelectedVehicle(1);
            // Force fetch vehicle 1 data immediately
            dispatch(getCustomersClusterMap({ vehicleNo: 1 }));
            dispatch(getClusterDropDown(1));
        }
    }, [activeTab, dispatch]);

    // useEffect(() => {
    //     if (!selectedVehicle) return;

    //     const payload =
    //         activeTab === 'route' && selectedCluster !== ''
    //             ? { clusterId: selectedCluster, vehicleNo: selectedVehicle }
    //             : { vehicleNo: selectedVehicle };

    //     dispatch(fetchClusterRoute(payload));
    // }, [dispatch, activeTab, selectedCluster, selectedVehicle]);

    useEffect(() => {
        if (mapLoading1) {
            setData([])
            return;
        }

        if (customersClusterMap?.clusters?.length > 0) {
            const formatted = customersClusterMap?.clusters?.map((cluster) => ({
                clusterId: cluster._id,
                vehicle: cluster.vehicleNo,
                clusterNo: cluster.clusterNo,
                name: `Cluster ${cluster.clusterNo}`,
                clusterName: cluster.clusterName,
                cartridge_qty: cluster.cartridge_qty,
                size: cluster.cartridgeSizeCounts,
                customers: cluster.customers.map((c) => ({
                    qty: c.cf_cartridge_qty,
                    size: c.cf_cartridge_size,
                    code: c.contact_number,
                    customerId: c.customerId,
                    displayName: c.name,
                    vistSequnceNo: c.sequenceNo,
                    indexNo: c.indexNo,
                    isFreezed: c.isFreezed ?? false,  
                    lat: Number(c.geoCoordinates?.coordinates[1]) || '',
                    lng: Number(c.geoCoordinates?.coordinates[0]) || '',
                })),
            }));
            setData(formatted);
        } else {
            setData([]);
        }
    }, [mapLoading1, customersClusterMap]);

    // Format route data
    // useEffect(() => {
    //     if (mapLoading) {
    //         setRoute([]);
    //         return;
    //     }
    //     if (clusteroute?.length) {
    //         const formatted = clusteroute.map((cluster) => ({
    //             clusterId: cluster.clusterId,
    //             clusterNo: cluster.clusterNo,
    //             name: `Cluster ${cluster.clusterNo + 1}`,
    //             cartridge_qty: cluster.cartridge_qty,
    //             totalDistance: cluster.totalDistance,
    //             customers: cluster.visitSequence.map((v) => ({
    //                 displayName: v.customerName,
    //                 vistSequnceNo: v.visitNumber,
    //                 lat: Number(v.lat),
    //                 lng: Number(v.lng),
    //                 clusterId: v.clusterId,
    //                 distanceFromPrev: v.distanceFromPrev,
    //             })),
    //         }));
    //         setRoute(formatted);
    //     } else {
    //         setRoute([]);
    //     }
    // }, [mapLoading, clusteroute]);

    // useEffect(() => {
    //     if (!mapRef.current || !data.length) return;

    //     const bounds = new window.google.maps.LatLngBounds();
    //     data.forEach((cl) =>
    //         cl.customers.forEach((cu) => {
    //             if (!isNaN(cu.lat) && !isNaN(cu.lng)) {
    //                 bounds.extend({ lat: cu.lat, lng: cu.lng });
    //             }
    //         })
    //     );
    //     if (!bounds.isEmpty()) mapRef.current.fitBounds(bounds);
    // }, [data]);

    // Auto-select first cluster in route mode
    // useEffect(() => {
    //     if (activeTab === 'route' && selectedCluster === '' && route.length > 0) {
    //         setSelectedCluster(route[0]?.clusterId);
    //     }
    // }, [activeTab, route, selectedCluster]);

    // Handle directions for routes
    // useEffect(() => {
    //     if (activeTab !== 'route' || selectedCluster === '') {
    //         setDirectionsResponse(null);
    //         return;
    //     }

    //     const cluster = clusteroute.find((c) => String(c.clusterId) === selectedCluster);

    //     if (!cluster || !cluster.visitSequence) {
    //         setDirectionsResponse(null);
    //         return;
    //     }

    //     const customerPoints = cluster.visitSequence.filter(
    //         (p) => p.customerName?.trim().toLowerCase() !== 'warehouse'
    //     );

    //     if (customerPoints.length < 2) {
    //         setDirectionsResponse(null);
    //         return;
    //     }

    //     const origin = customerPoints[0];
    //     const destination = customerPoints[customerPoints.length - 1];
    //     const waypoints = customerPoints.slice(1, -1).map((p) => ({
    //         location: { lat: p.lat, lng: p.lng },
    //         stopover: true,
    //     }));

    //     const service = new window.google.maps.DirectionsService();
    //     service.route(
    //         {
    //             origin: { lat: origin.lat, lng: origin.lng },
    //             destination: { lat: destination.lat, lng: destination.lng },
    //             waypoints,
    //             travelMode: 'DRIVING',
    //         },
    //         (result, status) => {
    //             if (status === 'OK') {
    //                 setDirectionsResponse(result);
    //             } else {
    //                 console.warn('Directions error:', status);
    //                 setDirectionsResponse(null);
    //             }
    //         }
    //     );
    // }, [selectedCluster, clusteroute, activeTab]);

    // Handle drag-and-drop
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

    // Handle save
    const handleSave = () => {
        const reassignments = [];
        const originalMap = new Map();

        customersClusterMap?.clusters?.forEach((cluster) => {
            cluster.customers.forEach((customer, index) => {
                originalMap.set(customer.customerId, {
                    clusterId: cluster._id,
                    indexNo: index,
                });
            });
        });

        data.forEach((cluster) => {
            cluster.customers.forEach((customer, index) => {
                const original = originalMap.get(customer.customerId);
                if (!original || original.clusterId !== cluster.clusterId || original.indexNo !== index) {
                    reassignments.push({
                        customerId: customer.customerId,
                        newClusterId: cluster.clusterId,
                        indexNo: index,
                    });
                }
            });
        });


        if (reassignments.length > 0) {
            setSaveLoading(true);
            dispatch(editCustomersClusterMap({ reassignments: { reassignments } }))
                .unwrap()
                .then(() => {
                    dispatch(getCustomersClusterMap({ vehicleNo: Number(selectedVehicle) }));
                })
                .catch(() => {
                    dispatch(getCustomersClusterMap({ vehicleNo: Number(selectedVehicle) }));
                })
                .finally(() => {
                    setSaveLoading(false);
                });
        }
    };

    // Handle vehicle selection
    const handleVehicleSelect = (value) => {
        setSelectedVehicle(value);
    };

    // Handle search
    const handleSearch = () => {
        if (searchValue) {
            dispatch(getCustomersClusterMap({ customer_code: searchValue }));
        }
    };

    // Clear search
    const searchClear = () => {
        setSearchValue('');
        dispatch(getCustomersClusterMap({ vehicleNo: Number(selectedVehicle) }));
    };

    // Handle tab change
    // useEffect(() => {
    //     if (activeTab === 'map') {
    //         setShowCluster(true);
    //         setShowRoute(false);
    //         setSelectedCluster(null);
    //         setDirectionsResponse(null);
    //         setSelected(null);
    //     } else if (activeTab === 'route') {
    //         setShowRoute(true);
    //         setShowCluster(false);
    //     } else {
    //         setShowRoute(false);
    //         setShowCluster(true);
    //         setSelected(null);
    //         setSelectedCluster(null);
    //         setDirectionsResponse(null);
    //     }
    // }, [activeTab]);

    const onFreezeUpdate = (clusterId, customerId, isFrozen) => {
    setData((prevData) =>
      prevData.map((cluster) =>
        cluster.clusterId === clusterId
          ? {
              ...cluster,
              customers: cluster.customers.map((cust) =>
                cust.customerId === customerId ? { ...cust, isFrozen } : cust
              ),
            }
          : cluster
      )
    );
  };

    return (
        <div className="mx-auto px-4 sm:px-6 py-6 sm:py-8">
            {/* Tabs + Totals Header */}
            <div className="bg-white p-3 rounded-xl shadow-md mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-wrap gap-3">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.key;
                        return (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 transform border border-gray-600 ${isActive
                                        ? 'bg-gray-800 text-white shadow-sm ring-2 ring-gray-400'
                                        : 'bg-white text-gray-800 hover:bg-gray-200 hover:text-gray-700 hover:scale-[1.02]'
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                <span>{tab.label}</span>
                            </button>
                        );
                    })}
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-5 md:gap-6">
                    <h1 className="px-4 py-2 text-sm font-semibold border-b border-gray-300">Total In Cluster : {customersClusterMap?.totalInClusters}</h1>
                    <h1 className="px-4 py-2 text-sm font-semibold border-b border-gray-300">Total In Vehicle {selectedVehicle} : {customersClusterMap?.totalInRequestedVehicle}</h1>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 min-h-[200px]">
                {activeTab === 'list' && (
                    <ClusterList
                        data={data}
                        mapLoading1={mapLoading1}
                        saveLoading={saveLoading}
                        selectedVehicle={selectedVehicle}
                        searchValue={searchValue}
                        isVisible={isVisible}
                        setSearchValue={setSearchValue}
                        setIsVisible={setIsVisible}
                        vehicles={vehicles}
                        handleVehicleSelect={handleVehicleSelect}
                        handleSearch={handleSearch}
                        searchClear={searchClear}
                        handleSave={handleSave}
                        onDragEnd={onDragEnd}
                        onFreezeUpdate={onFreezeUpdate}
                    />
                )}
                {activeTab === 'map' && (
                    <ClusterMap
                        data={data}
                        selected={selected}
                        setSelected={setSelected}
                        selectedVehicle={selectedVehicle}
                        handleVehicleSelect={handleVehicleSelect}
                        vehicles={vehicles}
                        // handleMapLoad={(map) => { mapRef.current = map; }}
                        clusterDrop={clusterDrop}
                        selectedClusterId={selectedClusterId}
                        setSelectedClusterId={setSelectedClusterId}
                        selectedClusterNumber={selectedClusterNumber}
                        setSelectedVehicle={setSelectedVehicle}
                        setSelectedClusterNumber={setSelectedClusterNumber}
                    />
                )}
                {/* {activeTab === 'route' && (
                    <ClusterRoute
                        route={route}
                        selectedCluster={selectedCluster}
                        setSelectedCluster={setSelectedCluster}
                        directionsResponse={directionsResponse}
                        selected={selected}
                        setSelected={setSelected}
                        mapRef={mapRef}
                        vehicles={vehicles}
                        selectedVehicle={selectedVehicle}
                        handleVehicleSelect={handleVehicleSelect}
                        clusteroute={clusteroute}
                        handleMapLoad={handleMapLoad}
                        clusterDrop={clusterDrop}
                    />
                )} */}
            </div>
        </div>
    );

};

export default MapClusterCopy;