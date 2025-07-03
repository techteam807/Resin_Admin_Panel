import {
  EyeIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { getTechnicianDropDown } from '@/feature/technician/technicianSlice';
import { createClusterAssignment, deleteAssignment, getClusterAssignment, getClusterDropDown } from '@/feature/customer/customerSlice';
import EditModal from "./EditModal";

const ClusterAssignments = () => {
  const dispatch = useDispatch();
  const { technicianDrop } = useSelector((state) => state.technician);
  const { clusterDrop, assignment, clusterLoading } = useSelector((state) => state.customer);
  const [isModalOpen, setIsModalOpen] = useState(false);
const [selectedAssignment, setSelectedAssignment] = useState(null);


  const [formData, setFormData] = useState({
    userId: "",
    clusterId: "",
    date: "",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("assign");

  const [filterUserId, setFilterUserId] = useState("");
  const [filterClusterId, setFilterClusterId] = useState("");

  useEffect(() => {
    dispatch(getTechnicianDropDown());
    dispatch(getClusterDropDown());
    dispatch(getClusterAssignment());
  }, [dispatch]);

  const filteredTechnicians = technicianDrop.filter((technician) =>
    technician.user_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createClusterAssignment(formData)).unwrap();
      setFormData({ userId: "", clusterId: "", date: "" });
      dispatch(getClusterAssignment());
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  const filteredAssignments = assignment.filter((a) => {
    const matchUser = filterUserId ? a.userId?._id === filterUserId : true;
    const matchCluster = filterClusterId ? a.clusterId?._id === filterClusterId : true;
    const matchStatus = statusFilter === "all" ? true : a.status?.toLowerCase() === statusFilter.toLowerCase();
    return matchUser && matchCluster && matchStatus;
  });

  const handleDelete = (assignId) => {
    console.log("Trying to delete assignment with ID:", assignId);
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

  
  return (
    <div className="min-h-screen bg-gray-100 text-black p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex mb-4 gap-4">
          <button
            onClick={() => setActiveTab("assign")}
            className={`px-4 py-2 rounded border ${activeTab === "assign" ? "bg-black text-white" : "bg-white text-black border-gray-400"}`}
          >
            Assign Cluster
          </button>
          <button
            onClick={() => setActiveTab("view")}
            className={`px-4 py-2 rounded border ${activeTab === "view" ? "bg-black text-white" : "bg-white text-black border-gray-400"}`}
          >
            View Assignments
          </button>
        </div>

        {activeTab === "assign" && (
          <div className="bg-white p-6 rounded shadow border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Assign Cluster to User</h2>
            <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-3">
              <div>
                <label className="block mb-2 text-sm text-gray-700">Select Technician</label>
                <select
                  className="w-full border border-gray-400 rounded px-3 py-2 bg-white text-black"
                  value={formData.userId}
                  onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                   required
                >
                  <option value="">Choose a Technician</option>
                  {filteredTechnicians.map((tech) => (
                    <option key={tech._id} value={tech._id}>
                      {tech.user_name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-2 text-sm text-gray-700">Select Cluster</label>
                <select
                  className="w-full border border-gray-400 rounded px-3 py-2 bg-white text-black"
                  value={formData.clusterId}
                  onChange={(e) => setFormData({ ...formData, clusterId: e.target.value })}
                   required
                >
                  <option value="">Choose a cluster</option>
                  {clusterDrop.map((c) => (
                    <option key={c._id} value={c._id}>
                      Cluster {c.clusterNo}  - ({c.clusterName})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-2 text-sm text-gray-700">Assignment Date</label>
                <input
                  type="date"
                  className="w-full border border-gray-400 rounded px-3 py-2 bg-white text-black"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  min={new Date().toISOString().split("T")[0]}
                   required
                />
              </div>
              <div className="md:col-span-3">
                <button
                  type="submit"
                  className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
                  disabled={!formData.userId || !formData.clusterId || !formData.date || clusterLoading}
                >
                  {clusterLoading ? "Creating..." : "Create Assignment"}
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === "view" && (
          <div className="bg-white p-6 rounded shadow border border-gray-200 mt-6">
            <h2 className="text-xl font-semibold mb-4">Assignment History</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Select Technician</label>
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

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Select Cluster</label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-black"
                  value={filterClusterId}
                  onChange={(e) => setFilterClusterId(e.target.value)}
                >
                  <option value="">All Clusters</option>
                  {clusterDrop.map((c) => (
                    <option key={c._id} value={c._id}>
                      Cluster {c.clusterNo} - ({c.clusterName})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <table className="w-full border text-sm text-black">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 border">No.</th>
                  <th className="p-2 border">User</th>
                  <th className="p-2 border">Cluster</th>
                  <th className="p-2 border">Date</th>
                  <th className="p-2 border">Status</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssignments.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center p-4 text-gray-500">
                      No assignments found.
                    </td>
                  </tr>
                ) : (
                  filteredAssignments.map((a,idx) => (
                    <tr key={idx} className="border-t border-gray-200">
                      <td className="p-2 border text-center">{idx +1}</td>
                      <td className="p-2 border text-center">{a.userId?.user_name || "N/A"}</td>
                      <td className="p-2 border text-center">Cluster {a.clusterId?.clusterNo ?? "N/A"} <br/> ({a.clusterId?.clusterName})</td>
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
                        <button
                          className="p-1.5 rounded-full hover:bg-blue-100 text-blue-600 transition duration-150"
                          title="Details"
                          onClick={() => handleEditClick(a)}
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>
                      <button
                            onClick={() => handleDelete(a._id)} 
                            className="p-1.5 rounded-full hover:bg-red-100 text-red-600 transition duration-150"
                            title="Delete"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                      </div>
                    </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
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
