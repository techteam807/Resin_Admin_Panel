import React, { useEffect } from "react";
import {
  MdPerson,
  MdCalendarToday,
  MdRadioButtonChecked,
} from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { detailAssignment } from "@/feature/customer/customerSlice";
import Loader from "../Loader";

const EditModal = ({ isOpen, onClose, assignment }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (assignment) {
      dispatch(detailAssignment(assignment));
    }
  }, [dispatch, assignment]);

  const { assignmentDetails, loading } = useSelector(
    (state) => state.customer
  );
  console.log("assignmentDetails", assignmentDetails);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 overflow-x-hidden">
      <div className="relative bg-white p-4 rounded-2xl w-[90%] max-w-4xl shadow-lg max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
        >
          <IoClose />
        </button>

        {/* Loader */}
        {loading || !assignmentDetails ? (
          <div className="flex items-center justify-center h-64">
            <Loader />
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-start justify-between mb-2 mt-4">
              <div className="flex gap-2 items-start">
                <div className="bg-orange-600 rounded-full w-8 h-8 flex items-center justify-center text-white">
                  <MdRadioButtonChecked className="text-lg" />
                </div>
                <h3 className="text-lg font-semibold leading-5 mt-1.5">
                  {assignmentDetails?.clusterId?.clusterName}
                </h3>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold leading-none">
                  {assignmentDetails?.clusterId?.clusterNo}
                </p>
                <p className="text-[12px] text-gray-500">Cluster No.</p>
              </div>
            </div>

            {/* Meta Info */}
            <div className="flex justify-between items-center text-sm text-gray-600 mb-3">
              <span className="flex items-center gap-1">
                <MdPerson className="text-base" />
                {assignmentDetails?.userId?.user_name}
              </span>
              <span className="flex items-center gap-1">
                <MdCalendarToday className="text-base" />
                {assignmentDetails?.date?.split("T")[0]}
              </span>
            </div>

            {/* Customer List */}
            <div className="grid grid-cols-2 gap-4 rounded-xl max-h-[50vh] overflow-y-auto">
              {/* Pending */}
              <div className="shadow-md rounded-xl p-4 bg-gray-200">
                <h3 className="text-base font-bold text-orange-700 mb-3">
                  Pending
                </h3>
                {assignmentDetails?.clusterId?.customers
                  ?.filter((c) => !c.CustomerReplaceMentStatus)
                  .map((customer, index) => {
                    const isFreezed = customer?.isFreezed;
                    return (
                      <div
                        key={`pending-${index}`}
                        className={`flex gap-2 p-3 mb-2 rounded-lg shadow-sm border-l-4 relative ${
                          isFreezed
                            ? "bg-gray-100 border-gray-400 text-gray-400 cursor-not-allowed opacity-60"
                            : "bg-white border-orange-600"
                        }`}
                      >
                        <div
                          className={`font-bold text-lg ${
                            isFreezed ? "text-gray-400" : "text-orange-600"
                          }`}
                        >
                          {customer?.indexNo + 1}
                        </div>
                        <div>
                          <p
                            className={`font-semibold text-sm ${
                              isFreezed ? "text-gray-400" : ""
                            }`}
                          >
                            {customer?.customerId?.first_name}{" "}
                            {customer?.customerId?.last_name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {customer?.customerId?.contact_number}
                          </p>
                        </div>
                      </div>
                    );
                  })}
              </div>

              {/* Completed */}
              <div className="shadow-md rounded-xl p-4 bg-gray-200">
                <h3 className="text-base font-bold text-green-700 mb-3">
                  Completed
                </h3>
                {assignmentDetails?.clusterId?.customers
                  ?.filter((c) => c.CustomerReplaceMentStatus)
                  .map((customer, index) => {
                    const isFreezed = customer?.isFreezed;
                    return (
                      <div
                        key={`completed-${index}`}
                        className={`flex gap-2 p-3 mb-2 rounded-lg shadow-sm border-l-4 relative ${
                          isFreezed
                            ? "bg-gray-100 border-gray-400 text-gray-400 cursor-not-allowed opacity-60"
                            : "bg-white border-green-500"
                        }`}
                      >
                        <div
                          className={`font-bold text-lg ${
                            isFreezed ? "text-gray-400" : "text-green-600"
                          }`}
                        >
                          {customer?.indexNo + 1}
                        </div>
                        <div>
                          <p
                            className={`font-semibold text-sm ${
                              isFreezed ? "text-gray-400" : ""
                            }`}
                          >
                            {customer?.customerId?.first_name}{" "}
                            {customer?.customerId?.last_name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {customer?.customerId?.contact_number}
                          </p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-gray-200 text-center text-sm text-gray-700 flex justify-between">
              <div className="text-left">
                {assignmentDetails?.clusterId?.customers.length} Customers <br />
                {assignmentDetails?.clusterId?.cartridge_qty} Cartridge Quantity
              </div>
              <div>
                {assignmentDetails?.cartridgeSizeCounts &&
                  Object.entries(assignmentDetails.cartridgeSizeCounts).map(
                    ([size, count]) => (
                      <div key={size}>
                        {size}: {count}
                      </div>
                    )
                  )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EditModal;
