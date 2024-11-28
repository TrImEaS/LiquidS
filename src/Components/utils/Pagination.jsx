import { FaAngleDoubleLeft, FaAngleDoubleRight, FaAngleLeft, FaAngleRight } from "react-icons/fa";

export default function Pagination({
  currentPage,
  totalPages,
  setCurrentPage,
  setItemsPerPage
}) {
  const itemsPerPageOptions = [15, 100, 200, 500];

  return (
    <div className="flex gap-x-5 mt-5 w-full justify-center items-center">
      <div className="flex items-center">
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage(1)}
            className="px-4 py-2 cursor-pointer bg-cyan-500 bg-opacity-50 text-white rounded-lg shadow-md hover:bg-cyan-600 transition duration-300"
          >
            <FaAngleDoubleLeft className="text-2xl" />
          </button>

          <button
            onClick={() => setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 cursor-pointer bg-cyan-500 bg-opacity-50 text-white rounded-lg shadow-md hover:bg-cyan-600 transition duration-300"
          >
            <FaAngleLeft className="text-2xl" />
          </button>
        </div>

        <span className="px-4 bg-cyan-500 bg-opacity-50 mx-1 text-white py-[6px] rounded-lg text-xl font-semibold">
          {currentPage} / {totalPages}
        </span>

        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 cursor-pointer py-2 bg-cyan-500 bg-opacity-50 text-white rounded-lg shadow-md hover:bg-cyan-600 transition duration-300"
          >
            <FaAngleRight className="text-2xl" />
          </button>

          <button
            onClick={() => setCurrentPage(totalPages)}
            className="px-4 py-2 cursor-pointer bg-cyan-500 bg-opacity-50 text-white rounded-lg shadow-md hover:bg-cyan-600 transition duration-300"
          >
            <FaAngleDoubleRight className="text-2xl" />
          </button>
        </div>
      </div>

      <div className="flex gap-2">
        {itemsPerPageOptions.map((size) => (
          <button
            key={size}
            onClick={() => setItemsPerPage(size)}
            className="px-4 py-2 cursor-pointer bg-cyan-500 bg-opacity-50 text-white rounded-lg shadow-md hover:bg-cyan-600 font-bold transition duration-300"
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
}
