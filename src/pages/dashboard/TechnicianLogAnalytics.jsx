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
import { Button, Input } from "@material-tailwind/react";
import { FunnelIcon } from "@heroicons/react/24/solid";
import Loader from "../Loader";


const getCurrentMonthDates = () => {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const start = new Date(currentYear, currentMonth, 1);
  const end = new Date(currentYear, currentMonth + 1, 0);

  return {
    startDate: start.toLocaleDateString('en-CA'),
    endDate: end.toLocaleDateString('en-CA'),
  };
};

// Function to generate a random hex color
const generateColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const TechnicianLogAnalytics = ({ onBack }) => {
  const dispatch = useDispatch();
  const { technicianLogsAnalytics, loading } = useSelector((state) => state.technician);

  const [chartData, setChartData] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [technicianColors, setTechnicianColors] = useState({});
  const [selectedTechnician, setSelectedTechnician] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [data, setData] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Fetch technician logs analytics on component mount
  useEffect(() => {
    const { startDate, endDate } = getCurrentMonthDates();
    setStartDate(startDate);
    setEndDate(endDate);
    dispatch(getTechnicianLogsAnalytics({ startDate, endDate }));
  }, []);

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

  const handleSearch = () => {
    console.log("clcik");
    dispatch(getTechnicianLogsAnalytics({ startDate, endDate }));
  };

  const handleClear = () => {
    const { startDate: defaultStart, endDate: defaultEnd } = getCurrentMonthDates();
    setStartDate(defaultStart);
    setEndDate(defaultEnd);
    dispatch(getTechnicianLogsAnalytics({ startDate: defaultStart, endDate: defaultEnd }));
  };

  return (
    <div className="p-6 space-y-6">
       <div className="lg:flex flex-col bg-white lg:p-5 rounded-xl p-3">
        <div className="flex md:justify-between items-center mb-5">
        <div className="text-center lg:text-left">
          <h2 className="text-2xl font-bold text-gray-800">Technician Performance Dashboard</h2>
          <p className="text-gray-600">
            Visualize performance data across various metrics.
          </p>
        </div>
        <div className="w-full md:w-auto text-center">
<Button className="px-4 py-3" onClick={onBack}>
            Go to Technician Log
          </Button>
        </div>
        </div>
        <div className="flex lg:flex-row flex-col items-center gap-2 lg:gap-5 space-y-5 lg:space-y-0">
          <div className="w-full md:w-auto">
            <Input
              type="date"
              label="Start Date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="w-full md:w-auto">
            <Input
              type="date"
              label="End Date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3">
            <Button variant="gradient" className="px-4 py-3 flex items-center gap-2" onClick={handleSearch}>
            <FunnelIcon className="h-4 w-4 text-white" />
            <span className="text-white">Apply</span>
          </Button>
          <Button variant="outlined" onClick={handleClear}>
            Clear
          </Button>
          </div>
        </div>
        </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">Performance Trends</h3>
        {loading ? (
          <Loader />
        ) : technicianLogsAnalytics && technicianLogsAnalytics.length > 0 ? (
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
        ) : (
          <div className="text-center text-gray-500">No data found.</div>
        )}
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
