// Layout.jsx
import { Outlet } from "react-router";
import Navbar from "./NavBar";

export default function Layout() {
  return (
    <div className="flex">
      <Navbar />
      <div className="flex-1 p-4">
        <Outlet />
      </div>
    </div>
  );
}
