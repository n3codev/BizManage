import PropTypes from "prop-types";
import "./InvoicesRow.css";

function InvoicesRow({ invoice, isSelected, onClick }) {
  const { id, seller, customer, date, amount } = invoice;

  return (
    <div
      className={`table-row ${isSelected ? "selected" : ""}`}
      role="row"
      onClick={() => onClick(id)}
    >
      <div className="info">{customer.name}</div>
      <div className="info2">{seller.companyName}</div>
      <div className="info2">{date}</div>
      <div className="info2">{amount}$</div>
    </div>
  );
}

InvoicesRow.propTypes = {
  invoice: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    seller: PropTypes.string.isRequired,
    customer: PropTypes.string,
    date: PropTypes.string,
    amount: PropTypes.number,
  }).isRequired,
  isSelected: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};
export default InvoicesRow;
