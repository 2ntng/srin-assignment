import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};

export const ThemeProvider = ({ children }) => {
    const [darkMode, setDarkMode] = useState(() => {
        // Check if user has a saved preference
        const saved = localStorage.getItem("theme");
        if (saved !== null) {
            const isDark = saved === "dark";
            return isDark;
        }
        // Otherwise, check system preference
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        return prefersDark;
    });
    useEffect(() => {
        // Save preference to localStorage
        localStorage.setItem("theme", darkMode ? "dark" : "light");

        // Apply theme to document
        if (darkMode) {
            document.documentElement.classList.add("dark");
            document.documentElement.style.colorScheme = "dark";
        } else {
            document.documentElement.classList.remove("dark");
            document.documentElement.style.colorScheme = "light";
        }
    }, [darkMode]);
    const toggleDarkMode = () => {
        setDarkMode((prev) => {
            return !prev;
        });
    };

    const value = {
        darkMode,
        toggleDarkMode,
    };

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
