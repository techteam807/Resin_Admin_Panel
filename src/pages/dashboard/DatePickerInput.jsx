// import React, { useState } from "react";
// import {
//   Input,
//   Popover,
//   PopoverHandler,
//   PopoverContent,
// } from "@material-tailwind/react";
// import { format } from "date-fns";
// import { DayPicker } from "react-day-picker";
// import {
//   ChevronRightIcon,
//   ChevronLeftIcon,
// } from "@heroicons/react/24/outline";

// export const DatePickerInput = ({ label, selectedDate, onSelect }) => {
//   const [open, setOpen] = useState(false);

//   return (
//     <Popover
//       placement="bottom"
//       open={open}
//       handler={() => setOpen(!open)}
//       animate={{
//         mount: { opacity: 1, scale: 1 },
//         unmount: { opacity: 0, scale: 0.95 },
//       }}
//     >
//       <PopoverHandler>
//         <div className="">
//           <Input
//             label={label}
//             onChange={() => null}
//             value={selectedDate ? format(selectedDate, "yyyy-MM-dd") : ""}
//             className="cursor-pointer"
//             onClick={() => setOpen(true)}
//             readOnly
//           />
//         </div>
//       </PopoverHandler>
//       <PopoverContent className="z-50 p-2">
//         <DayPicker
//           mode="single"
//           selected={selectedDate}
//           onSelect={(date) => {
//             onSelect(date);
//             setOpen(false);
//           }}
//         //   showOutsideDays
//           className="border-0"
//           classNames={{
//             caption: "flex justify-between items-center mb-2 px-4",
//             caption_label: "text-base font-medium text-gray-800",
//             nav: "flex items-center space-x-2",
//             nav_button: "p-1 rounded hover:bg-gray-200 transition",
//             nav_button_previous: "order-first",
//             nav_button_next: "order-last",
//             table: "w-full border-collapse",
//             head_row: "flex",
//             head_cell: "w-10 text-center text-sm text-gray-500",
//             row: "flex justify-between mt-1",
//             cell: "w-10 h-10 text-center text-sm",
//             day: "w-10 h-10 rounded-full flex items-center justify-center text-sm text-gray-800 hover:bg-gray-100",
//             day_selected: "bg-blue-500 text-white hover:bg-blue-600",
//             day_today: "border border-blue-500 text-blue-500",
//             day_outside: "text-gray-300",
//             day_disabled: "text-gray-400 opacity-50",
//             day_hidden: "invisible",
//           }}
          
//           components={{
//             IconLeft: (props) => (
//               <ChevronLeftIcon {...props} className="h-4 w-4 stroke-2" />
//             ),
//             IconRight: (props) => (
//               <ChevronRightIcon {...props} className="h-4 w-4 stroke-2" />
//             ),
//           }}
//         />
//       </PopoverContent>
//     </Popover>
//   );
// };







// // import * as React from "react";
// // import TextField from "@mui/material/TextField";
// // import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// // import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
// // import { DatePicker } from "@mui/x-date-pickers/DatePicker";

// // export default function DatePickerInput() {
// //   const [value, setValue] = React.useState(null);

// //   return (
// //     <div className="w-72">
// //       <LocalizationProvider dateAdapter={AdapterDateFns}>
// //         <DatePicker
// //           label="Select a date"
// //           value={value}
// //           onChange={(newValue) => setValue(newValue)}
// //           renderInput={(params) => <TextField {...params} fullWidth />}
// //         />
// //       </LocalizationProvider>
// //     </div>
// //   );
// // }

