import { useState } from "react"

function WaterReports() {
  const [month, setMonth] = useState("January")
  const [year, setYear] = useState("2025")

  const getDaysInMonth = (month, year) => {
    const monthIndex = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ].indexOf(month)
    return new Date(Number.parseInt(year), monthIndex + 1, 0).getDate()
  }

  const daysInMonth = getDaysInMonth(month, year)

  const handleMonthChange = (e) => {
    setMonth(e.target.value)
  }

  const handleYearChange = (e) => {
    setYear(e.target.value)
  }

  const Data = [
    {
      customerId: {
        _id: "111",
        display_name: "demo1",
      },
      waterScore: "100",
      status: "true",
      createdAt: "2025-05-12",
    },
    {
      customerId: {
        _id: "222",
        display_name: "demo2",
      },
      waterScore: "100",
      status: "false",
      createdAt: "2025-05-15",
    },
    {
      customerId: {
        _id: "333",
        display_name: "demo3",
      },
      waterScore: "100",
      status: "true",
      createdAt: "2025-05-18",
    },
    {
      customerId: {
        _id: "444",
        display_name: "demo4",
      },
      waterScore: "100",
      status: "true",
      createdAt: "2025-05-20",
    },
    {
      customerId: {
        _id: "555",
        display_name: "demo5",
      },
      waterScore: "100",
      status: "true",
      createdAt: "2025-05-25",
    },
    {
      customerId: {
        _id: "666",
        display_name: "demo6",
      },
      waterScore: "100",
      status: "true",
      createdAt: "2025-05-10",
    },
    {
      customerId: {
        _id: "777",
        display_name: "demo7",
      },
      waterScore: "100",
      status: "false",
      createdAt: "2025-05-28",
    },
  ]

  return (
    <div className="flex flex-col w-full">
      <div className="flex justify-end items-center gap-4 mb-6 px-4 pt-3">
        <select
          value={month}
          onChange={handleMonthChange}
          className="w-32 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {[
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ].map((m) => (
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
                      const currentDay = day + 1
                      const isHighlighted = currentDay === createdAtDay
                      const statusClass =
                        user.status === "true" ? "bg-green-500 text-white" : "bg-yellow-500 text-black"

                      return (
                        <td
                          key={currentDay}
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
        </div>
      </div>
    </div>
  )
}

export default WaterReports