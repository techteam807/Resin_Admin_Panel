import React, { useState } from "react";
// import { User, MapPin, Phone, Mail, Calendar, DollarSign, Droplet, Users, Package, ExternalLink, Clock, RefreshCw } from 'lucide-react';
import {UserIcon,MapPinIcon, PhoneIcon, EnvelopeIcon, CalendarDaysIcon, CurrencyDollarIcon, EyeDropperIcon, UsersIcon,InformationCircleIcon, LinkIcon, ClockIcon, ReceiptRefundIcon} from "@heroicons/react/24/solid";

const CustomerDetails = ({ customer, onBack}) => {
    console.log("customer",customer)
        if (!customer) return null;

   const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };


  return (
    <div className="min-h-screen bg-gray-50 mt-5">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Customer Details</h1>
             <button
        onClick={onBack}
        className="text-sm bg-cyan-600 hover:bg-cyan-700 text-white font-medium px-4 py-2 rounded-lg shadow"
      >
        ← Back to Customer List
      </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Personal Information */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Personal Information</h2>
              </div>
              <div className="px-6 py-5">
                <div className="flex items-center mb-6">
                  <div className="h-16 w-16 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600">
                    <UserIcon className="h-8 w-8" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">{customer?.customer_name}</h3>
                    <p className="text-sm text-gray-500">Customer ID: {customer?.contact_number}</p>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
                      {customer.isSubscription ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <EnvelopeIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Email</p>
                      <p className="text-sm text-gray-500">{customer?.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <PhoneIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Mobile</p>
                      <p className="text-sm text-gray-500">{customer?.mobile || "Not provided"}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <MapPinIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Location</p>
                      <p className="text-sm text-gray-500">Place of Contact: {customer?.place_of_contact}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Coordinates: {customer?.geoCoordinates?.coordinates[1]}, {customer?.geoCoordinates?.coordinates[0]}
                      </p>
                      <a
                        href={customer?.cf_google_map_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center mt-2 text-sm text-cyan-600 hover:text-cyan-500"
                      >
                        View on Google Maps
                        <LinkIcon className="ml-1 h-4 w-4" />
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <CalendarDaysIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Customer Since</p>
                      <p className="text-sm text-gray-500">{formatDate(customer?.created_time)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Financial Information</h2>
              </div>
              <div className="px-6 py-5">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <CurrencyDollarIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Currency</p>
                      <p className="text-sm text-gray-500">
                        {customer?.currency_code} ({customer?.currency_symbol})
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <CurrencyDollarIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Payment Terms</p>
                      <p className="text-sm text-gray-500">{customer?.payment_terms_label}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <CurrencyDollarIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Outstanding Amount</p>
                      <p className="text-sm text-gray-500">
                        {customer?.currency_symbol} {customer.outstanding?.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <CurrencyDollarIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Unused Credits</p>
                      <p className="text-sm text-gray-500">
                        {customer?.currency_symbol} {customer.unused_credits?.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Service Information */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Water Filtration Details</h2>
              </div>
              <div className="px-6 py-5">
                <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-cyan-50 rounded-lg p-4">
                    <div className="flex items-center text-cyan-700 mb-2">
                      <ReceiptRefundIcon className="h-5 w-5 mr-2" />
                      <span className="font-medium">Replacement Schedule</span>
                    </div>
                    <div className="space-y-2 ml-7">
                      <p className="text-gray-700">
                        <span className="font-medium">Cycle:</span> Every {customer?.cf_replacement_cycle_days} days
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">Day:</span> {customer?.cf_replacement_day}
                      </p>
                    </div>
                  </div>

                  <div className="bg-cyan-50 rounded-lg p-4">
                    <div className="flex items-center text-cyan-700 mb-2">
                      <InformationCircleIcon className="h-5 w-5 mr-2" />
                      <span className="font-medium">Cartridge Information</span>
                    </div>
                    <div className="space-y-2 ml-7">
                      <p className="text-gray-700">
                        <span className="font-medium">Size:</span> {customer?.cf_cartridge_size}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">Quantity:</span> {customer?.cf_cartridge_qty}
                      </p>
                    </div>
                  </div>

                  <div className="bg-cyan-50 rounded-lg p-4">
                    <div className="flex items-center text-cyan-700 mb-2">
                      <EyeDropperIcon className="h-5 w-5 mr-2" />
                      <span className="font-medium">Water Quality</span>
                    </div>
                    <div className="space-y-2 ml-7">
                      <p className="text-gray-700">
                        <span className="font-medium">Current Hardness:</span> {customer?.cf_current_water_hardness_ppm}{" "}
                        PPM
                      </p>
                    </div>
                  </div>

                  <div className="bg-cyan-50 rounded-lg p-4">
                    <div className="flex items-center text-cyan-700 mb-2">
                      <UsersIcon className="h-5 w-5 mr-2" />
                      <span className="font-medium">Household Information</span>
                    </div>
                    <div className="space-y-2 ml-7">
                      <p className="text-gray-700">
                        <span className="font-medium">Total Members:</span> {customer?.cf_total_members_living_in_the}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Service History</h2>
              </div>
              <div className="px-6 py-5">
                {customer.products.length > 0 ? (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Product
                        </th>
                        {/* <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Date
                        </th> */}
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {customer.products.map((product, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product?.productCode || "N/A"}</td>
                          {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product?.date || "N/A"}</td> */}
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product?.productStatus || "N/A"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 text-sm">No service history available</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Account Information</h2>
              </div>
              <div className="px-6 py-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <ClockIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">Last Updated</p>
                        <p className="text-sm text-gray-500">{formatDate(customer?.updated_time)}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <UserIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">Created By</p>
                        <p className="text-sm text-gray-500">{customer?.created_by}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start">
                      <UserIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">GST Treatment</p>
                        <p className="text-sm text-gray-500">
                          {customer?.gst_treatment.charAt(0).toUpperCase() + customer?.gst_treatment.slice(1)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <UserIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">Portal Invitation</p>
                        <p className="text-sm text-gray-500">
                          {customer?.is_portal_invitation_accepted ? "Accepted" : "Not Accepted"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CustomerDetails;