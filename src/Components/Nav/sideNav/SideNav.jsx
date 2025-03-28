import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../../Styles/SideNav.css";
import { adminNavItems } from "../routes/AdminNav";
import { managerNavItems } from "../routes/ManagerNav";
import { userNavItems } from "../routes/UserNav";
import { unAuthenticateNav } from "../routes/UnAuthenticateNav";
import { useTheme } from "../../Store/ThemeContext";
import RouletteRise from "../../../assets/logo/RouletteRise.png"

const SideNav = ({ toggleSideNav }) => {
  const [activeItem, setActiveItem] = useState("dashboard");
  const [navItems, setNavItems] = useState([]);
  const localStorageUserData = JSON.parse(localStorage.getItem("user"));
  const { theme } = useTheme();

  useEffect(() => {
    if (!localStorageUserData) setNavItems(unAuthenticateNav);
    else if (localStorageUserData.role === "admin") setNavItems(adminNavItems);
    else if (localStorageUserData.role === "manager") setNavItems(managerNavItems);
    else if (localStorageUserData.role === "user") setNavItems(userNavItems);
  }, [localStorageUserData]);

  const handleLogOut = () => {
    localStorage.removeItem("user");
  };

  return (
    <div className={`pb-4 pt-2 flex flex-col justify-between h-full shadow-lg shadow-slate-400`}>
      <div className="w-full my-4 mx-5 rounded-md flex items-center justify-start">
        <img src={RouletteRise} alt="logo" className="w-16 h-16 cursor-pointer" />
      </div>
      <div className="flex flex-col px-3 py-0 min-h-[70vh]">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`sideNav-list-item${activeItem === item.name.toLowerCase() ? "-selected" : ""} flex items-center w-full text-md group`}
            onClick={() => {
              setActiveItem(item.name.toLowerCase());
              toggleSideNav();
            }}
          >
            <i className={`fa-solid ${item.icon}`}></i>
            <p className="mx-4">{item.name}</p>
          </Link>
        ))}
        
      </div>
      <div className="px-3 mb-2">
        <Link
          to="/auth/login"
          className="sideNav-list-item flex items-center text-md group"
          onClick={handleLogOut}
        >
          <i className="fa-solid fa-right-from-bracket"></i>
          <p className="mx-4">Logout</p>
        </Link>
      </div>
    </div>
  );
};

export default SideNav;
