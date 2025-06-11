import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BookOpen, Users, UserCheck, BookMarked, BarChart3, Menu, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const isActive = (path) => {
        return location.pathname === path;
    };

    const navItems = [
        { path: "/", label: "Dashboard", icon: BarChart3 },
        { path: "/books", label: "Books", icon: BookOpen },
        { path: "/authors", label: "Authors", icon: Users },
        { path: "/members", label: "Members", icon: UserCheck },
        { path: "/borrowed-books", label: "Borrowed Books", icon: BookMarked },
    ];

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    };

    return (
        <nav className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700 transition-colors">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center space-x-2">
                        <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 dark:text-blue-400" />
                        <h1 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white">
                            <span className="hidden sm:inline">Library Management</span>
                            <span className="sm:hidden">Library</span>
                        </h1>
                    </div>
                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center space-x-6">
                        {navItems.map(({ path, label, icon: Icon }) => (
                            <Link
                                key={path}
                                to={path}
                                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                    isActive(path)
                                        ? "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300"
                                        : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                                }`}
                            >
                                <Icon className="h-4 w-4" />
                                <span>{label}</span>
                            </Link>
                        ))}
                    </div>{" "}
                    {/* Right side controls */}
                    <div className="flex items-center space-x-2">
                        {/* Theme Toggle */}
                        <ThemeToggle />
                        {/* Mobile menu button */}{" "}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                            aria-label="Toggle mobile menu"
                        >
                            {mobileMenuOpen ? (
                                <X className="h-5 w-5" />
                            ) : (
                                <Menu className="h-5 w-5" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                <div
                    className={`lg:hidden border-t border-gray-200 dark:border-gray-700 transition-all duration-300 ${
                        mobileMenuOpen
                            ? "max-h-96 opacity-100"
                            : "max-h-0 opacity-0 overflow-hidden"
                    }`}
                >
                    <div className="py-2 space-y-1">
                        {navItems.map(({ path, label, icon: Icon }) => (
                            <Link
                                key={path}
                                to={path}
                                onClick={closeMobileMenu}
                                className={`flex items-center space-x-3 px-4 py-3 text-sm font-medium transition-colors ${
                                    isActive(path)
                                        ? "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border-r-2 border-blue-600"
                                        : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                                }`}
                            >
                                <Icon className="h-5 w-5" />
                                <span>{label}</span>
                            </Link>
                        ))}
                    </div>{" "}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
