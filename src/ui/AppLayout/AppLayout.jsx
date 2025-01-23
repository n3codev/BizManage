import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import Heading from "../Heading/Heading";
import "./AppLAyout.css";
function AppLayout() {
  return (
    <div className="app-layout">
      <Heading />
      <Sidebar />
      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;
