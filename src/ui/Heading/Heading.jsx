import { useLocation } from "react-router-dom";
import "./Heading.css";

function Heading() {
  const location = useLocation();
  const pageName = () => {
    switch (location.pathname) {
      case "/invoices":
        return "Invoices";
      case "/sellers":
        return "Sellers";
      case "/customers":
        return "Customers";
      default:
        return "Home";
    }
  };

  return <div className="header">{pageName().toLocaleUpperCase()}</div>;
}

export default Heading;
