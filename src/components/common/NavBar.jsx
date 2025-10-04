// src/components/Layout/NavBar.jsx
import React from 'react';
import { IoHome } from "react-icons/io5";
import { HiTv } from "react-icons/hi2";
import { IoGameController } from "react-icons/io5";

const NavBar = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'home', label: 'Home', Icon: IoHome },
    { id: 'channels', label: 'TV', Icon: HiTv },
    { id: 'games', label: 'Games', Icon: IoGameController }
  ];

  return (
    <>
      {/* Top navigation for larger screens */}
      <nav className="nav-bar nav-bar-top hidden md:flex">
        {navItems.map(item => (
          <button
            key={item.id}
            className={`nav-button ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            <item.Icon size={24} className="w-6 h-6" />
            {item.label}
          </button>
        ))}
      </nav>

      {/* Bottom navigation for small screens */}
      <nav className="nav-bar nav-bar-bottom flex md:hidden">
        {navItems.map(item => (
          <button
            key={item.id}
            className={`nav-button ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            <item.Icon size={24} className="w-6 h-6" />
            {item.label}
          </button>
        ))}
      </nav>
    </>
  );
};

export default NavBar;