// Layout.jsx
import { Outlet } from "react-router";
import Navbar from "./NavBar";

export default function Layout() {
  return (
    <div className="flex min-h-screen">
      <Navbar />
      <div className="flex-1 bg-[#F9F9FF]">
        <Outlet />
      </div>
    </div>
  );
}
