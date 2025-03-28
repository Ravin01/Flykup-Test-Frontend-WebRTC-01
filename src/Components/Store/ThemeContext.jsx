// themes.js

import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { UPDATE_SINGLE_USER } from "../../api/ApiDetails";

export const lightTheme = {
  body: "bg-white",
  text: "text-slate-900",
  link: "text-blue-500",
};

export const darkTheme = {
  body: "bg-slate-900",
  text: "text-white",
  link: "text-green-500",
};

export const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  let localStorageData = JSON.parse(localStorage.getItem("user"));
  const [theme, setTheme] = useState(
    localStorageData?.configuration?.theme || "light"
  );

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  // const updateSingleUserData = async () => {
  //   if (localStorageData) {
  //     try {
  //       const response = await axios.put(
  //         `${UPDATE_SINGLE_USER}/${localStorageData._id}`,
  //         {
  //           configuration: {
  //             theme: theme,
  //           },
  //         }
  //       );
  //       if (response.data.status) {
  //         localStorage.setItem("user", JSON.stringify(response.data.data));
  //         setTheme(response.data.data.configuration.theme);
  //       } else {
  //         console.log(response.data.data);
  //       }
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   }
  // };
  // useEffect(() => {
  //   updateSingleUserData();
  // }, [theme]);

  const currentTheme = theme === "light" ? lightTheme : darkTheme;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      <div className={`h-screen ${currentTheme.body} ${currentTheme.text}`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};
