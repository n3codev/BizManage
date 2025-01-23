import { FaCompass } from "react-icons/fa6";
import { MdGpsFixed } from "react-icons/md";
import { IoSchoolSharp } from "react-icons/io5";
import { useNavigate, useLocation } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="aside">
      <div className="sidebarContent">
        <div
          className={`radiusDiv ${
            location.pathname === "/invoices" ? "active" : ""
          }`}
          onClick={() => navigate("/invoices")}
        >
          <FaCompass />
        </div>
        <div
          className={`radiusDiv ${
            location.pathname === "/sellers" ? "active" : ""
          }`}
          onClick={() => navigate("/sellers")}
        >
          <MdGpsFixed />
        </div>
        <div
          className={`radiusDiv ${
            location.pathname === "/customers" ? "active" : ""
          }`}
          onClick={() => navigate("/customers")}
        >
          <IoSchoolSharp />
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
