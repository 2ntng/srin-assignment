import React, { useState, useEffect } from "react";
import { useLibrary } from "../context/LibraryContext";
import {
    Plus,
    Edit,
    Trash2,
    Search,
    X,
    Calendar,
    User,
    BookOpen,
    RotateCcw,
    CheckCircle,
    BookMarked,
} from "lucide-react";

const BorrowedBooks = () => {
    const {
        borrowedBooks,
        books,
        members,
        fetchBorrowedBooks,
        fetchBooks,
        fetchMembers,
        addBorrowedBook,
        returnBook,
        deleteBorrowedBook,
        searchBorrowedBooks,
        loading,
        error,
    } = useLibrary();

    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [activeTab, setActiveTab] = useState("all"); // all, active, returned
    const [formData, setFormData] = useState({
        bookId: "",
        memberId: "",
        borrowDate: "",
        dueDate: "",
    });

    useEffect(() => {
        fetchBorrowedBooks();
        fetchBooks();
        fetchMembers();
    }, []);

    useEffect(() => {
        if (searchTerm.trim()) {
            handleSearch();
        } else {
            setSearchResults([]);
            setIsSearching(false);
        }
    }, [searchTerm]);

    const handleSearch = async () => {
        if (!searchTerm.trim()) return;

        setIsSearching(true);
        try {
            const results = await searchBorrowedBooks(searchTerm);
            setSearchResults(results);
        } catch (err) {
            console.error("Search error:", err);
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    const getFilteredBorrowedBooks = () => {
        const dataToFilter = searchTerm.trim() ? searchResults : borrowedBooks;

        switch (activeTab) {
            case "active":
                return dataToFilter.filter((book) => !book.returnDate);
            case "returned":
                return dataToFilter.filter((book) => book.returnDate);
            default:
                return dataToFilter;
        }
    };

    const resetForm = () => {
        setFormData({
            bookId: "",
            memberId: "",
            borrowDate: "",
            dueDate: "",
        });
        setShowModal(false);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const borrowData = {
                book: { id: formData.bookId },
                member: { id: formData.memberId },
                borrowDate: formData.borrowDate,
                dueDate: formData.dueDate,
            };

            await addBorrowedBook(borrowData);
            resetForm();
        } catch (err) {
            console.error("Error borrowing book:", err);
        }
    };

    const handleReturn = async (id) => {
        if (window.confirm("Mark this book as returned?")) {
            try {
                await returnBook(id);
            } catch (err) {
                console.error("Error returning book:", err);
            }
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this borrowed book record?")) {
            try {
                await deleteBorrowedBook(id);
            } catch (err) {
                console.error("Error deleting borrowed book record:", err);
            }
        }
    };

    const isOverdue = (dueDate, returnDate) => {
        if (returnDate) return false; // Already returned
        const today = new Date();
        const due = new Date(dueDate);
        return today > due;
    };

    const getDaysOverdue = (dueDate) => {
        const today = new Date();
        const due = new Date(dueDate);
        const diffTime = today - due;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const filteredBorrowedBooks = getFilteredBorrowedBooks();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-3xl font-bold text-gray-800">Borrowed Books Management</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center space-x-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                >
                    <Plus className="h-4 w-4" />
                    <span>New Borrowing</span>
                </button>
            </div>

            {/* Search Bar */}
            <div className="bg-white rounded-lg shadow p-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                        type="text"
                        placeholder="Search by book title, member name, or borrow date..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    {isSearching && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-600"></div>
                        </div>
                    )}
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow">
                <div className="border-b border-gray-200">
                    <nav className="flex space-x-8 px-6">
                        {[
                            { id: "all", label: "All Records", count: borrowedBooks.length },
                            {
                                id: "active",
                                label: "Active Borrowings",
                                count: borrowedBooks.filter((b) => !b.returnDate).length,
                            },
                            {
                                id: "returned",
                                label: "Returned Books",
                                count: borrowedBooks.filter((b) => b.returnDate).length,
                            },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === tab.id
                                        ? "border-orange-500 text-orange-600"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                }`}
                            >
                                {tab.label} ({tab.count})
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Borrowed Books List */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                {filteredBorrowedBooks.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Book
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Member
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Borrow Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Due Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Return Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredBorrowedBooks.map((borrowedBook) => (
                                    <tr key={borrowedBook.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <BookOpen className="h-5 w-5 text-gray-400 mr-3" />
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {borrowedBook.book?.title || "Unknown Book"}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        by{" "}
                                                        {borrowedBook.book?.author?.name ||
                                                            "Unknown Author"}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <User className="h-5 w-5 text-gray-400 mr-3" />
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {borrowedBook.member?.name ||
                                                            "Unknown Member"}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {borrowedBook.member?.email || ""}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <div className="flex items-center">
                                                <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                                                {borrowedBook.borrowDate
                                                    ? new Date(
                                                          borrowedBook.borrowDate
                                                      ).toLocaleDateString()
                                                    : "N/A"}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <div className="flex items-center">
                                                <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                                                {borrowedBook.dueDate
                                                    ? new Date(
                                                          borrowedBook.dueDate
                                                      ).toLocaleDateString()
                                                    : "N/A"}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {borrowedBook.returnDate ? (
                                                <div className="flex items-center">
                                                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                                    {new Date(
                                                        borrowedBook.returnDate
                                                    ).toLocaleDateString()}
                                                </div>
                                            ) : (
                                                <span className="text-gray-400">Not returned</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {borrowedBook.returnDate ? (
                                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                                    Returned
                                                </span>
                                            ) : isOverdue(borrowedBook.dueDate) ? (
                                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                                                    Overdue ({getDaysOverdue(borrowedBook.dueDate)}{" "}
                                                    days)
                                                </span>
                                            ) : (
                                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                                    Active
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end space-x-2">
                                                {!borrowedBook.returnDate && (
                                                    <button
                                                        onClick={() =>
                                                            handleReturn(borrowedBook.id)
                                                        }
                                                        className="text-green-600 hover:text-green-800"
                                                        title="Mark as returned"
                                                    >
                                                        <RotateCcw className="h-4 w-4" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(borrowedBook.id)}
                                                    className="text-red-600 hover:text-red-800"
                                                    title="Delete record"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <BookMarked className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">
                            No borrowed books found
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                            {searchTerm
                                ? "Try a different search term"
                                : "Get started by borrowing a book"}
                        </p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center p-6 border-b">
                            <h2 className="text-xl font-semibold">New Book Borrowing</h2>
                            <button
                                onClick={resetForm}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Book *
                                </label>
                                <select
                                    required
                                    value={formData.bookId}
                                    onChange={(e) =>
                                        setFormData({ ...formData, bookId: e.target.value })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                                >
                                    <option value="">Select a book</option>
                                    {books
                                        .filter((book) => (book.availableCopies || 0) > 0)
                                        .map((book) => (
                                            <option key={book.id} value={book.id}>
                                                {book.title} - {book.author?.name} (
                                                {book.availableCopies} available)
                                            </option>
                                        ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Member *
                                </label>
                                <select
                                    required
                                    value={formData.memberId}
                                    onChange={(e) =>
                                        setFormData({ ...formData, memberId: e.target.value })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                                >
                                    <option value="">Select a member</option>
                                    {members.map((member) => (
                                        <option key={member.id} value={member.id}>
                                            {member.name} - {member.email}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Borrow Date *
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.borrowDate}
                                        onChange={(e) =>
                                            setFormData({ ...formData, borrowDate: e.target.value })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Due Date *
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.dueDate}
                                        onChange={(e) =>
                                            setFormData({ ...formData, dueDate: e.target.value })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                                    />
                                </div>
                            </div>

                            <div className="flex space-x-3 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors"
                                >
                                    Borrow Book
                                </button>
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BorrowedBooks;
