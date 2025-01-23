import { useEffect } from "react";
import { getSellers } from "../../services/apiSellers";
import SellersTable from "../../features/SellersTable/SellersTable";
import { useSearchParams } from "react-router-dom";
import "./Sellers.css";

function Sellers() {
  useEffect(function () {
    getSellers();
  }, []);
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;

  return (
    <div className="sellers-container">
      <SellersTable currentPage={page} />
    </div>
  );
}

export default Sellers;
