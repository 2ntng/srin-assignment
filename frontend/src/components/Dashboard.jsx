import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useLibrary } from "../context/LibraryContext";
import { BookOpen, Users, UserCheck, BookMarked, AlertCircle } from "lucide-react";

const Dashboard = () => {
    const {
        books,
        authors,
        members,
        borrowedBooks,
        fetchBooks,
        fetchAuthors,
        fetchMembers,
        fetchBorrowedBooks,
        loading,
        error,
    } = useLibrary();

    useEffect(() => {
        fetchBooks();
        fetchAuthors();
        fetchMembers();
        fetchBorrowedBooks();
    }, []);

    const stats = [
        {
            title: "Total Books",
            value: books.length,
            icon: BookOpen,
            color: "bg-blue-500",
            textColor: "text-blue-600",
        },
        {
            title: "Total Authors",
            value: authors.length,
            icon: Users,
            color: "bg-green-500",
            textColor: "text-green-600",
        },
        {
            title: "Total Members",
            value: members.length,
            icon: UserCheck,
            color: "bg-purple-500",
            textColor: "text-purple-600",
        },
        {
            title: "Borrowed Books",
            value: borrowedBooks.filter((book) => !book.returnDate).length,
            icon: BookMarked,
            color: "bg-orange-500",
            textColor: "text-orange-600",
        },
    ];

    const recentBorrowedBooks = borrowedBooks.filter((book) => !book.returnDate).slice(0, 5);
    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-16 w-16 sm:h-32 sm:w-32 border-b-2 border-blue-600 dark:border-blue-400"></div>
            </div>
        );
    }
    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 transition-colors">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-2">
                    Dashboard
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                    Welcome to the Library Management System
                </p>
            </div>
            {/* Error Alert */}
            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center space-x-2">
                    <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                    <span className="text-red-800 dark:text-red-200">{error}</span>
                </div>
            )}
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 transition-colors hover:shadow-lg dark:hover:shadow-xl"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                    {stat.title}
                                </p>
                                <p className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
                                    {stat.value}
                                </p>
                            </div>
                            <div className={`p-3 rounded-full ${stat.color} dark:opacity-90`}>
                                <stat.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>{" "}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Recent Borrowed Books */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
                    <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white">
                            Recently Borrowed Books
                        </h2>
                    </div>
                    <div className="p-4 sm:p-6">
                        {recentBorrowedBooks.length > 0 ? (
                            <div className="space-y-3 sm:space-y-4">
                                {recentBorrowedBooks.map((borrowedBook, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors"
                                    >
                                        <div>
                                            <h3 className="font-medium text-gray-800 dark:text-white text-sm sm:text-base">
                                                {borrowedBook.book?.title || "Unknown Book"}
                                            </h3>
                                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                                                Borrowed by:{" "}
                                                {borrowedBook.member?.name || "Unknown Member"}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {borrowedBook.borrowDate
                                                    ? new Date(
                                                          borrowedBook.borrowDate
                                                      ).toLocaleDateString()
                                                    : "Unknown Date"}
                                            </p>
                                        </div>
                                        <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 text-xs rounded-full flex-shrink-0">
                                            Active
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                                No books currently borrowed
                            </p>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
                    <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white">
                            Quick Actions
                        </h2>
                    </div>
                    <div className="p-4 sm:p-6">
                        <div className="space-y-3">
                            {" "}
                            <Link
                                to="/books"
                                className="block w-full text-left px-4 py-3 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-lg transition-colors cursor-pointer"
                            >
                                <div className="flex items-center space-x-3">
                                    <BookOpen className="h-4 w-4 sm:h-5 sm:w-5" />
                                    <span className="font-medium text-sm sm:text-base">
                                        Manage Books
                                    </span>
                                </div>
                            </Link>{" "}
                            <Link
                                to="/authors"
                                className="block w-full text-left px-4 py-3 bg-green-50 dark:bg-green-900/30 hover:bg-green-100 dark:hover:bg-green-900/50 text-green-700 dark:text-green-300 rounded-lg transition-colors cursor-pointer"
                            >
                                <div className="flex items-center space-x-3">
                                    <Users className="h-4 w-4 sm:h-5 sm:w-5" />
                                    <span className="font-medium text-sm sm:text-base">
                                        Manage Authors
                                    </span>
                                </div>
                            </Link>{" "}
                            <Link
                                to="/members"
                                className="block w-full text-left px-4 py-3 bg-purple-50 dark:bg-purple-900/30 hover:bg-purple-100 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-lg transition-colors cursor-pointer"
                            >
                                <div className="flex items-center space-x-3">
                                    <UserCheck className="h-4 w-4 sm:h-5 sm:w-5" />
                                    <span className="font-medium text-sm sm:text-base">
                                        Manage Members
                                    </span>
                                </div>
                            </Link>{" "}
                            <Link
                                to="/borrowed-books"
                                className="block w-full text-left px-4 py-3 bg-orange-50 dark:bg-orange-900/30 hover:bg-orange-100 dark:hover:bg-orange-900/50 text-orange-700 dark:text-orange-300 rounded-lg transition-colors cursor-pointer"
                            >
                                <div className="flex items-center space-x-3">
                                    <BookMarked className="h-4 w-4 sm:h-5 sm:w-5" />
                                    <span className="font-medium text-sm sm:text-base">
                                        Manage Borrowed Books
                                    </span>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
