// src/components/BottomNavBar.jsx
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const navItems = [
  { label: "Topics", path: "/topics" },
  { label: "Talk Tips", path: "/tonightstalktips" },
  { label: "News", path: "/news" },
  { label: "Events", path: "/events" },
];

const BottomNavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 shadow-md z-50 flex justify-around py-2 text-sm text-[#0a2540]">
      {navItems.map((item) => (
        <button
          key={item.path}
          onClick={() => navigate(item.path)}
          className={`px-2 py-1 rounded-md ${
            location.pathname === item.path ? "font-bold underline" : ""
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default BottomNavBar;
