import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import Books from "./components/Books";
import Authors from "./components/Authors";
import Members from "./components/Members";
import BorrowedBooks from "./components/BorrowedBooks";
import { LibraryProvider } from "./context/LibraryContext";
import { ThemeProvider } from "./context/ThemeContext";

function App() {
    return (
        <ThemeProvider>
            <LibraryProvider>
                <Router basename="/srin-assignment">
                    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors flex flex-col">
                        <Navbar />
                        <main className="container mx-auto px-4 py-6 sm:py-8 flex-grow">
                            <Routes>
                                <Route path="/" element={<Dashboard />} />
                                <Route path="/books" element={<Books />} />
                                <Route path="/authors" element={<Authors />} />
                                <Route path="/members" element={<Members />} />
                                <Route path="/borrowed-books" element={<BorrowedBooks />} />
                            </Routes>
                        </main>
                        <footer className="text-center text-gray-500 dark:text-gray-400 py-4 mt-auto">
                            <div className="text-gray-600 dark:text-gray-400 text-sm">
                                &copy; {new Date().getFullYear()}{" "}
                                <a
                                    href="https://2ntng.github.io/"
                                    className="hover:underline font-semibold"
                                >
                                    2ntng
                                </a>
                                . Created for <span className="font-medium">SRIN Assignment</span>.
                            </div>
                        </footer>
                    </div>
                </Router>
            </LibraryProvider>
        </ThemeProvider>
    );
}

export default App;
