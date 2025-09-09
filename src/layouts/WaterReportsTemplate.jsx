import React, { useState } from 'react';
import page1 from '../../public/img/wp1.png';
import page2 from '../../public/img/wp2.png';
import page3 from '../../public/img/wp3.png';
import page4 from '../../public/img/wp4.png';
import page5 from '../../public/img/wp5.png';
import page6 from '../../public/img/wp6.png';
import page7 from '../../public/img/wp7.png';
import { ChevronLeftIcon, ChevronRightIcon, DocumentIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { Button } from '@material-tailwind/react';
import { generateWaterReports, uploadWaterReport } from '@/feature/waterReports/waterReportsSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';


const waitForPaint = () =>
  new Promise((resolve) => {
    requestAnimationFrame(() => setTimeout(resolve, 0))
})

const WaterReportsTemplate = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  const { customer, month, year } = location.state || {};
  console.log("c:",customer);
  

  // const userName = customer?.user?.first_name;
const userName = `${customer?.user?.first_name || ''} ${customer?.user?.last_name || ''}`.trim();
  
  const safeName = userName.replace(/\s+/g, "_");

    const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const d = String(date.getDate()).padStart(2, '0');
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const y = String(date.getFullYear()).slice(2);
    return `${d}/${m}/${y}`;
  };

  // const waterQualityData = Object.values(customer.scores)
  //     .flat()
  //     .filter(item => !item.status)
  //     .map(item => ({
  //       date: formatDate(item.createdAt),
  //       hardness: Number(item.score),
  //       id: item.id,
  //     }))
  //     .slice(0, 4);
  // console.log("water",waterQualityData);

  const waterQualityData = Object.values(customer.scores)
  .flat()
  .filter(item => !item.status)
  .map(item => ({
    date: formatDate(item.createdAt), // DD/MM/YY
    hardness: Number(item.score),
    id: item.id,
  }))
  // Sort by day of month (DD)
  .sort((a, b) => {
    const dayA = Number(a.date.split("/")[0]);
    const dayB = Number(b.date.split("/")[0]);
    return dayA - dayB;
  })
  .slice(0, 4); // or remove slice to show all

