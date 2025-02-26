import React from "react";
import { Button, Typography, CardFooter } from "@material-tailwind/react";

const Pagination = ({ currentPage, totalPages, onChange }) => {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onChange(currentPage + 1);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + 4);
    
    if (end === totalPages) {
      start = Math.max(1, end - 4);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
      <Typography variant="small" color="blue-gray" className="font-normal">
        Page {currentPage} of {totalPages}
      </Typography>
      <div className="flex gap-2">
        <Button variant="outlined" size="sm" onClick={handlePrevious} disabled={currentPage === 1}>
          Previous
        </Button>

        {getPageNumbers().map((page) => (
          <Button
            key={page}
            variant={currentPage === page ? "filled" : "outlined"}
            size="sm"
            onClick={() => onChange(page)}
            className="hidden md:block"
          >
            {page}
          </Button>
        ))}

        <Button variant="outlined" size="sm" onClick={handleNext} disabled={currentPage === totalPages}>
          Next
        </Button>
      </div>
    </CardFooter>
  );
};

export default Pagination;
