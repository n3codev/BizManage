import { IoChevronBackOutline, IoChevronForward } from "react-icons/io5";
import PropTypes from "prop-types";
import "./Pagination.css";

function Pagination({ count, currentPage, onPageChange, pageSize }) {
  const pageCount = Math.ceil(count / pageSize);

  const handlePageChange = (page) => {
    if (page < 1 || page > pageCount) return;
    onPageChange(page);
  };

  const nextPage = () => handlePageChange(currentPage + 1);
  const prevPage = () => handlePageChange(currentPage - 1);

  if (pageCount <= 1) return null;

  return (
    <div className="pagination">
      <div className="buttons">
        <button
          className="pagination-button"
          onClick={prevPage}
          disabled={currentPage === 1}
        >
          <IoChevronBackOutline />
        </button>
        <button className="pagination-button active" disabled>
          {currentPage}
        </button>
        <button
          className="pagination-button"
          onClick={nextPage}
          disabled={currentPage === pageCount}
        >
          <IoChevronForward />
        </button>
        <button className="pagination-button active" disabled>
          {pageCount}
        </button>
      </div>
    </div>
  );
}

Pagination.propTypes = {
  count: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  pageSize: PropTypes.number.isRequired,
};

export default Pagination;
