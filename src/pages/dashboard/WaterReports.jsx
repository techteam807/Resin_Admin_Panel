import { getWaterReports } from "@/feature/waterReports/waterReportsSlice";
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from 'react-redux';
import Loader from "../Loader";
import { useNavigate } from "react-router-dom";
import DayDetailModal from "@/component/DayDetailModal";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Input, Button } from "@material-tailwind/react";
import { ArrowPathIcon } from "@heroicons/react/24/solid";

function WaterReports() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { waterReports, loading, totalCount } = useSelector((state) => state.waterReport);
  console.log("w:", waterReports);

  const Data = waterReports;
  const currentDate = new Date();

  const currentMonth = currentDate.getMonth() + 1
  const currentYear = currentDate.getFullYear();
  const years = Array.from({ length: currentYear - 2024 + 11 }, (_, i) => 2024 + i);
  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [appliedStart, setAppliedStart] = useState('');
  const [appliedEnd, setAppliedEnd] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState([]);
  const [modalDay, setModalDay] = useState(null);
  const [modalUser, setModalUser] = useState(null);
  const [searchValue, setSearchValue] = useState("");


  useEffect(() => {
    const newFirstDay = `${year}-${String(month).padStart(2, '0')}-01`;
    const newLastDay = getDaysInMonth(month, year);
    const newEndDate = `${year}-${String(month).padStart(2, '0')}-${String(newLastDay).padStart(2, '0')}`;

    setStartDate(newFirstDay);
    setEndDate(newEndDate);
    setAppliedStart(newFirstDay);
    setAppliedEnd(newEndDate);
  }, [month, year]);


  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  useEffect(() => {
    const formattedMonth = month < 10 ? `0${month}` : month;
    dispatch(getWaterReports({ month: formattedMonth, year, search: searchValue.trim() }));
  }, [dispatch, month, year]);

  // useEffect(() => {
  //   handleSearch();
  // }, [month, year, startDate, endDate]);

  // useEffect(() => {
  //   handleSearch();
  // }, []);

  const handleSave = () => {
    if (startDate && endDate) {
      dispatch(getWaterReports({
        startDate,
        endDate,
        search: searchValue.trim(),
      }));
      setAppliedStart(startDate);
      setAppliedEnd(endDate);
    } else {
      const formattedMonth = month < 10 ? `0${month}` : month;
      dispatch(getWaterReports({
        month: formattedMonth,
        year,
        search: searchValue.trim(),
      }));
    }
  };

  const handleSearch = () => {
    if (startDate && endDate) {
      dispatch(getWaterReports({
        startDate,
        endDate,
        search: searchValue.trim(),
      }));
    } else {
      const formattedMonth = month < 10 ? `0${month}` : month;
      dispatch(getWaterReports({
        month: formattedMonth,
        year,
        search: searchValue.trim(),
      }));
    }
  };

  const searchClear = () => {
    setSearchValue("");
    setTimeout(() => {
      handleSearch();
    }, 0);
  };

  useEffect(() => {
    const formattedMonth = month < 10 ? `0${month}` : month;
    dispatch(getWaterReports({ month: formattedMonth, year }));
  }, [dispatch, month, year]);

  const getDaysInMonth = (month, year) => {
    return new Date(Date.UTC(year, month, 0)).getUTCDate();
  };


  // const daysInMonth = getDaysInMonth(month, year)
  let startDay = appliedStart ? new Date(appliedStart).getUTCDate() : 1;
  let endDay = appliedEnd ? new Date(appliedEnd).getUTCDate() : getDaysInMonth(month, year);


  const handleMonthChange = (e) => {
    const selectedMonth = monthNames.indexOf(e.target.value) + 1;
    setMonth(selectedMonth);
  };

  const handleYearChange = (e) => {
    setYear(e.target.value)
  }

  const groupedData = {};
  Data?.forEach((customer) => {
    const userId = customer._id;
    if (!groupedData[userId]) {
      groupedData[userId] = {
        user: {
          _id: customer._id,
          display_name: customer.display_name,
          first_name: customer.first_name,
          last_name: customer.last_name,
          contact_number: customer.contact_number,
        },
        scores: {},
      };
    }
    customer.reports.forEach((report) => {
      const dateKey = new Date(report.date).toISOString().split("T")[0]; // ✅ UTC
      if (!groupedData[userId].scores[dateKey]) {
        groupedData[userId].scores[dateKey] = [];
      }
      groupedData[userId].scores[dateKey].push({
        score: report.waterScore,
        status: report.status,
        createdAt: report.date,
        id: report._id,
      });
    });
  });

  const handleNavigation = (customerData) => {
    navigate(`/dashboard/waterPdf`, {
      state: { customer: customerData, month, year },
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


  const handleClear = () => {
    setSearchValue("");
    setMonth(currentMonth);
    setYear(currentYear);
    const defaultStart = `${currentYear}-${String(currentMonth).padStart(2, "0")}-01`;
    const lastDay = new Date(currentYear, currentMonth, 0).getUTCDate();
    const defaultEnd = `${currentYear}-${String(currentMonth).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;
    setStartDate(defaultStart);
    setEndDate(defaultEnd);

    dispatch(getWaterReports({
      month: currentMonth < 10 ? `0${currentMonth}` : currentMonth,
      year: currentYear,
      search: ""
    }));
  };

  const getUTCDateRange = (start, end) => {
    if (!start || !end) return [];
    const dates = [];
    let current = new Date(start);

    while (current <= new Date(end)) {
      dates.push(new Date(Date.UTC(
        current.getUTCFullYear(),
        current.getUTCMonth(),
        current.getUTCDate()
      )));
      current.setUTCDate(current.getUTCDate() + 1);
    }
    return dates;
  };

  const dateRange =
    appliedStart && appliedEnd ? getUTCDateRange(appliedStart, appliedEnd) : [];

  return (
    <div className="flex flex-col bg-white border border-gray-300 rounded-xl mt-7 shadow-sm">
      <div className="bg-white shadow-sm rounded-xl p-5 space-y-5">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex gap-5">
            <h1 className="text-2xl font-bold text-gray-800">Water Reports</h1>
            <div className="flex items-center bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
              <span className="text-sm font-medium text-blue-700">
                Total Customers: <span className="font-bold">{totalCount}</span>
              </span>
            </div>

          </div>
          {/* Search */}
          <div className="flex flex-row items-stretch gap-2 w-auto">
            <div className="w-72 relative flex gap-2">
              <Input
                label="Search"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                icon={
                  searchValue ? (
                    <XMarkIcon
                      onClick={handleClear}
                      className="h-5 w-5 cursor-pointer"
                    />
                  ) : null
                }
              />
            </div>

            <Button
              onClick={handleSearch}
              variant="gradient"
              className="px-2.5"
              size="sm"
            >
              <MagnifyingGlassIcon className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
    {/* Start Date */}
    <div>
      <label className="block text-sm font-medium text-gray-600 mb-1">
        Start Date
      </label>
      <input
        type="date"
        value={startDate || ""}
        onChange={(e) => setStartDate(e.target.value)}
        className="w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>

    {/* End Date */}
    <div>
      <label className="block text-sm font-medium text-gray-600 mb-1">
        End Date
      </label>
      <input
        type="date"
        value={endDate || ""}
        onChange={(e) => setEndDate(e.target.value)}
        className="w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>

    {/* Go Button */}
    <div className="flex items-end">
      <Button
        onClick={handleSave}
        variant="gradient"
        size="sm"
        className="w-full py-3 rounded-lg font-medium shadow-md"
      >
        Go
      </Button>
    </div>

    {/* Month */}
    <div>
      <label className="block text-sm font-medium text-gray-600 mt-2">
        Month
      </label>
      <select
        value={monthNames[month - 1]}
        onChange={handleMonthChange}
        className="w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        {monthNames.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>
    </div>

    {/* Year */}
    <div>
      <label className="block text-sm font-medium text-gray-600 mt-2">
        Year
      </label>
      <select
        value={year}
        onChange={handleYearChange}
        className="w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                <th className="sticky top-0 left-0 z-30 bg-gray-200 border-l border-r border-b border-gray-300 text-center p-2">No.
                </th>

                <th className="sticky top-0 left-0 z-30 bg-gray-200 border-l border-r border-b border-gray-300 text-center p-2 min-w-[180px]">
                  User
                </th>
                {dateRange.map((date) => {
                  const key = date.toISOString().split("T")[0]; // ✅ UTC key
                  const formatted = `${String(date.getUTCDate()).padStart(2, "0")}/${String(
                    date.getUTCMonth() + 1
                  ).padStart(2, "0")}`;

                  return (
                    <th
                      key={key}
                      className="sticky top-0 z-20 bg-gray-200 border text-center p-2 min-w-[90px]"
                    >
                      {formatted}
                    </th>
                  );
                })}
                <th className="sticky top-0 right-0 z-30 bg-gray-200 border-l border-r border-b border-gray-300 text-center p-2 min-w-[150px]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.values(groupedData).map((userData, index) => (
                <tr key={userData.user._id}>
                  <td className="sticky left-0 z-20 bg-gray-100 border border-gray-300 text-center">{index + 1}</td>
                  <td className="sticky left-0 z-20 bg-gray-100 border border-gray-300 text-center min-w-[180px]">
                    <div className="flex flex-col items-center">
                      <span>
                        {userData.user.first_name} {userData.user.last_name}
                      </span>
                      <span className="text-sm text-gray-600">
                        {userData.user?.contact_number}
                      </span>
                    </div>
                  </td>
                  {dateRange.map((date) => {
                    const key = date.toISOString().split("T")[0]; // ✅ UTC key
                    const entries = userData.scores[key];

                    let bgClass = "";
                    let cellContent = "-";

                    if (entries?.length) {
                      const scores = entries.map((e) => e.score).join(", ");
                      const hasStatus = entries.some((e) => e.status);

                      const hasHigh = entries.some((e) => e.score > 100);
                      const hasMid = entries.some((e) => e.score >= 60 && e.score <= 100);
                      const hasLow = entries.some((e) => e.score < 60);

                      if (hasHigh) bgClass = "bg-red-500 text-white";
                      else if (hasMid) bgClass = "bg-yellow-400 text-black";
                      else if (hasLow) bgClass = "bg-green-500 text-white";

                      cellContent = hasStatus ? (
                        <div className="flex items-center justify-center gap-2">
                          <span>{scores}</span>
                          <div className="ml-2 w-4 h-4 rounded-full bg-white flex items-center justify-center shadow-sm border border-black">
                            <svg
                              className="w-3 h-3 text-green-600"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        </div>
                      ) : scores;
                    }

                    return (
                      <td
                        key={key}
                        className={`border border-gray-300 text-center min-w-[90px] p-2 cursor-pointer ${bgClass}`}
                        onClick={() => handleCellClick(entries, key, userData.user)}
                      >
                        {cellContent}
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
        {!loading && Data?.length === 0 && (
          <p className="text-center text-gray-500 py-4">No data available.</p>
        )}
      </div>

      {/* Modal */}
      <DayDetailModal
        show={showModal}
        onClose={closeModal}
        // onSaved={handleModalSave}
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