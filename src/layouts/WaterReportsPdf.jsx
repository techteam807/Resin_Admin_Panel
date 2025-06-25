import React, { useRef, useState } from 'react';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ArrowDownTrayIcon } from "@heroicons/react/24/solid";
import { useLocation } from 'react-router-dom';
import { generateWaterReports, uploadWaterReport } from '@/feature/waterReports/waterReportsSlice';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import html2pdf from 'html2pdf.js'
import WaterReportsTemplate from './WaterReportsTemplate';
import { id } from 'date-fns/locale';

const waterComparisons = [
  { source: "Loch Katrine (Scotland)", hardness: 15, color: "bg-red-500" },
  { source: "Gangotri (glacial origin of Ganga)", hardness: 40, color: "bg-blue-400" },
  { source: "Your Water", hardness: 5, color: "bg-green-500" },
  { source: "Brahmaputra", hardness: 220, color: "bg-amber-400" },
  { source: "Narmada", hardness: 250, color: "bg-amber-500" },
  { source: "Ganga (midstream and downstream)", hardness: 200, color: "bg-amber-600" },
  { source: "Evian", hardness: 300, color: "bg-red-400" },
  { source: "Yamuna (especially near Delhi)", hardness: 400, color: "bg-red-500" },
]

const WaterReportsPdf = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const [template, setTemplate] = useState(false);
  const { customer, month, year } = location.state || {};
  console.log("Cust:", customer);
  const reportRef = useRef(null)

  const customerId = customer?.user?._id;

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const d = String(date.getDate()).padStart(2, '0');
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const y = String(date.getFullYear()).slice(2);
    return `${d}/${m}/${y}`;
  };

  const waterQualityData = Object.values(customer.scores)
    .flat()
    .filter(item => !item.status)
    .map(item => ({
      date: formatDate(item.createdAt),
      hardness: Number(item.score),
      id: item.id,
    }))
    .slice(0, 4);

  console.log(waterQualityData);

  const logIds = waterQualityData.map((w) => w.id);
  console.log(logIds);


  const generatePDF = async () => {
    const element = reportRef.current
    if (!element) return
    try {
      // Generate PDF blob from HTML
      const opt = {
        margin: 0.5,
        filename: `${Date.now()}-report.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };

      const pdfBlob = await html2pdf().from(element).set(opt).outputPdf('blob');

      const uploadResult = await dispatch(uploadWaterReport(pdfBlob)).unwrap();

      const docUrl = uploadResult.data.uploadedUrl;
      dispatch(generateWaterReports({ customerId, logIds, docUrl }));
    } catch (err) {
      console.error('Error generating/uploading PDF:', err);
    }
  }

  const downloadPdf = async () => {
     const element = reportRef.current
    if (!element) return
    window.print();
  }
const {loading} = useSelector((state) => state.waterReport);

const userData = {
  id: customer?.user?._id,
  name: customer?.user?.display_name,
  waterQualityData: waterQualityData,
}

if (template) return <WaterReportsTemplate closeTemplate={() => setTemplate(false)} customerData = {userData}/>;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Water Quality Report</h1>
          <button
  onClick={generatePDF}
  disabled={loading}
  className={`flex items-center gap-2 px-4 py-2 rounded text-white 
    ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-black'}`}
>
  {loading ? (
    <>
      <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
      </svg>
      Sending...
    </>
  ) : (
    <>
      <ArrowDownTrayIcon className="h-4 w-4 bg-" />
      Send PDF
    </>
  )}
</button>
<button onClick={() => setTemplate(true)} className='flex items-center gap-2 bg-black text-white px-4 py-2 rounded'>View Template</button>

          <button onClick={downloadPdf} className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded">
            <ArrowDownTrayIcon className="h-4 w-4" />
            Download PDF
          </button>
        </div>

        <div ref={reportRef} className="bg-white p-8 rounded-lg shadow-md space-y-8">
          {/* Header */}
          <div className="text-center space-y-2 pb-6 border-b">
            <h1 className="text-3xl font-bold text-gray-900">Your 30 Day Report is here</h1>
            <p className="text-xl font-semibold text-gray-700">{customer?.user?.display_name}</p>
            <p className="text-sm text-gray-500 max-w-md mx-auto">Promoting better wellness through Betterwater</p>
          </div>

          {/* Replacements */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Replacements</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                {waterQualityData.map((item, index) => {
                  // Split "dd/mm/yy"
                  const [dayStr, monthStr, yearStr] = item.date.split("/");
                  // Convert to full year: e.g. "25" -> "2025"
                  const fullYear = 2000 + parseInt(yearStr, 10);
                  // Create a JS Date object: year, month (0-based), day
                  const dateObj = new Date(fullYear, parseInt(monthStr, 10) - 1, parseInt(dayStr, 10));

                  // Extract day and full month name
                  const day = dateObj.getDate();
                  const monthName = dateObj.toLocaleString("default", { month: "long" });

                  // Function to get ordinal suffix for numbers (1st, 2nd, 3rd, etc.)
                  const ordinalSuffix = (n) => {
                    const s = ["th", "st", "nd", "rd"],
                      v = n % 100;
                    return n + (s[(v - 20) % 10] || s[v] || s[0]);
                  };

                  return (
                    <p key={index} className="text-gray-600">
                      {ordinalSuffix(index + 1)} Replacement - {day} {monthName}
                    </p>
                  );
                })}
              </div>

              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <p className="text-gray-600">In the last 30 days there were a total of</p>
                <p className="text-3xl font-bold text-blue-600">{waterQualityData.length}</p>
                <p className="text-gray-600">replacements</p>
              </div>
            </div>
          </div>

          {/* Water Quality */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">Water Quality</h2>
              <div className="text-right">
                <p className="text-gray-600">On an Average your water quality maintained at</p>
                <p className="text-lg font-semibold text-emerald-600">~5 mg/L of hardness</p>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={waterQualityData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 120]} label={{ value: "mg/L", angle: -90, position: "insideLeft" }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="hardness" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="text-center text-sm text-gray-500">
              <span className="block">120 mg/L (Very Hard)</span>
              <div className="flex justify-between mt-1">
                {waterQualityData.map((item, index) => (
                  <div key={index} className="text-center">
                    <span className="block">{item.hardness} mg/L</span>
                    <span className="block">{item.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Comparison */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Comparing your water with the world</h2>
            <div className="space-y-2">
              {waterComparisons.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full ${item.color}`}></div>
                  <span className="flex-1 text-gray-700">{item.source}</span>
                  <span className="font-medium text-gray-900">{item.hardness} mg/L</span>
                </div>
              ))}
            </div>
          </div>

          {/* Citations */}
          <div className="space-y-2 text-sm text-gray-600 border-t pt-4">
            <h3 className="font-semibold">Citations</h3>
            <ol className="list-decimal pl-5 space-y-2">
              <li>
                <strong>Gangotri (glacial origin of Ganga)</strong>
                <p>Hardness estimate: ~20–40 mg/L (soft)</p>
                <p>Source: "Hydrochemical study of Gangotri glacier meltwater", Singh et al., Current Science, 2000</p>
                <p>Central Ground Water Board (CGWB), India – Ganga Basin Reports</p>
              </li>
              <li>
                <strong>Brahmaputra</strong>
                <p>Hardness estimate: ~180–220 mg/L</p>
                <p>Source: "Hydrochemistry of the Brahmaputra River", Geological Survey of India</p>
                <p>Environmental Monitoring Reports by Assam State Pollution Control Board</p>
              </li>
              <li>
                <strong>Narmada</strong>
                <p>Hardness estimate: ~200–250 mg/L</p>
                <p>Source: Narmada Water Resources Authority Reports</p>
                <p>CGWB: Hydrogeological Reports of Central India</p>
              </li>
              <li>
                <strong>Ganga (midstream and downstream)</strong>
                <p>Hardness estimate: ~150–200 mg/L</p>
                <p>Source: CPCB (Central Pollution Control Board) Ganga Water Quality Status Reports</p>
                <p>Environmental Earth Sciences journal articles</p>
              </li>
              <li>
                <strong>Yamuna (especially near Delhi)</strong>
                <p>Hardness estimate: ~300–400+ mg/L</p>
                <p>Source: Delhi Jal Board Water Quality Reports</p>
                <p>CPCB Yamuna Action Plan Reports</p>
                <p>"Pollution Load and Water Quality of the Yamuna River", Indian J. Environmental Protection</p>
              </li>
              <li>
                <strong>Evian</strong>
                <p>Hardness estimate: ~300+ mg/L (naturally mineralized)</p>
                <p>Source: Evian Official Mineral Composition Report</p>
              </li>
              <li>
                <strong>Loch Katrine (Scotland)</strong>
                <p>~10–15 mg/L</p>
                <p>Source: Scottish Water Quality Reports</p>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WaterReportsPdf;