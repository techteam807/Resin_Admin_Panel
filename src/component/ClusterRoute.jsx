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
import React from 'react';
import {
    GoogleMap,
    Marker,
    OverlayView,
    useLoadScript,
    DirectionsRenderer
} from '@react-google-maps/api';
import { Option, Select } from '@material-tailwind/react';
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
    height: '80vh',
};

const center = { lat: 23.09762579093222, lng: 72.54794212155194 };

const ClusterRoute = (
    {
        route,
        selectedCluster,
        setSelectedCluster,
        directionsResponse,
        selected,
        setSelected,
        mapRef,
        selectedVehicle,
        vehicles,
        handleVehicleSelect,
        clusteroute,
        handleMapLoad
    }
) => {

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries: LIBRARIES,
    });

    if (!isLoaded) {
        return <div>
            <Loader />
        </div>;
    }
    return (
        <div style={{ width: '100%', height: '80vh', position: 'relative' }}>
            <div className="mt-2 rounded-lg p-2 px-3 flex items-center justify-between">
                <h5 className="text-base font-semibold">Cluster Map</h5>
                <Select label="Select Vehicle" onChange={handleVehicleSelect} value={selectedVehicle}>
                    {vehicles.map((vehicle) => (
                        <Option key={vehicle.id} value={vehicle.id}>
                            {vehicle.name}
                        </Option>
                    ))}
                </Select>
            </div>

            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
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
                        .map((cluster, clusterIndex) =>
                            cluster.customers.map((cust, idx) => {
                                const isWarehouse =
                                    cust.displayName === "Warehouse" || cust.displayName === "Return to Warehouse"

                                const markerIcon = isWarehouse ? WareHouseIcon : customerIcon

                                return (
                                    <Marker
                                        key={`route-${cluster.clusterNo}-${idx}`}
                                        position={{ lat: cust.lat, lng: cust.lng }}
                                        onClick={() =>
                                            setSelected({
                                                ...cust,
                                                clusterColor: clusterColors[clusterIndex % clusterColors.length],
                                                isWarehouse,
                                            })
                                        }
                                        icon={{
                                            url: markerIcon,
                                            scaledSize: new window.google.maps.Size(30, 40),
                                            anchor: new window.google.maps.Point(15, 30),
                                        }}
                                    />
                                )
                            }),
                        )}


                {/* Directions renderer */}
                    <DirectionsRenderer
                        directions={directionsResponse}
                        options={{
                            polylineOptions: {
                                strokeColor:
                                    clusterColors[
                                    route.findIndex(c => c.clusterId === selectedCluster) % clusterColors.length
                                    ] || "#000",
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
    )
}

export default ClusterRoute
