"use client"
import React, { useEffect, useState } from 'react'
import Button from './Button';

const ThemeSwitcher = () => {
    const [theme, setTheme] = useState<string>("kiddyland");

    useEffect(() => {
      const storedTheme = localStorage.getItem("theme") || "kiddyland";
      document.documentElement.setAttribute("data-theme", storedTheme);
      setTheme(storedTheme);
    }, []);
  
    const toggleTheme = () => {
      const newTheme = theme === "kiddyland" ? "gbe" : "kiddyland";
      document.documentElement.setAttribute("data-theme", newTheme);
      localStorage.setItem("theme", newTheme);
      setTheme(newTheme);
    };
  
    return <Button variant='primary' onClick={toggleTheme}>{theme === "kiddyland" ? "Switch to GBE" : "Switch to Kiddyland"}</Button>;
}

export default ThemeSwitcher