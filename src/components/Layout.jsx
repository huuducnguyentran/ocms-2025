// Layout.jsx
import { Outlet } from "react-router";
import Navbar from "./NavBar";
import TopBar from "../page/Home/TopBar";

export default function Layout() {
  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Navbar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <div className="flex-1 overflow-auto bg-gray-50">
          <div className="p-6 min-h-full">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}