console.log("water sorted", waterQualityData);
      
  
  const customerId = customer?.user?._id;
  const logIds = waterQualityData.map((w) => w.id);

  const totalPages = 7
  const [currentPage, setCurrentPage] = useState(1);
  const base = "w-full h-full relative bg-cover bg-center bg-no-repeat"
  function renderPage(page) {
    switch (page) {
      case 1:
        return (
         <div className={base} style={{ backgroundImage: `url(${page1})` }}>
            <div className="absolute top-[15px] left-[15px] right-[80px]">
              <h1 className="text-[40px] font-bold text-white leading-[1.1]">
                Hey, <span>{userName}</span>
              </h1>
              <h2 className="text-[40px] font-bold text-[#f2daa5] leading-[1.1] mt-2">Your 30 Day</h2>
              <h2 className="text-[40px] font-bold text-[#f2daa5] leading-[1.1] mt-2">Report is here</h2>
            </div>
          </div>
        )
      case 2:
        return (
          <div className={base} style={{ backgroundImage: `url(${page2})` }}>
            {/* <div className='absolute right-[125px] text-[#f3daa5] space-y-4 text-[25px] top-[340px]'>
              <div>2025-01-01</div>
              <div>2025-01-01</div>
              <div>2025-01-01</div>
              <div>2025-01-01</div>
            </div> */}
            {Array.isArray(waterQualityData) && (
  <div className='absolute right-[140px] text-[#f3daa5] space-y-4 text-[25px] top-[338px]'>
    {waterQualityData.map((entry) => (
      <div key={entry.id}>{entry.date}</div>
    ))}
  </div>
)}

          </div>
        )
      case 3:
        return (
          <div className={base} style={{ backgroundImage: `url(${page3})` }}>
            {/* <div className='absolute bottom-[240px] flex left-[200px] gap-[40px]'>
              <div>10 mg/L</div>
              <div>10 mg/L</div>
              <div>10 mg/L</div>
              <div>10 mg/L</div>
            </div>
            <div className='absolute bottom-[120px] flex left-[190px] gap-[20px]'>
              <div>2025-01-01</div>
              <div>2025-01-01</div>
              <div>2025-01-01</div>
              <div>2025-01-01</div>
            </div> */}
            {Array.isArray(waterQualityData) && (
  <>
    {/* Hardness values */}
    <div className='absolute bottom-[240px] flex left-[200px] gap-[40px]'>
      {waterQualityData.map((entry) => (
        <div key={entry.id}>{entry.hardness} mg/L</div>
      ))}
    </div>

    {/* Dates */}
    <div className='absolute bottom-[120px] flex left-[190px] gap-[20px]'>
      {waterQualityData.map((entry) => {
        const [day, month, year] = entry.date.split('/');
        const formattedDate = `20${year}-${month}-${day}`; // Converts DD/MM/YY to YYYY-MM-DD
        return <div key={entry.id}>{formattedDate}</div>;
      })}
    </div>
  </>
)}

          </div>
        )
      case 4:
        return <div className={base} style={{ backgroundImage: `url(${page4})` }} />
      case 5:
        return <div className={base} style={{ backgroundImage: `url(${page5})` }} />
      case 6:
        return <div className={base} style={{ backgroundImage:`url(${page6})` }} />
      case 7:
        return <div className={base} style={{ backgroundImage:`url(${page7})` }}>
          <h1 className='absolute top-[120px] left-[80px] text-[20px] font-bold'>Citations</h1>
          <div className='absolute top-[150px] left-[80px]'>
            <ol>
              <li className='text-[14px] mt-1'>1. Gangotri (glacial origin of Ganga)
              <ul className='list-disc ml-8'>
                <li className='text-[10px] mt-1'>Hardness estimate: ~20–40 mg/L (soft)</li>
                <li className='text-[10px] mt-1'>Source: Based on glacier meltwater analysis from:
                  <ul className='list-disc ml-4'>
                    <li className='text-[10px] mt-1'>“Hydrochemical study of Gangotri glacier meltwater”, Singh et al., Current Science, 2000</li>
                    <li className='text-[10px] mt-1'>Central Ground Water Board (CGWB), India – Ganga Basin Reports</li>
                  </ul>
                </li>
              </ul>
              </li>

              <li className='text-[14px] mt-1'>2. Brahmaputra
              <ul className='list-disc ml-8'>
                <li className='text-[10px] mt-1'>Hardness estimate: ~180–220 mg/L</li>
                <li className='text-[10px] mt-1'>Source:
                  <ul className='list-disc ml-4'> 
                    <li className='text-[10px] mt-1'>“Hydrochemistry of the Brahmaputra River”, Geological Survey of India</li>
                    <li className='text-[10px] mt-1'>Environmental Monitoring Reports by Assam State Pollution Control Board</li>
                  </ul> 
                </li>
              </ul>            
              </li> 

              <li className='text-[14px] mt-1'>3. Narmada
              <ul className='list-disc ml-8'>
                <li className='text-[10px] mt-1'>Hardness estimate: ~200–250 mg/L</li>
                <li className='text-[10px] mt-1'>Source:
                  <ul className='list-disc ml-4'>
                    <li className='text-[10px] mt-1'>Narmada Water Resources Authority Reports</li>
                    <li className='text-[10px] mt-1'>CGWB: Hydrogeological Reports of Central India</li>
                  </ul> 
                </li>
              </ul>
              </li>

              <li className='text-[14px] mt-1'>4. Ganga (midstream and downstream)
              <ul className='list-disc ml-8'>
                <li className='text-[10px] mt-1'>Hardness estimate: ~150–200 mg/L</li>
                <li className='text-[10px] mt-1'>Source:
                  <ul className='list-disc ml-4'>
                    <li className='text-[10px] mt-1'>CPCB (Central Pollution Control Board) Ganga Water Quality Status Reports</li>
                    <li className='text-[10px] mt-1'>Environmental Earth Sciences journal articles</li>
                  </ul>
                </li>
              </ul>
              </li>

              <li className='text-[14px] mt-1'>5. Yamuna (especially near Delhi)
              <ul className='list-disc ml-8'>
                <li className='text-[10px] mt-1'>Hardness estimate: ~300–400+ mg/L</li>
                <li className='text-[10px] mt-1'>Source:
                  <ul className='list-disc ml-4'>
                    <li className='text-[10px] mt-1'>Delhi Jal Board Water Quality Reports</li>
                    <li className='text-[10px] mt-1'>CPCB Yamuna Action Plan Reports</li>
                    <li className='text-[10px] mt-1'>“Pollution Load and Water Quality of the Yamuna River”, Indian J. Environmental Protection</li>
                  </ul>
                </li>
              </ul>
              </li>

              <li className='text-[14px] mt-1'>6. Evian
              <ul className='list-disc ml-8'>
                <li className='text-[10px] mt-1'>Hardness estimate: ~300+ mg/L (naturally mineralized)</li>
                <li className='text-[10px] mt-1'>Source: 
                  <ul className='list-disc ml-4'>
                    <li className='text-[10px] mt-1'> 
                  Evian Official Mineral Composition Report</li>
              </ul>
                </li>
              </ul>
              </li>

              <li className='text-[14px] mt-1'>7. Loch Katrine (Scotland)
              <ul className='list-disc ml-8'>
                <li className='text-[10px] mt-1'>~10–15 mg/L</li>
                <li className='text-[10px] mt-1'>Source: 
                  <ul className='list-disc ml-4'>
                    <li className='text-[10px] mt-1'>
                  Scottish Water Quality Reports</li>      
              </ul>
                </li>
              </ul>
              </li>
            </ol>
          </div>
          </div>
      default:
        return null
    }
  }

