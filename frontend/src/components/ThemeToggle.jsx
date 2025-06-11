import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const ThemeToggle = ({ className = "", showLabel = false }) => {
    const { darkMode, toggleDarkMode } = useTheme();

    const handleToggle = () => {
        toggleDarkMode();
    };

    return (
        <button
            onClick={handleToggle}
            className={`relative p-2 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer ${
                darkMode
                    ? "bg-gray-700 hover:bg-gray-600 text-yellow-400"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-600"
            } ${className}`}
            aria-label={`Switch to ${darkMode ? "light" : "dark"} mode`}
            title={`Switch to ${darkMode ? "light" : "dark"} mode`}
        >
            <div className="relative w-5 h-5 flex items-center justify-center">
                <Sun
                    className={`absolute h-5 w-5 transition-all duration-300 ${
                        darkMode ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
                    }`}
                />
                <Moon
                    className={`absolute h-5 w-5 transition-all duration-300 ${
                        darkMode ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
                    }`}
                />
            </div>
            {showLabel && (
                <span className="ml-2 text-sm font-medium">{darkMode ? "Light" : "Dark"} mode</span>
            )}
        </button>
    );
};

export default ThemeToggle;
