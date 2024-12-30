import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { NavLink, Link } from "react-router-dom";
import { Icon } from "@iconify/react/dist/iconify.js";
import Checkbox from "../components/checkbox";
import { logout } from "../slices/authslice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const Menu = () => {
  const [user, setUser] = useState();
  const userId = useSelector((state) => state.auth.userId);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Fetch the dark mode preference from localStorage on initial render
  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode") === "true";
    setIsDarkMode(savedMode);
  }, []);

  // Save dark mode preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("darkMode", isDarkMode);
  }, [isDarkMode]);

  const menu = [
    { id: 1, title: "Edit Profile", icon: <Icon  className="w-6 h-7" icon="material-symbols:person-edit-outline" />, path: "/editprofile" },
    { id: 2, title: "Settings", icon: <Icon className="w-6 h-7" icon="carbon:settings" />, path: "/settings" },
    { id: 3, title: "Privacy & data", icon: <Icon className="w-6 h-7" icon="carbon:security" />, path: "/Privacydata" },
    { id: 4, title: "Security", icon: <Icon  className="w-6 h-7" icon="material-symbols:lock-outline" />, path: "/security" },
  ];

  const terms = [
    { id: 1, title: "Help", icon: <Icon className="w-6 h-7" icon="material-symbols:help-outline"  />, path: "/help" },
    { id: 2, title: "About", icon: <Icon className="w-6 h-7" icon="ph:address-book"  /> },
    { id: 3, title: "Invite Friends", icon: <Icon className="w-6 h-7" icon="ph:share-fat" /> },
  ];

  const fetchUserName = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found in localStorage");
        return;
      }

      const response = await fetch(`http://localhost:8080/api/users/${userId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else {
        console.error("Failed to fetch user data:", response.status);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  useEffect(() => {
    fetchUserName();
  }, [userId]);

  return (
    <div className={`max-w-[30rem] w-full flex h-screen flex-col gap-2 ${isDarkMode ? "dark-bg" : "white-bg"} p-4`}>
      <NavLink to={`/user/${userId}`}>
        <div className={`flex items-center p-4 ${isDarkMode ? "gray-bg" : "white-bg"} rounded-md gap-4`}>
          <img src={`http://localhost:8080${user?.profileImagePath}`} alt="" className="cursor-pointer rounded-full h-11 w-11 bg-gray-300" />
          <p className="w-28 truncate font-semibold">{user?.name}</p>
        </div>
      </NavLink>

      {menu.map((setting) => (
        <Link key={setting.id} to={setting.path}>
          <div className={`${isDarkMode ? "gray-bg" : "white-bg"} block w-full flex items-center px-4 py-3 gap-4 font-semibold`}>{setting.icon} {setting.title}</div>
        </Link>
      ))}

      <div className={`${isDarkMode ? "gray-bg" : "white-bg"} block w-full flex items-center px-4 py-3 justify-between font-semibold`}>
        <div className="flex items-center gap-4">
          <Icon icon="material-symbols-light:dark-mode" className="w-7 h-7" />
          <span>Dark Mode</span>
        </div>
        <Checkbox isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
      </div>

      {terms.map((setting) => (
        <Link key={setting.id} to={setting.path}>
          <div className={`${isDarkMode ? "gray-bg" : "white-bg"} block w-full flex items-center px-4 py-3 gap-4 font-semibold`}>{setting.icon} {setting.title}</div>
        </Link>
      ))}

      <div className={`${isDarkMode ? "gray-bg" : "white-bg"} cursor-pointer block w-full flex items-center px-4 py-3 gap-4 font-semibold`}>
        <Icon className="w-6 h-7" icon="fe:logout" />
        <span onClick={handleLogout}>Logout</span>
      </div>
    </div>
  );
};

export default Menu;
