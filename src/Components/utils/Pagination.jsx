import { useState } from "react";
import { FaAngleDoubleLeft, FaAngleDoubleRight, FaAngleLeft, FaAngleRight } from "react-icons/fa";

export default function Pagination({
  items = [],
  itemsPerPageOptions = [15, 100, 200, 500],
  onPageChange,
  onItemsPerPageChange
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(itemsPerPageOptions[0]);

  const totalPages = Math.ceil(items.length / itemsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    if (onPageChange) onPageChange(newPage);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    if (onItemsPerPageChange) onItemsPerPageChange(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when items per page change
  };

  const displayedItems = items.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="flex gap-x-5 w-full justify-center items-center">
      <div className="flex items-center">
        <div className="flex gap-2">
          <button
            onClick={() => handlePageChange(1)}
            className="px-4 py-2 cursor-pointer bg-cyan-500 bg-opacity-50 text-white rounded-lg shadow-md hover:bg-cyan-600 transition duration-300"
          >
            <FaAngleDoubleLeft />
          </button>

          <button
            onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 cursor-pointer bg-cyan-500 bg-opacity-50 text-white rounded-lg shadow-md hover:bg-cyan-600 transition duration-300"
          >
            <FaAngleLeft />
          </button>
        </div>

        <span className="px-4 bg-cyan-500 bg-opacity-50 mx-1 text-white py-[6px] rounded-lg text-sm font-semibold">
          {currentPage} / {totalPages}
        </span>
        
        <div className="flex gap-2">
          <button
            onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 cursor-pointer py-2 bg-cyan-500 bg-opacity-50 text-white rounded-lg shadow-md hover:bg-cyan-600 transition duration-300"
          >
            <FaAngleRight />
          </button>

          <button
            onClick={() => handlePageChange(totalPages)}
            className="px-4 py-2 cursor-pointer bg-cyan-500 bg-opacity-50 text-white rounded-lg shadow-md hover:bg-cyan-600 transition duration-300"
          >
            <FaAngleDoubleRight />
          </button>
        </div>
      </div>
        
      <div className="flex">
        <div className="flex gap-2">
          {itemsPerPageOptions.map(option => (
            <button
              key={option}
              onClick={() => handleItemsPerPageChange(option)}
              className={`px-4 py-2 cursor-pointer bg-cyan-500 text-sm bg-opacity-50 text-white rounded-lg shadow-md hover:bg-cyan-600 font-bold transition duration-300 ${itemsPerPage === option ? 'bg-cyan-700' : ''}`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
