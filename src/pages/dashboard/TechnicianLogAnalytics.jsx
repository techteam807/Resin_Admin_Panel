// import { getTechnicianLogsAnalytics } from "@/feature/technician/technicianSlice";
// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from 'react-redux';
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   ResponsiveContainer,
//   Tooltip
// } from "recharts";


// const performanceData = [
//   { date: "2024-01-01", John: 85, Sarah: 92, Mike: 78, Lisa: 88, David: 91, k: 80, s: 85, v: 90 },
//   { date: "2024-01-08", John: 88, Sarah: 89, Mike: 82, Lisa: 90, David: 87, k: 84, s: 88, v: 86 },
//   { date: "2024-01-15", John: 92, Sarah: 94, Mike: 85, Lisa: 93, David: 89, k: 85, s: 90, v: 88 },
//   { date: "2024-01-22", John: 87, Sarah: 91, Mike: 88, Lisa: 85, David: 92, k: 86, s: 87, v: 89 },
//   { date: "2024-01-29", John: 90, Sarah: 96, Mike: 91, Lisa: 89, David: 94, k: 88, s: 90, v: 92 },
//   { date: "2024-02-05", John: 93, Sarah: 93, Mike: 89, Lisa: 92, David: 88, k: 89, s: 92, v: 91 },
//   { date: "2024-02-12", John: 89, Sarah: 95, Mike: 87, Lisa: 91, David: 90, k: 87, s: 91, v: 90 },
//   { date: "2024-02-19", John: 94, Sarah: 92, Mike: 90, Lisa: 94, David: 93, k: 92, s: 94, v: 93 },
//   { date: "2024-02-20", John: 94, Sarah: 92, Mike: 90, Lisa: 94, David: 93, k: 91, s: 93, v: 94 },
//   { date: "2024-02-21", John: 94, Sarah: 92, Mike: 90, Lisa: 94, David: 93, k: 93, s: 92, v: 95 },
// ];

// const technicians = ["John", "Sarah", "Mike", "Lisa", "David", "k", "s", "v"];

// // Generate dynamic colors
// const generateColor = () => {
//   const letters = "0123456789ABCDEF";
//   let color = "#";
//   for (let i = 0; i < 6; i++) {
//     color += letters[Math.floor(Math.random() * 16)];
//   }
//   return color;
// };

// // Assign unique colors to technicians
// const technicianColors = technicians.reduce((acc, tech) => {
//   let color;
//   do {
//     color = generateColor();
//   } while (Object.values(acc).includes(color));
//   acc[tech] = color;
//   return acc;
// }, {});

// const TechnicianLogAnalytics = () => {
//   const dispatch = useDispatch()
//   const { technicianLogsAnalytics, loading } = useSelector((state) => state.technician);
//   console.log("technicianLogsAnalytics", technicianLogsAnalytics)
//   const [selectedTechnician, setSelectedTechnician] = useState(null);
//   const [showModel, setShowModel] = useState(false);
//   const [data, setData] = useState(null);

//   useEffect(()=> {
//     dispatch(getTechnicianLogsAnalytics())
//   }, [dispatch])

//   // Handle click on chart to get technician and data point
//   const handleChartClick = (event) => {
//     if (!event || !event.activePayload || event.activePayload.length === 0) return;

//     // activePayload contains all points for this x value
//     const payload = event.activePayload[0].payload; // payload of clicked point
//     const clickedValue = event.activePayload[0].value; // value for the clicked line

//     // event.activeTooltipIndex will match index in performanceData
//     const index = event.activeTooltipIndex;

//     let clickedTechnician = null;

//     for (let tech of technicians) {
//       if (performanceData[index][tech] === clickedValue) {
//         clickedTechnician = tech;
//         break;
//       }
//     }

//     if (clickedTechnician) {
//       setSelectedTechnician(clickedTechnician);
//       setData(performanceData[index]);
//       setShowModel(true);
//     }
//   };

//   return (
//     <div className="p-6 space-y-6">
//       <div>
//         <h2 className="text-2xl font-bold">Technician Performance Dashboard</h2>
//         <p className="text-gray-600">
//           Visualize performance data across various metrics.
//         </p>
//       </div>

//       {/* Line Chart */}
//       <div className="bg-white p-6 rounded-lg shadow">
//         <h3 className="text-xl font-semibold mb-4">Performance Trends</h3>
//        <ResponsiveContainer width="100%" height={400}>
//         <LineChart
//             data={performanceData}
//             margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
//         >
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="date" tickFormatter={(date) => date.slice(5)} />
//             <YAxis domain={[75, 100]} />
//             <Tooltip
//             content={({ active, payload, label }) => {
//                 if (active && payload && payload.length) {
//                 return (
//                     <div className="bg-white p-3 rounded shadow text-sm">
//                     <p className="font-semibold">Date: {label}</p>
//                     {payload.map((entry, index) => (
//                         <p key={index} style={{ color: entry.color }}>
//                         {entry.name}: {entry.value}
//                         </p>
//                     ))}
//                     </div>
//                 );
//                 }
//                 return null;
//             }}
//             />
//             {technicians.map((tech) => (
//             <Line
//                 key={tech}
//                 type="monotone"
//                 dataKey={tech}
//                 stroke={technicianColors[tech]}
//                 strokeWidth={selectedTechnician === tech ? 3 : 1}
//                 opacity={
//                 selectedTechnician && selectedTechnician !== tech ? 0.3 : 1
//                 }
//             />
//             ))}
//         </LineChart>
//        </ResponsiveContainer>

