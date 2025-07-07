import { getWaterReports } from "@/feature/waterReports/waterReportsSlice";
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from 'react-redux';
import Loader from "../Loader";
import { useNavigate } from "react-router-dom";
import DayDetailModal from "@/component/DayDetailModal";

function WaterReports() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { waterReports, loading } = useSelector((state) => state.waterReport);
  console.log("waterReport", waterReports)
  const Data = waterReports;
  const currentDate = new Date();
  console.log("cur:",currentDate);
  
  const currentMonth = currentDate.getMonth() + 1
  const currentYear = currentDate.getFullYear();
  const years = Array.from({ length: currentYear - 2024 + 11 }, (_, i) => 2024 + i);
  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState([]);
  const [modalDay, setModalDay] = useState(null);
  const [modalUser, setModalUser] = useState(null);

  useEffect(() => {
  const newFirstDay = `${year}-${String(month).padStart(2, '0')}-01`;
  const newLastDay = new Date(year, month, 0).getDate();
  const newEndDate = `${year}-${String(month).padStart(2, '0')}-${String(newLastDay).padStart(2, '0')}`;

  setStartDate(newFirstDay);
  setEndDate(newEndDate);
}, [month, year]);


  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  useEffect(() => {
    const formattedMonth = month < 10 ? `0${month}` : month;
    dispatch(getWaterReports({ month: formattedMonth, year, startDate, endDate }));
  }, [dispatch, month, year, startDate, endDate]);

  const getDaysInMonth = (month, year) => {
    return new Date(year, month, 0).getDate();
  };
  

  const daysInMonth = getDaysInMonth(month, year)

  const handleMonthChange = (e) => {
    const selectedMonth = monthNames.indexOf(e.target.value) + 1;
    setMonth(selectedMonth);
  };

  const handleYearChange = (e) => {
    setYear(e.target.value)
  }

  const groupedData = {};

  // Data.forEach((entry) => {
  //   const userId = entry.customerId._id;
  //   const day = new Date(entry.date).getDate();

  //   if (!groupedData[userId]) {
  //     groupedData[userId] = {
  //       user: entry.customerId,
  //       scores: {}  // day: [{ score, status }]
  //     };
  //   }

  //   if (!groupedData[userId].scores[day]) {
  //     groupedData[userId].scores[day] = [];
  //   }

  //   groupedData[userId].scores[day].push({
  //     score: entry.waterScore,
  //     status: entry.status,
  //     createdAt: entry.date,
  //     id:entry._id,
  //   });
  // });

  Data.forEach((customer) => {
    const userId = customer._id;

    // Initialize user info and scores container
    if (!groupedData[userId]) {
      groupedData[userId] = {
        user: {
          _id: customer._id,
          display_name: customer.display_name,
          contact_number: customer.contact_number,
          // Add more fields here if needed
        },
        scores: {} // scores[day] = [ { score, status, createdAt, id } ]
      };
    }

    // Loop through each report for this customer
    customer.reports.forEach((report) => {
      const day = new Date(report.date).getDate();

      if (!groupedData[userId].scores[day]) {
        groupedData[userId].scores[day] = [];
      }

      groupedData[userId].scores[day].push({
        score: report.waterScore,
        status: report.status,
        createdAt: report.date,
        id: report._id
      });
    });
  });

  const handleNavigation = (customerData) => {
    navigate(`/dashboard/waterPdf`, {
      state: {
        customer: customerData,
        month,
        year,
      },
    });
  };

  const handleCellClick = (entries = [], day, user) => {
    setModalData(entries);
    setModalDay(day);
    setModalUser(user);
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setModalData([]);
    setModalDay(null);
    setModalUser(null);
  };

  const handleModalSave = () => {
    const formattedMonth = month < 10 ? `0${month}` : month;
    dispatch(getWaterReports({ month: formattedMonth, year }));
  };

  return (
    //     <div className="flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 border border-blue-gray-100 mt-9 shadow-sm">

    // <div className="flex justify-between items-center pb-5">
    //   <div>
    // <h1 className="text-left text-xl font-bold text-gray-800 pl-5">
    //   Water Reports
    // </h1>
    // </div>

    // <div className="flex flex-wrap gap-4 mb-3 px-4 pt-3">
    //   {/* Start Date */}


    //   {/* Month Selector */}
    //   <div className="flex items-center gap-2">
    //     <label className="text-sm font-medium text-gray-700 mb-1">Month</label>
    //     <select
    //       value={monthNames[month - 1]}
    //       onChange={handleMonthChange}
    //       className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
    //     >
    //       {monthNames.map((m, index) => (
    //         <option key={m} value={m}>
    //           {m}
    //         </option>
    //       ))}
    //     </select>
    //   </div>

    //   {/* Year Selector */}
    //   <div className="flex items-center gap-2">
    //     <label className="text-sm font-medium text-gray-700 mb-1">Year</label>
    //     <select
    //       value={year}
    //       onChange={handleYearChange}
    //       className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
    //     >
    //       {years.map((y) => (
    //         <option key={y} value={y.toString()}>
    //           {y}
    //         </option>
    //       ))}
    //     </select>
    //   </div>
    //   </div>

    // </div>

    //       <div className="relative overflow-x-auto shadow-md rounded-lg">
    //         {loading ? <div className=''><Loader /></div> :
    //           <div className="overflow-x-auto">
    //             <table className="w-full border-collapse bg-white">
    //               <thead className="">
    //                 <tr>
    //                   <th className="sticky left-0 z-10 bg-gray-200 text-center p-2 font-medium text-gray-700 min-w-[180px] border-b border-gray-500">
    //                     User
    //                   </th>
    //                   {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => (
    //                     <th
    //                       key={day}
    //                       className="border-r border-gray-500 p-4 text-center font-medium text-gray-700 min-w-[90px]"
    //                     >
    //                       {day}
    //                     </th>
    //                   ))}
    //                   <th className="sticky right-0 z-10 bg-gray-200 text-center p-2 font-medium text-gray-700 min-w-[150px] border-b border-gray-500">
    //                     Actions
    //                   </th>
    //                 </tr>
    //               </thead>
    //               <tbody>
    //                 {Object.values(groupedData).map((userData) => (
    //                   // console.log("userData",userData),
    //                   <tr key={userData.user._id}>
    //                     <td className="sticky left-0 bg-gray-200 text-center font-medium text-gray-700 border-b border-gray-500">
    //                       {userData.user.display_name}
    //                     </td>
    //                     {Array.from({ length: daysInMonth }, (_, day) => {
    //                       const currentDayOfMonth = day + 1;
    //                      const entries = userData.scores[currentDayOfMonth];// array or undefined

    //                       let bgClass = "";
    //                       if (entries?.some(e => e.status)) {
    //                         bgClass = "bg-green-500 text-white";
    //                       } else if (entries?.length) {
    //                         bgClass = "bg-yellow-500 text-black";
    //                       }

    //                       return (
    //                         <td
    //                           key={currentDayOfMonth}
    //                           className={`border border-gray-500 text-center p-2 min-w-[90px] ${bgClass}`}
    //                           onClick={() => handleCellClick(entries, currentDayOfMonth, userData.user)}
    //                         >
    //                           {entries ? entries.map(e => e.score).join(", ") : "-"}
    //                         </td>
    //                       );
    //                     })}
    //                     <td className="sticky right-0 z-10 bg-gray-200 text-center p-2 border-b border-gray-500">
    //                       <button className="bg-black rounded-lg text-white px-2 py-2 text-sm" onClick={() => handleNavigation(userData)}>
    //                         View Report
    //                       </button>
    //                     </td>

    //                   </tr>
    //                 ))}
    //               </tbody>
    //             </table>
    //             {Data.length == 0 && (
    //               <p className="text-gray-500 text-center">No data available. </p>
    //             )}
    //           </div>
    //         }
    //       </div>
    //          <DayDetailModal
    //   show={showModal}
    //   onClose={closeModal}
    //   onSaved={handleModalSave}
    //   data={modalData}
    //   day={modalDay}
    //   user={modalUser}
    //   month={month}
    //   year={year}
    // />

    //     </div>
    <div className="flex flex-col bg-white border border-gray-300 rounded-xl mt-9 shadow-sm">
      {/* Header and filters */}
      <div className="flex justify-between items-center px-5 py-4">
        <h1 className="text-xl font-bold text-gray-800">Water Reports</h1>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Start Date : </label>
            <input
              type="date"
              className="px-2 py-1 border border-gray-300 rounded"
              value={startDate || ""}
    onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          {/* End Date */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">End Date : </label>
            <input
              type="date"
              className="px-2 py-1 border border-gray-300 rounded"
               value={endDate || ""}
    onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-700">Month : </label>
            <select
              value={monthNames[month - 1]}
              onChange={handleMonthChange}
              className="px-2 py-1 border border-gray-300 rounded"
            >
              {monthNames.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-700">Year : </label>
            <select
              value={year}
              onChange={handleYearChange}
              className="px-2 py-1 border border-gray-300 rounded"
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="relative overflow-auto max-h-[75vh]">
        {loading ? (
          <Loader />
        ) : (
          <table className="w-full border-collapse bg-white">
            <thead>
              <tr>
                <th className="sticky top-0 left-0 z-30 bg-gray-200 border-l border-r border-b border-gray-300 text-center p-2 min-w-[180px]">
                  User
                </th>
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => (
                  <th
                    key={day}
                    className="sticky top-0 z-20 bg-gray-200 border-l border-r border-b border-gray-300 text-center p-2 min-w-[90px]"
                  >
                    {day}
                  </th>
                ))}
                <th className="sticky top-0 right-0 z-30 bg-gray-200 border-l border-r border-b border-gray-300 text-center p-2 min-w-[150px]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.values(groupedData).map((userData) => (
                <tr key={userData.user._id}>
                  <td className="sticky left-0 z-20 bg-gray-100 border border-gray-300 text-center min-w-[180px]">
                    {userData.user.display_name}
                  </td>
                  {Array.from({ length: daysInMonth }, (_, day) => {
                    const currentDay = day + 1;
                    const entries = userData.scores[currentDay];

                    let bgClass = "";
                    if (entries?.some((e) => e.status)) {
                      bgClass = "bg-green-500 text-white";
                    } else if (entries?.length) {
                      bgClass = "bg-yellow-400 text-black";
                    }

                    return (
                      <td
                        key={currentDay}
                        className={`border border-gray-300 text-center min-w-[90px] p-2 cursor-pointer ${bgClass}`}
                        onClick={() => handleCellClick(entries, currentDay, userData.user)}
                      >
                        {entries ? entries.map((e) => e.score).join(", ") : "-"}
                      </td>
                    );
                  })}
                  <td className="sticky right-0 z-20 bg-gray-100 border border-gray-300 text-center min-w-[150px]">
                    <button
                      className="bg-black text-white px-3 py-1 rounded text-sm"
                      onClick={() => handleNavigation(userData)}
                    >
                      View Report
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && Data.length === 0 && (
          <p className="text-center text-gray-500 py-4">No data available.</p>
        )}
      </div>

      {/* Modal */}
      <DayDetailModal
        show={showModal}
        onClose={closeModal}
        onSaved={handleModalSave}
        data={modalData}
        day={modalDay}
        user={modalUser}
        month={month}
        year={year}
      />
    </div>
  )
}

export default WaterReports