import { getWaterReports } from "@/feature/waterReports/waterReportsSlice";
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from 'react-redux';
import Loader from "../Loader";
import { useNavigate } from "react-router-dom";
import DayDetailModal from "@/component/DayDetailModal";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Input, Button } from "@material-tailwind/react";
import { ArrowPathIcon, EyeIcon } from "@heroicons/react/24/solid";
import WaterReportsBulkTemplate from "@/layouts/WaterReportsBulkTemplate";

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
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState([]);
  const [modalDay, setModalDay] = useState(null);
  const [modalUser, setModalUser] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [showBulkModal , setShowBulkModal] = useState(false);



  useEffect(() => {
    const newFirstDay = `${year}-${String(month).padStart(2, '0')}-01`;
    const newLastDay = new Date(Date.UTC(year, month, 0)).getUTCDate();
    const newEndDate = `${year}-${String(month).padStart(2, '0')}-${String(newLastDay).padStart(2, '0')}`;

    setStartDate(newFirstDay);
    setEndDate(newEndDate);
  }, [month, year]);


  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  useEffect(() => {
    handleSearch();
  }, [month, year, startDate, endDate]);


  const handleSearch = () => {
    const formattedMonth = month < 10 ? `0${month}` : month;
    dispatch(getWaterReports({ month: formattedMonth, year, startDate, endDate, search: searchValue.trim() }));
  };

  const searchClear = () => {
    setSearchValue("");
    setTimeout(() => {
      handleSearch();
    }, 0);
  };

  useEffect(() => {
    const formattedMonth = month < 10 ? `0${month}` : month;
    dispatch(getWaterReports({ month: formattedMonth, year, startDate, endDate }));
  }, [dispatch, month, year, startDate, endDate]);

  const getDaysInMonth = (month, year) => {
    return new Date(Date.UTC(year, month, 0)).getUTCDate();
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
        scores: {}
      };
    }

    customer.reports.forEach((report) => {
      const day = new Date(report.date).getUTCDate();


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

  const handleClear = () => {
    setSearchValue("");
    setMonth(currentMonth);
    setYear(currentYear);
    setStartDate(`${currentYear}-${String(currentMonth).padStart(2, '0')}-01`);
    const lastDay = new Date(currentYear, currentMonth, 0).getDate();
    setEndDate(`${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`);

    // Call API with default params
    const formattedMonth = currentMonth < 10 ? `0${currentMonth}` : currentMonth;
    dispatch(getWaterReports({
      month: formattedMonth,
      year: currentYear,
      startDate: `${currentYear}-${String(currentMonth).padStart(2, '0')}-01`,
      endDate: `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`,
      search: ""
    }));
  };

  const toggleCustomer = (id) => {
    setSelectedCustomers((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleBulkGenerate = () => {
    if (selectedCustomers.length === 0) return;
    navigate(`/dashboard/waterPdf/bulk`, {
      state: {
        customers: selectedCustomers.map((id) => groupedData[id]),
        month,
        year,
      },
    });
  };



  return (
    <div className="flex flex-col bg-white border border-gray-300 rounded-xl mt-9 shadow-sm">
<div className="bg-white shadow-sm rounded-xl p-5 space-y-6">
  {/* Header */}
<header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
  {/* Title + Count together */}
  <div className="flex items-center gap-2">
    <h1 className="text-2xl font-bold text-gray-900">Water Reports</h1>
    <span className="text-lg font-medium text-gray-600 pt-1">
      Total Customers: {totalCount}
    </span>
  </div>

  {/* Search */}
  <div className="flex w-full md:w-auto flex-row items-stretch gap-2">
    <div className="relative flex-1 md:flex-none md:w-72">
      <Input
        id="search"
        label="Search"
        aria-label="Search customers"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        icon={
          searchValue ? (
            <XMarkIcon
              onClick={handleClear}
              className="h-5 w-5 cursor-pointer text-gray-500 hover:text-gray-700"
              aria-label="Clear search"
            />
          ) : null
        }
      />
    </div>
    <Button
      onClick={handleSearch}
      variant="gradient"
      size="sm"
      aria-label="Search"
      className="px-3"
    >
      <MagnifyingGlassIcon className="h-5 w-5" />
    </Button>
  </div>
</header>


  {/* Filters */}
  <section
  aria-label="Filters"
  className="grid grid-cols-1 md:grid-cols-5 gap-4"
>
  {/* Start Date */}
  <div>
    <label
      htmlFor="start-date"
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      Start Date
    </label>
    <input
      id="start-date"
      type="date"
      disabled
      value={startDate || ""}
      onChange={(e) => setStartDate(e.target.value)}
      className="w-full h-11 px-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100"
    />
  </div>

  {/* End Date */}
  <div>
    <label
      htmlFor="end-date"
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      End Date
    </label>
    <input
      id="end-date"
      type="date"
      disabled
      value={endDate || ""}
      onChange={(e) => setEndDate(e.target.value)}
      className="w-full h-11 px-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100"
    />
  </div>

  {/* Month */}
  <div>
    <label
      htmlFor="month"
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      Month
    </label>
    <select
      id="month"
      value={monthNames[month - 1]}
      onChange={handleMonthChange}
      className="w-full h-11 px-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
    <label
      htmlFor="year"
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      Year
    </label>
    <select
      id="year"
      value={year}
      onChange={handleYearChange}
      className="w-full h-11 px-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
    >
      {years.map((y) => (
        <option key={y} value={y}>
          {y}
        </option>
      ))}
    </select>
  </div>

  {/* Bulk Generate */}
  <div className="flex items-end">
    <Button
  onClick={() => setShowBulkModal(true)}
  disabled={selectedCustomers.length === 0}
  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
>
  Preview Bulk Reports
</Button>

  </div>
</section>

</div>


      {/* Table */}
      <div className="relative overflow-auto max-h-[75vh]">
        {loading ? (
          <Loader />
        ) : (
          <table className="w-full border-collapse bg-white">
            <thead>
              <tr>
                <th className="sticky top-0 left-0 z-30 bg-gray-200 border-l border-r border-b border-gray-300 text-center p-2">
                  No.
                </th>

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

                {/* ✅ Combined header column */}
                <th className="sticky top-0 right-0 z-30 bg-gray-200 border-l border-r border-b border-gray-300 text-center p-2 min-w-[150px]">
                  <div className="flex items-center justify-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedCustomers.length === Object.keys(groupedData).length}
                      onChange={(e) =>
                        setSelectedCustomers(
                          e.target.checked ? Object.keys(groupedData) : []
                        )
                      }
                    />
                    <span>Actions</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.values(groupedData).map((userData, index) => (
                <tr key={userData.user._id}>
                  <td className="sticky left-0 z-20 bg-gray-100 border border-gray-300 text-center">
                    {index + 1}
                  </td>

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
                  {Array.from({ length: daysInMonth }, (_, day) => {
                    const currentDay = day + 1;
                    const entries = userData.scores[currentDay];

                    let bgClass = "";
                    let cellContent = "-";

                    if (entries?.length) {
                      const scores = entries.map((e) => e.score).join(", ");
                      const hasStatus = entries.some((e) => e.status);

                      if (hasStatus) {
                        const scoreValues = entries.map((e) => e.score);
                        const scoresText = scoreValues.join(", ");
                        const hasHigh = scoreValues.some((score) => score > 100);
                        const hasMid = scoreValues.some(
                          (score) => score >= 60 && score <= 100
                        );
                        const hasLow = scoreValues.some((score) => score < 60);

                        if (hasHigh) {
                          bgClass = "bg-red-500 text-white";
                        } else if (hasMid) {
                          bgClass = "bg-yellow-400 text-black";
                        } else if (hasLow) {
                          bgClass = "bg-green-500 text-white";
                        }
                        cellContent = (
                          <div className="flex items-center justify-center gap-2">
                            <span>{scoresText}</span>
                            {hasStatus && (
                              <div className="ml-4 w-4 h-4 rounded-full bg-white flex items-center justify-center shadow-sm border border-black">
                                <svg
                                  className="w-4 h-4 text-green-600"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              </div>
                            )}
                          </div>
                        );
                      } else {
                        const scoreValues = entries.map((e) => e.score);
                        const hasHigh = scoreValues.some((score) => score > 100);
                        const hasMid = scoreValues.some(
                          (score) => score >= 60 && score <= 100
                        );
                        const hasLow = scoreValues.some((score) => score < 60);

                        if (hasHigh) {
                          bgClass = "bg-red-500 text-white";
                        } else if (hasMid) {
                          bgClass = "bg-yellow-400 text-black";
                        } else if (hasLow) {
                          bgClass = "bg-green-500 text-white";
                        }

                        cellContent = scores;
                      }
                    }

                    return (
                      <td
                        key={currentDay}
                        className={`border border-gray-300 text-center min-w-[90px] p-2 cursor-pointer ${bgClass}`}
                        onClick={() =>
                          handleCellClick(entries, currentDay, userData.user)
                        }
                      >
                        {cellContent}
                      </td>
                    );
                  })}

                 {/* ✅ Combined cell with hover-only checkbox + always-visible button */}
<td className="sticky right-0 z-20 bg-gray-100 border border-gray-300 text-center min-w-[150px]">
  <div className="flex items-center justify-center gap-3">
    {/* Checkbox */}
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={selectedCustomers.includes(userData.user._id)}
        onChange={() => toggleCustomer(userData.user._id)}
        className="w-4 h-4 accent-blue-600 cursor-pointer"
      />
      <span className="sr-only">Select Customer</span>
    </label>

    {/* View Button */}
    <button
      className="flex items-center justify-center w-9 h-9 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition"
      onClick={() => handleNavigation(userData)}
      title="View Details"
    >
      <EyeIcon className="h-5 w-5" />
    </button>
  </div>
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

      {showBulkModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white w-11/12 max-w-6xl rounded-lg shadow-lg relative p-4 overflow-y-auto max-h-[90vh]">
      <button
        onClick={() => setShowBulkModal(false)}
        className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
      >
        ✖
      </button>

      <h2 className="text-xl font-bold mb-4">Bulk Reports Preview</h2>

      <WaterReportsBulkTemplate
        customers={selectedCustomers.map((id) => groupedData[id])}
        month={month}
        year={year}
      />
    </div>
  </div>
)}
    </div>
  )
}

export default WaterReports