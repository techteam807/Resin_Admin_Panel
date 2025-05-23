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
  const currentMonth = currentDate.getMonth() + 1
  const currentYear = currentDate.getFullYear();
  const years = Array.from({ length: currentYear - 2024 + 11 }, (_, i) => 2024 + i);
  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);
  
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState([]);
  const [modalDay, setModalDay] = useState(null);
  const [modalUser, setModalUser] = useState(null);
  
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  useEffect(() => {
    const formattedMonth = month < 10 ? `0${month}` : month;
    dispatch(getWaterReports({ month: formattedMonth, year }));
  }, [dispatch, month, year]);

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

  Data.forEach((entry) => {
    const userId = entry.customerId._id;
    const day = new Date(entry.date).getDate();

    if (!groupedData[userId]) {
      groupedData[userId] = {
        user: entry.customerId,
        scores: {}  // day: [{ score, status }]
      };
    }

    if (!groupedData[userId].scores[day]) {
      groupedData[userId].scores[day] = [];
    }

    groupedData[userId].scores[day].push({
      score: entry.waterScore,
      status: entry.status,
      createdAt: entry.date,
      id:entry._id,
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
    <div className="flex flex-col w-full">
      <div className="flex justify-end items-center gap-4 mb-6 px-4 pt-3">
        <div className="w-32 px-2 py-2 bg-white border border-gray-300 rounded-lg shadow-sm">
          <select
            value={monthNames[month - 1]}
            onChange={handleMonthChange}
            className="w-full focus:outline-none"
          >
            {monthNames.map((m, index) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
        <div className="w-28 px-2 py-2 bg-white border border-gray-300 rounded-lg shadow-sm">
          <select
            value={year}
            onChange={handleYearChange}
            className="w-full focus:outline-none"
          >
            {years.map((y) => (
              <option key={y} value={y.toString()}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="relative overflow-x-auto shadow-md rounded-lg">
        {loading ? <div className=''><Loader /></div> :
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white">
              <thead className="">
                <tr>
                  <th className="sticky left-0 z-10 bg-gray-200 text-center p-2 font-medium text-gray-700 min-w-[180px] border-b border-gray-500">
                    User
                  </th>
                  {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => (
                    <th
                      key={day}
                      className="border-r border-gray-500 p-4 text-center font-medium text-gray-700 min-w-[90px]"
                    >
                      {day}
                    </th>
                  ))}
                  <th className="sticky right-0 z-10 bg-gray-200 text-center p-2 font-medium text-gray-700 min-w-[150px] border-b border-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.values(groupedData).map((userData) => (
                  // console.log("userData",userData),
                  <tr key={userData.user._id}>
                    <td className="sticky left-0 bg-gray-200 text-center font-medium text-gray-700 border-b border-gray-500">
                      {userData.user.display_name}
                    </td>
                    {Array.from({ length: daysInMonth }, (_, day) => {
                      const currentDayOfMonth = day + 1;
                     const entries = userData.scores[currentDayOfMonth];// array or undefined

                      let bgClass = "";
                      if (entries?.some(e => e.status)) {
                        bgClass = "bg-green-500 text-white";
                      } else if (entries?.length) {
                        bgClass = "bg-yellow-500 text-black";
                      }

                      return (
                        <td
                          key={currentDayOfMonth}
                          className={`border border-gray-500 text-center p-2 min-w-[90px] ${bgClass}`}
                          onClick={() => handleCellClick(entries, currentDayOfMonth, userData.user)}
                        >
                          {entries ? entries.map(e => e.score).join(", ") : "-"}
                        </td>
                      );
                    })}
                    <td className="sticky right-0 z-10 bg-gray-200 text-center p-2 border-b border-gray-500">
                      <button className="bg-black rounded-lg text-white px-2 py-2 text-sm" onClick={() => handleNavigation(userData)}>
                        View Report
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
            {Data.length == 0 && (
              <p className="text-gray-500 text-center">No data available. </p>
            )}
          </div>
        }
      </div>
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