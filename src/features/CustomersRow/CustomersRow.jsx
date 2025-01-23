import PropTypes from "prop-types";
import "./CustomersRow.css";

function CustomersRow({ customer, isSelected, onClick }) {
  const { id, name, surname, address, age } = customer;

  return (
    <div
      role="row"
      aria-selected={isSelected}
      className={`table-row ${isSelected ? "selected" : ""}`}
      onClick={() => onClick(id)}
      style={{
        "--border-color": isSelected ? "#96d0ff" : "#dbdbdb",
        "--bg-color": isSelected ? "#cce8ff" : "transparent",
      }}
    >
      <div className="customer-info">{name}</div>
      <div className="customer-info2">{surname}</div>
      <div className="customer-info2">{address}</div>
      <div className="customer-info2">{age}</div>
    </div>
  );
}

CustomersRow.propTypes = {
  customer: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    surname: PropTypes.string,
    address: PropTypes.string,
    age: PropTypes.number,
  }).isRequired,
  isSelected: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default CustomersRow;
