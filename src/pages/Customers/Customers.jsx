import { useEffect } from "react";
import { getCustomers } from "../../services/apiCustomers";
import CustomersTable from "../../features/CustomersTable/CustomersTable";
import { useSearchParams } from "react-router-dom";
import "./Customers.css";

function Customers() {
  useEffect(function () {
    getCustomers().then();
  }, []);
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;

  return (
    <div className="customers-content">
      <CustomersTable currentPage={page} />
    </div>
  );
}

export default Customers;
