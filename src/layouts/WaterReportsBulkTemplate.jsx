import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { uploadWaterReportBulk } from '@/feature/waterReports/waterReportsSlice';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Button } from '@material-tailwind/react';
import page1 from '../../public/img/wp1.png';
import page2 from '../../public/img/wp2.png';
import page3 from '../../public/img/wp3.png';
import page4 from '../../public/img/wp4.png';
import page5 from '../../public/img/wp5.png';
import page6 from '../../public/img/wp6.png';
import page7 from '../../public/img/wp7.png';

const waitForPaint = () => new Promise((resolve) => requestAnimationFrame(() => setTimeout(resolve, 0)));

const WaterReportsBulkTemplate = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { customers, month, year } = location.state || {};
  console.log("customers:", customers, "month:", month, "year:", year);
  const [processing, setProcessing] = useState(false);
  const { loading } = useSelector((state) => state.waterReport);

  const totalPages = 7;
  
  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const d = String(date.getDate()).padStart(2, '0');
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const y = String(date.getFullYear()).slice(2);
    return `${d}/${m}/${y}`;
  };

  function renderPageForCustomer(customer, currentPage = 1) {
    console.log("Rendering page", currentPage, "for customer:", customer);
    
    const userName = `${customer?.user?.first_name || ''} ${customer?.user?.last_name || ''}`.trim();
    const waterQualityData = Object.values(customer.scores)
      .flat()
      .filter(item => !item.status)
      .map(item => ({
        date: formatDate(item.createdAt),
        hardness: Number(item.score),
        id: item.id,
      }))
      .slice(0, 4);
const base = "w-full h-full relative bg-cover bg-center bg-no-repeat"
    switch (currentPage) {
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
        <div className='absolute right-[175px] text-[#f3daa5] space-y-7 text-[25px] top-[400px]'>
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
          <div className='absolute bottom-[275px] flex left-[240px] gap-[60px]'>
            {waterQualityData.map((entry) => (
              <div key={entry.id}>{entry.hardness} mg/L</div>
            ))}
          </div>
      
          {/* Dates */}
          <div className='absolute bottom-[140px] flex left-[240px] gap-[35px]'>
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
                default: return null;
    }
  }

// const handleBulkUpload = async () => {
//   setProcessing(true);
//   try {
//     const formData = new FormData();
//     const customersLogsMap = {};
    
//     for (const c of customers) {
//       // Populate the logs map
//       customersLogsMap[c.user._id] = Object.values(c.scores)
//         .flat()
//         .map(item => item.id)
//         .filter(Boolean);

//       const pdf = new jsPDF("p", "mm", "a4");
//       for (let p = 1; p <= totalPages; p++) {
//         const pageDiv = document.getElementById(`pdf-page-${c.user._id}-page-${p}`);
//         if (!pageDiv) continue;

//         pageDiv.style.position = "absolute";
//         pageDiv.style.top = "-9999px";
//         pageDiv.style.display = "block";

//         await waitForPaint();
//         await new Promise(r => setTimeout(r, 300));

//         const canvas = await html2canvas(pageDiv, { scale: 3, useCORS: true });
//         const img = canvas.toDataURL("image/jpeg", 0.92);
//         const width = pdf.internal.pageSize.getWidth();
//         const height = (canvas.height * width) / canvas.width;

//         if (p > 1) pdf.addPage();
//         pdf.addImage(img, "JPEG", 0, 0, width, height);

//         pageDiv.style.display = "none";
//       }

//       const blob = pdf.output("blob");
//       const fileName = `${c.user.contact_number}-Report.pdf`;
//       formData.append("files", blob, fileName);
//     }

//     const customerCodeToIdsMap = {};
// customers.forEach(c => {
//   const code = c.user.customer_code; // e.g., "BW-CUST-037"
//   if (!customerCodeToIdsMap[code]) customerCodeToIdsMap[code] = [];
//   customerCodeToIdsMap[code].push(c.user._id);
// });
// formData.append("customerCodeToIdsMap", JSON.stringify(customerCodeToIdsMap));
//     formData.append("customersLogsMap", JSON.stringify(customersLogsMap));
//     console.log("FormData entries:", [...formData.entries()]);

//     await dispatch(uploadWaterReportBulk(formData)).unwrap();
//     alert("✅ All reports generated & sent!");
//   } catch (err) {
//     console.error(err);
//     alert("❌ Failed to send bulk reports.");
//   } finally {
//     setProcessing(false);
//   }
// };

const handleBulkUpload = async () => {
  setProcessing(true);
  try {
    for (const c of customers) {
      // Only logs for this customer
      const customerLogsMap = {
        [c.user._id]: Object.values(c.scores)
          .flat()
          .map(item => item.id)
          .filter(Boolean)
      };

      // Generate PDF
      const pdf = new jsPDF("p", "mm", "a4");
      for (let p = 1; p <= totalPages; p++) {
        const pageDiv = document.getElementById(`pdf-page-${c.user._id}-page-${p}`);
        if (!pageDiv) continue;

        pageDiv.style.position = "absolute";
        pageDiv.style.top = "-9999px";
        pageDiv.style.display = "block";

        await waitForPaint();
        await new Promise(r => setTimeout(r, 300));

        const canvas = await html2canvas(pageDiv, { scale: 3, useCORS: true });
        const img = canvas.toDataURL("image/jpeg", 0.92);
        const width = pdf.internal.pageSize.getWidth();
        const height = (canvas.height * width) / canvas.width;

        if (p > 1) pdf.addPage();
        pdf.addImage(img, "JPEG", 0, 0, width, height);

        pageDiv.style.display = "none";
      }

      const blob = pdf.output("blob");
      const formData = new FormData();
      formData.append("files", blob, `${c.user.contact_number}-Report.pdf`);
      formData.append("customersLogsMap", JSON.stringify(customerLogsMap));

      await dispatch(uploadWaterReportBulk(formData)).unwrap();
    }

    alert("✅ All reports generated & sent!");
  } catch (err) {
    console.error(err);
    alert("❌ Failed to send bulk reports.");
  } finally {
    setProcessing(false);
  }
};


  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Bulk Water Reports ({month}/{year})</h1>

      <div className="flex gap-4 mb-4">
        <Button onClick={handleBulkUpload} disabled={processing} className="bg-blue-600 text-white px-4 py-2 rounded">
          {processing ? "Processing…" : "Generate & Send All"}
        </Button>
      </div>

      {/* Hidden customer pages */}
      {/* Hidden customer pages */}
{customers.map(c => (
  <div key={c.user._id} className="">
    {[1,2,3,4,5,6,7].map(p => (
      <div key={p} id={`pdf-page-${c.user._id}-page-${p}`} className="w-[210mm] h-[297mm]">
        {renderPageForCustomer(c, p)}
      </div>
    ))}
  </div>
))}

    </div>
  );
};

export default WaterReportsBulkTemplate;