//         {/* Technician Buttons */}
//         <div className="flex justify-center gap-2 mt-4">
//           {technicians.map((tech) => (
//             <button
//               key={tech}
//               className={`flex items-center gap-2 px-4 py-2 rounded ${
//                 selectedTechnician === tech
//                   ? "bg-blue-500 text-white"
//                   : "bg-gray-200 hover:bg-gray-300"
//               }`}
//               onClick={() => setSelectedTechnician(tech)}
//             >
//               <span
//                 className="w-4 h-4 rounded-full"
//                 style={{ backgroundColor: technicianColors[tech] }}
//               ></span>
//               {tech}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Modal */}
//       {showModel && data && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
//             <h4 className="text-lg font-bold mb-4">Technician Details</h4>
//             <p>
//               <strong>Technician:</strong> {selectedTechnician}
//             </p>
//             <p>
//               <strong>Date:</strong> {data.date}
//             </p>
//             <p>
//               <strong>Performance:</strong> {data[selectedTechnician]}
//             </p>
//             <button
//               className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
//               onClick={() => setShowModel(false)}
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default TechnicianLogAnalytics









import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip
} from "recharts";
import { getTechnicianLogsAnalytics } from "@/feature/technician/technicianSlice";

// Function to generate a random hex color
const generateColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const TechnicianLogAnalytics = () => {
  const dispatch = useDispatch();
  const { technicianLogsAnalytics, loading } = useSelector((state) => state.technician);

  const [chartData, setChartData] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [technicianColors, setTechnicianColors] = useState({});
  const [selectedTechnician, setSelectedTechnician] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [data, setData] = useState(null);

  // Fetch technician logs analytics on component mount
  useEffect(() => {
    dispatch(getTechnicianLogsAnalytics());
  }, [dispatch]);

  // Process technicianLogsAnalytics when it updates
  useEffect(() => {
    if (technicianLogsAnalytics && technicianLogsAnalytics.length > 0) {
      const transformedData = {};

      technicianLogsAnalytics.forEach(item => {
        const { date, technician, averageEfficiencyScore } = item;

        if (!transformedData[date]) {
          transformedData[date] = { date };
        }
        transformedData[date][technician] = averageEfficiencyScore;
      });

      const dataArray = Object.values(transformedData);
      setChartData(dataArray);

      const uniqueTechnicians = [
        ...new Set(technicianLogsAnalytics.map(item => item.technician))
      ];
      setTechnicians(uniqueTechnicians);

      // Assign unique colors to technicians
      const colors = {};
      uniqueTechnicians.forEach(tech => {
        let color;
        do {
          color = generateColor();
        } while (Object.values(colors).includes(color));
        colors[tech] = color;
      });
      setTechnicianColors(colors);
    }
  }, [technicianLogsAnalytics]);

  // Handle click on chart to get technician and data point
  const handleChartClick = (event) => {
    if (!event || !event.activePayload || event.activePayload.length === 0) return;

    const payload = event.activePayload[0].payload;
    const clickedValue = event.activePayload[0].value;
    const index = event.activeTooltipIndex;

    let clickedTechnician = null;
    for (let tech of technicians) {
      if (chartData[index][tech] === clickedValue) {
        clickedTechnician = tech;
        break;
      }
    }

    if (clickedTechnician) {
      setSelectedTechnician(clickedTechnician);
      setData(chartData[index]);
      setShowModal(true);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Technician Performance Dashboard</h2>
        <p className="text-gray-600">
          Visualize performance data across various metrics.
        </p>
      </div>

      {/* Line Chart */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">Performance Trends</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
            onClick={handleChartClick}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tickFormatter={(date) => date.slice(5)} />
            <YAxis domain={[0, 100]} />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white p-3 rounded shadow text-sm">
                      <p className="font-semibold">Date: {label}</p>
                      {payload.map((entry, index) => (
                        <p key={index} style={{ color: entry.color }}>
                          {entry.name}: {entry.value}
                        </p>
                      ))}
                    </div>
                  );
                }
                return null;
              }}
            />
            {technicians.map((tech) => (
              <Line
                key={tech}
                type="monotone"
                dataKey={tech}
                stroke={technicianColors[tech]}
                strokeWidth={selectedTechnician === tech ? 3 : 1}
                opacity={
                  selectedTechnician && selectedTechnician !== tech ? 0.3 : 1
                }
              />
            ))}
          </LineChart>
        </ResponsiveContainer>

        {/* Technician Buttons */}
        <div className="flex justify-center gap-2 mt-4">
          {technicians.map((tech) => (
            <button
              key={tech}
              className={`flex items-center gap-2 px-4 py-2 rounded ${
                selectedTechnician === tech
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
              onClick={() => setSelectedTechnician(tech)}
            >
              <span
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: technicianColors[tech] }}
              ></span>
              {tech}
            </button>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && data && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h4 className="text-lg font-bold mb-4">Technician Details</h4>
            <p>
              <strong>Technician:</strong> {selectedTechnician}
            </p>
            <p>
              <strong>Date:</strong> {data.date}
            </p>
            <p>
              <strong>Performance:</strong> {data[selectedTechnician]}
            </p>
            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TechnicianLogAnalytics;
