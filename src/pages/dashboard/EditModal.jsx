import React from "react";
import {
  MdPerson,
  MdCalendarToday,
  MdRadioButtonChecked,
} from "react-icons/md";
import { FaBox } from "react-icons/fa";
import { IoClose } from "react-icons/io5"; // close icon

const EditModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const formattedDate = "25/06/2025"; // Static Date

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

        {/* Header */}
        <div className="flex items-start justify-between mb-2 mt-4">
          <div className="flex gap-2 items-start">
            <div className="bg-orange-600 rounded-full w-8 h-8 flex items-center justify-center text-white">
              <MdRadioButtonChecked className="text-lg" />
            </div>
            <div>
              <h3 className="text-lg font-semibold leading-5 mt-1.5">Sunday</h3>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold leading-none">12</p>
            <p className="text-[12px] text-gray-500">Cluster No.</p>
          </div>
        </div>

        {/* Meta Info */}
        <div className="flex justify-between items-center text-sm text-gray-600 mb-3">
          <span className="flex items-center gap-1">
            <MdPerson className="text-base" />
            John Doe
          </span>
          <span className="flex items-center gap-1">
            <MdCalendarToday className="text-base" />
            {formattedDate}
          </span>
        </div>

        {/* Scrollable Customer List */}
        <div className="space-y-2 mb-3 max-h-64 overflow-y-auto pr-1">
          {[...Array(10)].map((_, idx) => (
            <div
              key={idx}
              className="flex gap-2 p-3 bg-gray-50 rounded-lg shadow-sm border-l-4 border-orange-600"
            >
              <div className="text-orange-600 font-bold text-lg">{idx + 1}</div>
              <div>
                <p className="font-semibold text-sm">Customer {idx + 1}</p>
                <p className="text-xs text-gray-500">CUST00{idx + 1}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Info */}
        <div className="flex justify-between items-center border-t pt-3 text-sm">
          <div className="flex items-center gap-1">
            <FaBox className="text-sm" />
            24
          </div>
          <div className="text-orange-600 font-semibold">
            CARTRIDGE QTY: 10
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
