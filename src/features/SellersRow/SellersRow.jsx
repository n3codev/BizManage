import PropTypes from "prop-types";
import "./SellersRow.css";

function SellersRow({ seller, isSelected, onClick }) {
  const { companyName, hqAddress, isActive } = seller;

  return (
    <div
      className={`table-row-seller ${isSelected ? "selected" : ""}`}
      role="row"
      onClick={() => onClick(seller.id)}
    >
      <div className="author">
        <div>{companyName}</div>
      </div>
      <div className="hq-address">
        <div>{hqAddress}</div>
      </div>
      <div>{isActive ? "Active" : "Inactive"}</div>
    </div>
  );
}

SellersRow.propTypes = {
  seller: PropTypes.shape({
    id: PropTypes.number.isRequired,
    companyName: PropTypes.string.isRequired,
    hqAddress: PropTypes.string.isRequired,
    isActive: PropTypes.bool.isRequired,
  }).isRequired,
  isSelected: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default SellersRow;
