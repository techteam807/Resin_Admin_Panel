// import React from 'react';
// import { GoogleMap, Marker, DirectionsRenderer } from '@react-google-maps/api';
// import { useLoadScript } from '@react-google-maps/api';
// import { Select, Option, Button } from '@material-tailwind/react';
// import { DocumentIcon } from '@heroicons/react/24/solid';
// import { jsPDF } from 'jspdf';
// import { autoTable } from 'jspdf-autotable';
// import customerIcon from '../../../public/img/customerroute.png';
// import WareHouseIcon from '../../../public/img/warehouse.png';

// const LIBRARIES = ['places'];
// const containerStyle = { width: '100%', height: '80vh' };
// const center = { lat: 23.09762579093222, lng: 72.54794212155194 };
// const clusterColors = ['red', 'blue', 'green', 'purple', 'orange', 'cyan', 'magenta', 'SteelBlue'];

// const ClusterRoute = ({
//   route,
//   selectedCluster,
//   setSelectedCluster,
//   directionsResponse,
//   selected,
//   setSelected,
//   mapRef,
//   selectedVehicle,
//   handleVehicleSelect,
//   clusteroute,
// }) => {
//   const { isLoaded } = useLoadScript({
//     googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
//     libraries: LIBRARIES,
//   });

//   const exportToPDF = () => {
//     const clustersToExport = selectedCluster ? clusteroute.filter((c) => c.clusterId === selectedCluster) : clusteroute;
//     if (!clustersToExport || clustersToExport.length === 0) {
//       console.error('Invalid cluster data');
//       return;
//     }

//     const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
//     clustersToExport.forEach((clusteRoute, i) => {
//       if (!clusteRoute.visitSequence || clusteRoute.visitSequence.length === 0) return;
//       if (i > 0) doc.addPage();
//       doc.setFontSize(14);
//       doc.text(
//         `Cluster ${clusteRoute.clusterNo} (vehicle - ${selectedVehicle}) - Total Distance: ${clusteRoute.totalDistance} KM [Cartridge Qty: ${clusteRoute.cartridge_qty}]`,
//         14,
//         15
//       );
//       const tableBody = clusteRoute.visitSequence.map((item, index) => [index + 1, item.customerName, '']);
//       autoTable(doc, {
//         startY: 25,
//         head: [['Seq No', 'Customer Name', 'Coordinates']],
//         body: tableBody,
//         didDrawCell: (data) => {
//           if (data.column.index === 2 && data.cell.section === 'body') {
//             const item = clusteRoute.visitSequence[data.row.index];
//             const lat = item.lat;
//             const lng = item.lng;
//             const url = `https://www.google.com/maps?q=${lat},${lng}`;
//             doc.setTextColor(0, 0, 255);
//             doc.textWithLink('Map Link', data.cell.x + 1, data.cell.y + 5, { url });
//             doc.setTextColor(0, 0, 0);
//           }
//         },
//       });
//     });
//     let fileName = 'All_Clusters_Report.pdf';
//     if (selectedCluster && clustersToExport.length === 1) {
//       const name = clustersToExport[0].clusterNo;
//       fileName = `Cluster_${name}/Vehicle_${selectedVehicle}.pdf`;
//     }
//     doc.save(fileName);
//   };

//   if (!isLoaded) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div>
//       <div className="mt-2 rounded-lg p-2 px-3 flex items-center justify-between">
//         <h5>Cluster Route</h5>
//         <div className="flex items-center gap-2">
//           <Select label="Select Vehicle" onChange={handleVehicleSelect} value={selectedVehicle}>
//             {vehicles.map((vehicle) => (
//               <Option key={vehicle.id} value={vehicle.id}>
//                 {vehicle.name}
//               </Option>
//             ))}
//           </Select>
//           <Select label="Select Cluster" onChange={setSelectedCluster} value={selectedCluster}>
//             {route.map((item, index) => (
//               <Option key={item.clusterId} value={item.clusterId}>
//                 <div className="flex items-center h-4">
//                   <span className="text-5xl mr-2" style={{ color: clusterColors[index % clusterColors.length] }}>
//                     &bull;
//                   </span>
//                   {item.name}
//                 </div>
//               </Option>
//             ))}
//           </Select>
//           <div className="flex items-center gap-1 cursor-pointer text-red-500" onClick={exportToPDF}>
//             <DocumentIcon className="w-5 h-5" />
//             <span>PDF</span>
//           </div>
//         </div>
//       </div>
//       <GoogleMap
//         mapContainerStyle={containerStyle}
//         center={center}
//         zoom={10}
//         onLoad={(map) => (mapRef.current = map)}
//         onClick={() => setSelected(null)}
//       >
//         {route
//           .filter((cluster) => cluster.customers && cluster.customers.length > 0 && cluster.clusterId === selectedCluster)
//           .map((cluster, clusterIndex) =>
//             cluster.customers.map((cust, idx) => {
//               const isWarehouse = cust.displayName === 'Warehouse' || cust.displayName === 'Return to Warehouse';
//               const markerIcon = isWarehouse ? WareHouseIcon : customerIcon;
//               return (
//                 <Marker
//                   key={`route-${cluster.clusterNo}-${idx}`}
//                   position={{ lat: cust.lat, lng: cust.lng }}
//                   onClick={() =>
//                     setSelected({
//                       ...cust,
//                       clusterColor: clusterColors[clusterIndex % clusterColors.length],
//                       isWarehouse,
//                     })
//                   }
//                   icon={{
//                     url: markerIcon,
//                     scaledSize: new window.google.maps.Size(30, 40),
//                     anchor: new window.google.maps.Point(15, 30),
//                   }}
//                 />
//               );
//             })
//           )}
//         {directionsResponse && (
//           <DirectionsRenderer
//             directions={directionsResponse}
//             options={{
//               polylineOptions: {
//                 strokeColor: clusterColors[route.findIndex((c) => c.clusterId === selectedCluster) % clusterColors.length] || '#000',
//                 strokeOpacity: 0.8,
//                 strokeWeight: 5,
//                 zIndex: -1,
//               },
//             }}
//           />
//         )}
//         {selected && (
//           <OverlayView position={{ lat: selected.lat, lng: selected.lng }} mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
//             <div
//               style={{
//                 background: selected.clusterColor,
//                 minWidth: 160,
//                 maxWidth: 260,
//                 color: '#fff',
//                 padding: '6px 10px',
//                 borderRadius: 6,
//                 lineHeight: 1.4,
//                 cursor: 'pointer',
//                 userSelect: 'none',
//                 whiteSpace: 'normal',
//                 wordBreak: 'break-word',
//                 boxShadow: '0 2px 6px rgba(0,0,0,.3)',
//               }}
//             >
//               <strong>{selected.displayName}</strong>
//               <br />
//               {selected.code}
//             </div>
//           </OverlayView>
//         )}
//       </GoogleMap>
//     </div>
//   );
// };

