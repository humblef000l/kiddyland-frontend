"use client"
import React, { useEffect, useState } from 'react'

const ThemeSwitcher = () => {
    const [theme, setTheme] = useState<string>("dracula");

    useEffect(() => {
      const storedTheme = localStorage.getItem("theme") || "dracula";
      document.documentElement.setAttribute("data-theme", storedTheme);
      setTheme(storedTheme);
    }, []);
  
    const toggleTheme = () => {
      const newTheme = theme === "kiddyland" ? "gbe" : "kiddyland";
      document.documentElement.setAttribute("data-theme", newTheme);
      localStorage.setItem("theme", newTheme);
      setTheme(newTheme);
    };
  
    return <button className={"bg-primary p-xs text-base rounded-sm"} onClick={toggleTheme}>{theme === "dracula" ? "Switch to Vintage" : "Switch to Dracula"}</button>;
}

export default ThemeSwitcher