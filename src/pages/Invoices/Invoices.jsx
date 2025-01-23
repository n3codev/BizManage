import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getInvoice } from "../../services/apiInvoices";
import InvoicesTable from "../../features/InvoicesTable/InvoicesTable";
import "./Invoices.css";

function Invoices() {
  useEffect(function () {
    getInvoice();
  }, []);
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;

  return (
    <div className="invoices-container ">
      <InvoicesTable currentPage={page} />
    </div>
  );
}

export default Invoices;
