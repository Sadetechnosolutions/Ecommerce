import React from "react";

const Checkbox = ({ isDarkMode, setIsDarkMode }) => {
  // Toggle dark mode when the checkbox is clicked
  const handleClick = () => {
    setIsDarkMode((prevState) => !prevState); // Toggle dark mode
  };

  return (
    <div
      className={`w-11 h-6 rounded-full relative cursor-pointer ${isDarkMode ? "bg-cta" : "bg-[#8A92A6]"}`}
      onClick={handleClick}
    >
      <div
        className={`absolute w-4 h-4 border rounded-full bg-white ${isDarkMode ? "right-1 top-1" : "left-1 top-1"}`}
      ></div>
    </div>
  );
};

export default Checkbox;