// export default ClusterRoute;
import React, { useEffect, useMemo, useRef } from 'react';
import {
    GoogleMap,
    Marker,
    OverlayView,
    useLoadScript,
    DirectionsRenderer
} from '@react-google-maps/api';
import { Option, Select, Typography } from '@material-tailwind/react';
import Loader from '@/pages/Loader';
import customerIcon from '../../public/img/customerroute.png';
import WareHouseIcon from '../../public/img/warehouse.png';

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
    height: '80vh',
};

const defaultCenter = { lat: 23.09762579093222, lng: 72.54794212155194 };

const ClusterRoute = (
    {
        route,
        selectedCluster,
        setSelectedCluster,
        directionsResponse,
        selected,
        setSelected,
        selectedVehicle,
        vehicles,
        handleVehicleSelect,
        clusterDrop,
        handleMapLoad
    }
) => {

    console.log("selectedCluster:", selectedCluster);


    const mapRef = useRef(null);


    const { isLoaded } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries: LIBRARIES,
    });

    console.log("route:", route);

    useEffect(() => {
        if (!mapRef.current || !route?.visitSequence?.length) return;

        const bounds = new window.google.maps.LatLngBounds();

        route.visitSequence.forEach((visit) => {
            if (!isNaN(visit.lat) && !isNaN(visit.lng)) {
                bounds.extend({ lat: visit.lat, lng: visit.lng });
            }
        });

        if (!bounds.isEmpty()) {
            mapRef.current.fitBounds(bounds);
        }
    }, [route]);

    useEffect(() => {
        if (clusterDrop.length > 0 && !selectedCluster) {
            setSelectedCluster(clusterDrop[0]._id);
        }
    }, [clusterDrop, selectedCluster]);

    const customersWithoutCoords = [];
    const filteredData = route.map((r) => {
        const validCustomers = r.customers?.filter(
            (customer) =>
                customer.lat !== "" &&
                customer.lng !== "" &&
                customer.lat !== null &&
                customer.lng !== null
        ) || [];

        const invalidCustomers = r.customers?.filter(
            (customer) =>
                customer.lat === "" ||
                customer.lng === "" ||
                customer.lat === null ||
                customer.lng === null
        ) || [];

        customersWithoutCoords.push(...invalidCustomers);

        return {
            ...r,
            customers: validCustomers
        };
    })
        .filter((r) => r.customers.length > 0);

    console.log("Filtered clusters for map:", filteredData);
    console.log("Customers without coords:", customersWithoutCoords);

    const clusterColorMap = useMemo(() => {
        const map = {};
        clusterDrop.forEach((cluster, index) => {
            map[cluster.clusterNo] = clusterColors[index % clusterColors.length];
        });
        return map;
    }, [clusterDrop]);

    if (!isLoaded) {
        return <div>
            <Loader />
        </div>;
    }
    return (
        <>
            <div className="rounded-lg p-3 sm:p-4 flex flex-col gap-4 sm:gap-3 lg:flex-row lg:items-center lg:justify-between mb-2">
                <Typography variant="h5" color="blue-gray" className="text-center lg:text-left">
                    Cluster Routes
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
                        <Select
                            label="Select Cluster"
                            value={selectedCluster}
                            onChange={(value) => {
                                setSelectedCluster(value);
                                const cluster = clusterDrop.find(c => c._id === value);
                                if (cluster) {
                                    setSelectedCluster(cluster._id); // store ID if needed
                                }
                            }}
                            disabled={!selectedVehicle}
                            className={selectedVehicle ? 'bg-white' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}
                        >
                            {clusterDrop.map((c, index) => {
                                const color = clusterColors[index % clusterColors.length];
                                return (
                                    <Option key={c._id} value={c._id}>
                                        <div className="flex items-center gap-2">
                                            <span
                                                className="w-4 h-4 rounded-full border border-gray-300"
                                                style={{ backgroundColor: color }}
                                            ></span>
                                            Cluster {c.clusterNo} - ({c.clusterName})
                                        </div>
                                    </Option>
                                );
                            })}
                        </Select>
                    </div>
                </div>
            </div>
            <div className="relative w-full h-[80vh]">
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={defaultCenter}
                    zoom={10}
                    onLoad={handleMapLoad}
                    onClick={() => {
                        setSelected(null);
                    }}
                >

                    {/* Render route markers - ONLY when showRoute is true AND cluster is selected */}
                    {route
                        .filter(
                            (cluster) =>
                                cluster.customers &&
                                cluster.customers.length > 0 &&
                                cluster.clusterId === selectedCluster,
                            // cluster.clusterNo !== 7
                        )

                        .map((cluster) => {
                            const clusterColor = clusterColorMap[cluster.clusterNo];

                            return cluster.customers
                                .filter(
                                    (cust) =>
                                        cust.lat !== "" &&
                                        cust.lng !== "" &&
                                        cust.lat != null &&
                                        cust.lng != null
                                )
                                .map((cust, idx) => {
                                    const isWarehouse =
                                        cust.displayName === "Warehouse" || cust.displayName === "Return to Warehouse"

                                    const markerIcon = isWarehouse ? WareHouseIcon : customerIcon

                                    return (
                                        <Marker
                                        zIndex={1000}
                                            key={`route-${cluster.clusterNo}-${idx}`}
                                            position={{ lat: cust.lat, lng: cust.lng }}
                                            onClick={() =>
                                                setSelected({
                                                    ...cust,
                                                    clusterColor: clusterColor,
                                                    isWarehouse,
                                                })
                                            }
                                            icon={{
                                                url: markerIcon,
                                                scaledSize: new window.google.maps.Size(20, 30),
                                                anchor: new window.google.maps.Point(10, 30),
                                            }}
                                            opacity={ isWarehouse ? 0.4 : 0.6}
                                        />
                                    )
                                });
                        })}


                    {/* Directions renderer */}
                    <DirectionsRenderer
                        directions={directionsResponse}
                        options={{
                            polylineOptions: {
                                strokeColor:
                                    clusterColorMap[
                                    route.find((c) => c.clusterId === selectedCluster || c._id === selectedCluster)?.clusterNo
                                    ] || '#000',

                                strokeOpacity: 0.8,
                                strokeWeight: 5,
                                zIndex: -1,
                            },
                        }}
                    />

                    {selected && (
                        <OverlayView
                            position={{ lat: selected.lat, lng: selected.lng }}
                            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                            onClick={() => setSelected(null)}
                        >
                            <div
                                style={{
                                    background: selected.clusterColor,
                                    minWidth: 160,
                                    maxWidth: 260,
                                    color: "#fff",
                                    padding: "6px 10px",
                                    borderRadius: 6,
                                    lineHeight: 1.4,
                                    cursor: "pointer",
                                    userSelect: "none",
                                    whiteSpace: "normal",
                                    wordBreak: "break-word",
                                    boxShadow: "0 2px 6px rgba(0,0,0,.3)",
                                }}
                            >
                                <strong>{selected.displayName}</strong>
                                <br />
                                {selected.code}
                            </div>
                        </OverlayView>
                    )}
                </GoogleMap>
            </div>
            {customersWithoutCoords.length > 0 && (
                <div className='mt-5'>
                    <Typography variant="h6" color="blue-gray" className="mb-4"> Customers Without Coordinates ({customersWithoutCoords.length}) </Typography>
                    <div className="overflow-x-auto overflow-y-auto max-h-[55vh] scrollbar-thin rounded-lg shadow-md border border-gray-200">
                        <table className="min-w-full table-auto text-sm">
                            <thead className="bg-gray-100 text-gray-700 uppercase tracking-wider text-xs">
                                <tr>
                                    <th className="px-4 py-3 text-left">#</th>
                                    <th className="px-4 py-3 text-left">Customer Name</th>
                                    <th className="px-4 py-3 text-left">Customer Code</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {customersWithoutCoords.map((cust, idx) => (
                                    <tr
                                        key={cust.customerId || idx}
                                        className="hover:bg-gray-50 transition-colors duration-150"
                                    >
                                        <td className="px-4 py-2 font-medium text-gray-600">{idx + 1}</td>
                                        <td className="px-4 py-2 text-gray-800">{cust.displayName?.trim()}</td>
                                        <td className="px-4 py-2 text-gray-800">{cust.code}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </>
    )
}

export default ClusterRoute