//   async function handleDownload() {
//   const { default: html2canvas } = await import("html2canvas")
//   const { jsPDF } = await import("jspdf")

//   const pdf = new jsPDF("p", "mm", "a4")

//   for (let p = 1; p <= totalPages; p++) {
//     setCurrentPage(p)
//     await waitForPaint()

//     // Give time for page render
//     await new Promise((resolve) => setTimeout(resolve, 300))

//     const node = document.getElementById("pdf-page")
//     if (!node) continue

//     const canvas = await html2canvas(node, {
//       scale: 3, // sharper but still reasonable
//       useCORS: true, // make sure external images render
//     })
//     const img = canvas.toDataURL("image/jpeg", 0.92) // JPEG helps reduce size

//     const width = pdf.internal.pageSize.getWidth()
//     const height = (canvas.height * width) / canvas.width

//     if (p > 1) pdf.addPage()
//     pdf.addImage(img, "JPEG", 0, 0, width, height)
//   }

//   try {
//  const blob = pdf.output("blob");
//  const uploadResult = await dispatch(uploadWaterReport(blob)).unwrap();
//     const docUrl = uploadResult.data.uploadedUrl;
//      dispatch(generateWaterReports({ customerId, logIds, docUrl }));
//       pdf.save(`${safeName}_30_Day_Report.pdf`);
//   }
//   catch (error) {
//     console.error("Error generating/uploading PDF:", error);
//   }
//   }

  async function handleDownload() {
  const { default: html2canvas } = await import("html2canvas");
  const { jsPDF } = await import("jspdf");

  const pdf = new jsPDF("p", "mm", "a4");

  for (let p = 1; p <= totalPages; p++) {
    setCurrentPage(p);
    await waitForPaint();

    await new Promise((resolve) => setTimeout(resolve, 300));

    const node = document.getElementById("pdf-page");
    if (!node) continue;

    const canvas = await html2canvas(node, {
      scale: 3,
      useCORS: true,
    });
    const img = canvas.toDataURL("image/jpeg", 0.92);

    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;

    if (p > 1) pdf.addPage();
    pdf.addImage(img, "JPEG", 0, 0, width, height);
  }

  pdf.save(`${safeName}_30_Day_Report.pdf`);
}

async function handleUpload() {
  const { default: html2canvas } = await import("html2canvas");
  const { jsPDF } = await import("jspdf");

  const pdf = new jsPDF("p", "mm", "a4");

  for (let p = 1; p <= totalPages; p++) {
    setCurrentPage(p);
    await waitForPaint();

    await new Promise((resolve) => setTimeout(resolve, 300));

    const node = document.getElementById("pdf-page");
    if (!node) continue;

    const canvas = await html2canvas(node, {
      scale: 3,
      useCORS: true,
    });
    const img = canvas.toDataURL("image/jpeg", 0.92);

    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;

    if (p > 1) pdf.addPage();
    pdf.addImage(img, "JPEG", 0, 0, width, height);
  }

  try {
    const blob = pdf.output("blob");
    const uploadResult = await dispatch(uploadWaterReport(blob)).unwrap();
    const docUrl = uploadResult.data.uploadedUrl;
    dispatch(generateWaterReports({ customerId, logIds, docUrl }));
  } catch (error) {
    console.error("Error uploading PDF:", error);
  }
}

const {loading} = useSelector((state) => state.waterReport);

  return (
    <>
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex flex-col items-center mb-4 w-full max-w-2xl mx-auto rounded-lg bg-gray-300 p-4">
        <div className='flex w-full justify-between mb-4'>
        <h1 className="text-xl font-bold">Better Water – 30 Day Report</h1>
        <Link to='/dashboard/water-reports' className='hover:underline'>Back To Water Reports</Link>
        </div>
        <div className='flex w-full justify-between'>
          <Button onClick={handleDownload} className="flex items-center gap-2">
          <DocumentIcon className="h-4 w-4" />
          Download PDF
        </Button>
        <Button onClick={handleUpload} className="flex items-center gap-2">
          <DocumentIcon className="h-4 w-4" />
          {loading ? "Sending.." : "Send Pdf"}
        </Button>
        </div>
      </div>
      <div id="pdf-page" className="aspect-[210/297] w-full max-w-2xl mx-auto rounded-lg overflow-hidden shadow-lg">
        {renderPage(currentPage)}
      </div>
      <div className="flex justify-center items-center gap-4 mt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className='flex items-center justify-center gap-2'
        >
          <ChevronLeftIcon className="h-4 w-4" />
          Prev
        </Button>
        <span className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className='flex items-center justify-center gap-2'

        >
          Next
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
</>
  )
}

export default WaterReportsTemplate