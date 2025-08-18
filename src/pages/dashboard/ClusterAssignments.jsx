import {
  CheckCircleIcon,
  ChevronDownIcon,
  EyeIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTechnicianDropDown } from "@/feature/technician/technicianSlice";
import {
  createClusterAssignment,
  deleteAssignment,
  getClusterAssignment,
  getClusterDropDown,
} from "@/feature/customer/customerSlice";
import EditModal from "./EditModal";
import vehicles from "../../global.js";
import Loader from "../Loader";
import { Typography } from "@material-tailwind/react";

const ClusterAssignments = () => {
  const dispatch = useDispatch();
  const { technicianDrop } = useSelector((state) => state.technician);
  const { clusterDrop, assignment, clusterLoading, loading } = useSelector(
    (state) => state.customer
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTechnicians, setSelectedTechnicians] = useState([]);

  const getCurrentMonthDateRangeIST = () => {
    const now = new Date();
    const indiaTime = new Date(
      now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );
    const start = new Date(indiaTime.getFullYear(), indiaTime.getMonth(), 1);
    const end = new Date(indiaTime.getFullYear(), indiaTime.getMonth() + 1, 0);
    const formatDateIST = (date) => {
      const d = new Date(
        date.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
      );
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };
    return {
      startDateStr: formatDateIST(start),
      endDateStr: formatDateIST(end),
    };
  };

  useEffect(() => {
    const { startDateStr, endDateStr } = getCurrentMonthDateRangeIST();
    setStartDate(startDateStr);
    setEndDate(endDateStr);
  }, []);

  const [formData, setFormData] = useState({
    userId: [],
    clusterId: "",
    date: "",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("view");
  const [filterUserId, setFilterUserId] = useState("");
  const [filterClusterId, setFilterClusterId] = useState("");

  useEffect(() => {
    dispatch(getTechnicianDropDown());
    if (selectedVehicle) {
      dispatch(getClusterDropDown(selectedVehicle));
    }
    dispatch(
      getClusterAssignment({
        startDate,
        endDate,
        vehicleNo: selectedVehicle,
      })
    );
  }, [dispatch, startDate, endDate, selectedVehicle]);

  const filteredTechnicians = technicianDrop.filter((technician) =>
    technician.user_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleTechnician = (tech) => {
    setSelectedTechnicians((prev) => {
      const isSelected = prev.some((t) => t._id === tech._id);
      return isSelected
        ? prev.filter((t) => t._id !== tech._id)
        : [...prev, tech];
    });
  };

  const clearAll = () => setSelectedTechnicians([]);
  const removeTechnician = (id) =>
    setSelectedTechnicians((prev) => prev.filter((t) => t._id !== id));

  // keep formData.userId synced with selectedTechnicians
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      userId: selectedTechnicians.length > 0
        ? selectedTechnicians.map((t) => t._id) // array of IDs
        : [],
    }));
  }, [selectedTechnicians]);

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    if (!formData.clusterId || !formData.date || !formData.userId.length) {
      alert("Please select a cluster, date, and at least one technician.");
      return;
    }

    const existingUserIds = assignment
      .filter(a => a.date === formData.date) 
      .map(a => a.userId?._id);

    // Filter out users who already have assignment
    const assignmentsToCreate = formData.userId
      .filter(id => !existingUserIds.includes(id))
      .map(userId => ({
        userId,
        clusterId: formData.clusterId,
        date: formData.date,
      }));

    if (assignmentsToCreate.length === 0) {
      alert("All selected technicians already have assignments for this date.");
      return;
    }

    // Submit assignments
    for (const item of assignmentsToCreate) {
      await dispatch(createClusterAssignment(item)).unwrap();
    }

    alert("Assignments created successfully.");
    setFormData({ userId: [], clusterId: "", date: "" });
    setSelectedTechnicians([]);
    dispatch(getClusterAssignment({ startDate, endDate, vehicleNo: selectedVehicle }));

  } catch (error) {
    console.error("Submission error:", error);
    alert(error?.message || "Error creating assignments.");
  }
};

  //   const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     for (const userId of formData.userIds) {
  //       await dispatch(createClusterAssignment({
  //         userId,
  //         clusterId: formData.clusterId,
  //         date: formData.date
  //       })).unwrap();
  //     }

  //     // reset
  //     setFormData({ userIds: [], clusterId: "", date: "" });
  //     dispatch(getClusterAssignment({ startDate, endDate }));

  //   } catch (error) {
  //     console.error("Submission error:", error);
  //   }
  // };



  const filteredAssignments = assignment.filter((a) => {
    const matchUser = filterUserId
      ? a.userId?._id === filterUserId
      : true;
    const matchCluster = filterClusterId
      ? a.clusterId?._id === filterClusterId
      : true;
    const matchStatus =
      statusFilter === "all"
        ? true
        : a.status?.toLowerCase() === statusFilter.toLowerCase();
    return matchUser && matchCluster && matchStatus;
  });

  const handleDelete = (assignId) => {
    const confirm = window.confirm("Are you sure?");
    if (confirm) {
      dispatch(deleteAssignment(assignId));
    }
  };

  const handleEditClick = (assignment) => {
    setSelectedAssignment(assignment);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAssignment(null);
  };

  const handleVehicleSelect = (value) => {
    setSelectedVehicle(value);
    if (value) {
      dispatch(getClusterDropDown(value));
    } else {
      dispatch(getClusterDropDown(""));
    }
  };

  const handleResetFilters = () => {
    const { startDateStr, endDateStr } = getCurrentMonthDateRangeIST();
    setFilterUserId("");
    setFilterClusterId("");
    setSelectedVehicle("");
    setStartDate(startDateStr);
    setEndDate(endDateStr);
    dispatch(getClusterDropDown(""));
    dispatch(
      getClusterAssignment({
        startDate: startDateStr,
        endDate: endDateStr,
        vehicleNo: "",
      })
    );
  };

  const handleResetAssignForm = () => {
    setFormData({ userId: [], clusterId: "", date: "" });
    setSelectedTechnicians([]);
    setSelectedVehicle("");
    dispatch(getClusterDropDown(""));
  };

  const handleTechnicianChange = (selected) => {
    setSelectedTechnicians(selected);

    setFormData((prev) => ({
      ...prev,
      userId: selected.length > 0 ? selected[0]._id : "",
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100 text-black p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex mb-4 gap-4">
          <button
            onClick={() => setActiveTab("view")}
            className={`px-4 py-2 rounded border ${activeTab === "view"
                ? "bg-black text-white"
                : "bg-white text-black border-gray-400"
              }`}
          >
            View Assignments
          </button>
          <button
            onClick={() => setActiveTab("assign")}
            className={`px-4 py-2 rounded border ${activeTab === "assign"
                ? "bg-black text-white"
                : "bg-white text-black border-gray-400"
              }`}
          >
            Assign Cluster
          </button>
        </div>

        {activeTab === "assign" && (
          <div className="bg-white p-6 rounded shadow border border-gray-200 mt-6">
            <h2 className="text-xl font-semibold mb-4">
              Assign Cluster to User
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-4 pb-5">
                {/* Technician multi-select */}
                <div className="flex flex-col space-y-1">
                  <label className="text-sm font-medium">Select Technicians</label>
                  <button
                    type="button"
                    className="flex w-full justify-between items-center border rounded-lg px-3 py-2 bg-white shadow-sm hover:bg-gray-50"
                    onClick={() => setIsOpen((prev) => !prev)}
                  >
                    <span className="truncate text-sm">
                      {selectedTechnicians.length === 0
                        ? "Select technicians..."
                        : `${selectedTechnicians.length} selected`}
                    </span>
                    <ChevronDownIcon
                      className={`h-4 w-4 opacity-60 transition-transform ${isOpen ? "rotate-180" : ""
                        }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="border mt-1 rounded-lg bg-white shadow-md max-h-60 overflow-auto">
                      {selectedTechnicians.length > 0 && (
                        <div className="border-b p-2">
                          <button
                            type="button"
                            onClick={clearAll}
                            className="text-xs text-red-600 hover:underline"
                          >
                            Clear all
                          </button>
                        </div>
                      )}
                      <div>
                        {filteredTechnicians.map((tech) => {
                          const isSelected = selectedTechnicians.some(
                            (t) => t._id === tech._id
                          );
                          return (
                            <div
                              key={tech._id}
                              onClick={() => toggleTechnician(tech)}
                              className={`flex items-start space-x-2 p-3 cursor-pointer hover:bg-gray-100 ${isSelected ? "bg-gray-50" : ""
                                }`}
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleTechnician(tech)}
                                onClick={(e) => e.stopPropagation()}
                                className="mt-1"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center">
                                  <div className="text-sm font-medium truncate">
                                    {tech.user_name}
                                  </div>
                                  {isSelected && (
                                    <CheckCircleIcon className="h-4 w-4 text-green-500" />
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Vehicle */}
                <div className="flex flex-col">
                  <label className="mb-1 text-sm font-medium text-gray-700">
                    Select Vehicle
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-black"
                    value={selectedVehicle}
                    onChange={(e) => handleVehicleSelect(e.target.value)}
                  >
                    <option value="">Select a Vehicle</option>
                    {vehicles.map((vehicle) => (
                      <option key={vehicle.id} value={vehicle.id}>
                        {vehicle.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Cluster */}
                <div className="flex flex-col">
                  <label className="mb-1 text-sm font-medium text-gray-700">
                    Select Cluster
                  </label>
                  <select
                    className={`w-full border rounded-lg px-3 py-2 text-black ${selectedVehicle
                        ? "bg-white border-gray-300"
                        : "bg-gray-200 border-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    value={formData.clusterId}
                    onChange={(e) =>
                      setFormData({ ...formData, clusterId: e.target.value })
                    }
                    disabled={!selectedVehicle}
                  >
                    <option value="">Choose Cluster</option>
                    {clusterDrop.map((c) => (
                      <option key={c._id} value={c._id}>
                        Cluster {c.clusterNo} - ({c.clusterName})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date */}
                <div className="flex flex-col">
                  <label className="mb-1 text-sm font-medium text-gray-700">
                    Assignment Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-black"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    min={new Date().toISOString().split("T")[0]}
                    required
                  />
                </div>
              </div>

              <div className="mt-4 flex gap-3">
                <button
                  type="submit"
                  className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-900"
                  disabled={
                    formData.userId.length === 0 ||
                    !formData.clusterId ||
                    !formData.date ||
                    clusterLoading
                  }
                >
                  {clusterLoading ? "Creating..." : "Create Assignment"}
                </button>
                <button
                  type="button"
                  onClick={handleResetAssignForm}
                  className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-900"
                >
                  Reset
                </button>
              </div>
            </form>
          </div>
        )}


        {activeTab === "view" && (
          <div className="bg-white p-6 rounded shadow border border-gray-200 mt-6">
            <h2 className="text-xl font-semibold mb-4">Assignment History</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-4 mb-6">
              <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium text-gray-700">Select Technician</label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-black"
                  value={filterUserId}
                  onChange={(e) => setFilterUserId(e.target.value)}
                >
                  <option value="">All Technicians</option>
                  {filteredTechnicians.map((tech) => (
                    <option key={tech._id} value={tech._id}>
                      {tech.user_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium text-gray-700">Select Vehicle</label>
                <select
                  onChange={(e) => handleVehicleSelect(e.target.value)}
                  value={selectedVehicle}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black bg-white"
                >
                  <option value="" disabled>Select a vehicle</option>
                  {vehicles.map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium text-gray-700">Select Cluster</label>
                <select
                  className={`w-full border rounded-lg px-3 py-2 text-black
                    ${selectedVehicle ? "bg-white border-gray-300" : "bg-gray-200 border-gray-300 text-gray-500 cursor-not-allowed"}`}
                  value={filterClusterId}
                  onChange={(e) => setFilterClusterId(e.target.value)}
                  disabled={!selectedVehicle}
                >
                  <option value="">Choose Cluster</option>
                  {clusterDrop.map((c) => (
                    <option key={c._id} value={c._id}>
                      Cluster {c.clusterNo} - ({c.clusterName})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium text-gray-700">Start Date</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium text-gray-700">End Date</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>

              <div className="mt-6">
                <button
                  onClick={handleResetFilters}
                  className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-900"
                >
                  Reset Filters
                </button>
              </div>
            </div>

            {loading ? (
              <Loader />
            ) : (
              <div className="max-h-[75vh] overflow-auto">
                <table className="w-full border text-sm text-black">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="p-2 border">No.</th>
                      <th className="p-2 border">User</th>
                      <th className="p-2 border">Vehicle</th>
                      <th className="p-2 border">Cluster</th>
                      <th className="p-2 border">Date</th>
                      <th className="p-2 border">Status</th>
                      <th className="p-2 border">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAssignments.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="text-center p-4 text-gray-500">
                          No assignments found.
                        </td>
                      </tr>
                    ) : (
                      filteredAssignments.map((a, idx) => (
                        <tr key={idx} className="border-t border-gray-200">
                          <td className="p-2 border text-center">{idx + 1}</td>
                          <td className="p-2 border text-center">{a.userId?.user_name || "N/A"}</td>
                          <td className="p-2 border text-center">{a.clusterId?.vehicleNo || "N/A"}</td>
                          <td className="p-2 border text-center">
                            Cluster {a.clusterId?.clusterNo ?? "N/A"} <br /> ({a.clusterId?.clusterName})
                          </td>
                          <td className="p-2 border text-center">
                            {a.date
                              ? `${new Date(a.date).toLocaleDateString("en-GB")} (${new Date(a.date).toLocaleDateString("en-US", { weekday: "long" })})`
                              : "N/A"}
                          </td>
                          <td className="p-2 border text-center">
                            <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-800">
                              {a.status || "Active"}
                            </span>
                          </td>
                          <td className="p-2 border text-center">
                            <div className="flex justify-center gap-3">
                              <Typography
                                className="cursor-pointer p-1.5"
                                title="Details"
                                onClick={() => handleEditClick(a)}
                              >
                                <EyeIcon className="h-5 w-5" />
                              </Typography>
                              <Typography
                                onClick={() => handleDelete(a._id)}
                                className="p-1.5 cursor-pointer"
                                title="Delete"
                              >
                                <TrashIcon className="h-5 w-5" />
                              </Typography>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        <EditModal
          isOpen={isModalOpen}
          onClose={closeModal}
          assignment={selectedAssignment?._id}
        />
      </div>
    </div>
  );
};

export default ClusterAssignments;
