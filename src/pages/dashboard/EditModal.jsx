import React, { useEffect } from "react";
import {
  MdPerson,
  MdCalendarToday,
  MdRadioButtonChecked,
} from "react-icons/md";
import { FaBox } from "react-icons/fa";
import { IoClose } from "react-icons/io5"; 
import { useDispatch, useSelector } from 'react-redux';
import { detailAssignment } from "@/feature/customer/customerSlice";
import Loader from "../Loader";

const EditModal = ({ isOpen, onClose, assignment }) => {

  const dispatch = useDispatch();

  useEffect(() => {
    const assignId = assignment;
    if (assignId) {
      dispatch(detailAssignment(assignId));
    }
  }, [dispatch, assignment]);

  const { assignmentDetails, loading } = useSelector((state) => state.customer);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="relative bg-white p-4 rounded-2xl w-[90%] max-w-md shadow-lg max-h-[90vh] overflow-y-auto">
        {/* Top-right Close Icon */}
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
                <div>
                  <h3 className="text-lg font-semibold leading-5 mt-1.5">{assignmentDetails?.clusterId?.clusterName}</h3>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold leading-none">{assignmentDetails?.clusterId?.clusterNo}</p>
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
            <div className="space-y-2 mb-3 max-h-64 overflow-y-auto pr-1">
              {assignmentDetails?.clusterId?.customers
                ?.slice()
                .sort((a, b) => a.sequenceNo - b.sequenceNo)
                .map((customer, index) => (
                  <div
                    key={index}
                    className={`flex gap-2 p-3 bg-gray-50 rounded-lg shadow-sm border-l-4 ${
                      customer.CustomerReplaceMentStatus ? "border-green-500" : "border-orange-600"
                    }`}
                  >
                    <div className={`font-bold text-lg ${customer.CustomerReplaceMentStatus ? "text-green-500" : "text-orange-600"}`}>
                      {customer?.sequenceNo}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{customer?.customerId?.display_name}</p>
                      <p className="text-xs text-gray-500">{customer?.customerId?.contact_number}</p>
                    </div>
                  </div>
                ))}
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center border-t pt-3 text-sm">
              <div className="flex items-center gap-1">
                <FaBox className="text-sm" />
                {assignmentDetails?.clusterId?.customers?.length}
              </div>
              <div className="text-orange-600 font-semibold">
                CARTRIDGE QTY: {assignmentDetails?.clusterId?.cartridge_qty}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EditModal;