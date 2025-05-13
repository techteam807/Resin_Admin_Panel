import { getWaterReports } from "@/feature/waterReports/waterReportsSlice";
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from 'react-redux';
import Loader from "../Loader";

function WaterReports() {
  const dispatch = useDispatch();
  const { waterReports, loading } = useSelector((state) => state.waterReport);
  console.log("waterReport", waterReports)
  const Data = waterReports

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1
  const currentYear = currentDate.getFullYear();
  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);
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

  const formatMonth = (month) => {
    return month < 10 ? `0${month}` : month;
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex justify-end items-center gap-4 mb-6 px-4 pt-3">
        <select
          value={monthNames[month - 1]}
          onChange={handleMonthChange}
          className="w-32 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {monthNames.map((m, index) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        <select
          value={year}
          onChange={handleYearChange}
          className="w-24 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {[2023, 2024, 2025, 2026].map((y) => (
            <option key={y} value={y.toString()}>
              {y}
            </option>
          ))}
        </select>
      </div>

      <div className="relative overflow-x-auto shadow-md rounded-lg">
        {loading ? <div className=''><Loader /></div> :
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="sticky left-0 z-20 bg-gray-100 border text-center border-gray-200 p-4 font-medium text-gray-700 min-w-[180px]">
                    User
                  </th>
                  {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => (
                    <th
                      key={day}
                      className="border border-gray-200 p-4 text-center font-medium text-gray-700 w-16 min-w-16"
                    >
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Data.map((user) => {
                  const createdAtDay = new Date(user.createdAt).getDate()
                  return (
                    <tr key={user.customerId._id} className="hover:bg-gray-50">
                      <td className="sticky left-0 z-10 bg-white border text-center border-gray-200 p-4 font-medium text-gray-700">
                        {user.customerId.display_name}
                      </td>
                      {Array.from({ length: daysInMonth }, (_, day) => {
                        const currentDayOfMonth = day + 1;
                        const isHighlighted = currentDayOfMonth === createdAtDay;
                        const statusClass =
                          user.status === "true"
                            ? "bg-green-500 text-white"
                            : "bg-yellow-500 text-black";

                        return (
                          <td
                            key={currentDayOfMonth}
                            className={`border border-gray-200 text-center p-4 w-16 min-w-16 ${isHighlighted ? statusClass : "text-black"
                              }`}
                          >
                            {isHighlighted ? user.waterScore : "-"}
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {Data.length == 0 && (
              <p className="text-gray-500 text-center">No data available. </p>
            )}
          </div>
        }
      </div>
    </div>
  )
}

export default WaterReports