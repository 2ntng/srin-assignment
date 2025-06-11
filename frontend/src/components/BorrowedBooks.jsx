import React, { useState, useEffect } from "react";
import { useLibrary } from "../context/LibraryContext";
import {
    Plus,
    Edit,
    Trash2,
    Search,
    Calendar,
    User,
    BookOpen,
    RotateCcw,
    CheckCircle,
    BookMarked,
    X,
} from "lucide-react";
import Modal from "./Modal";
import ConfirmDialog from "./ConfirmDialog";

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
    const [returnConfirm, setReturnConfirm] = useState({
        isOpen: false,
        borrowId: null,
        bookTitle: "",
    });
    const [deleteConfirm, setDeleteConfirm] = useState({
        isOpen: false,
        borrowId: null,
        bookTitle: "",
    });
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
        const borrowedBook = borrowedBooks.find((b) => b.id === id);
        setReturnConfirm({
            isOpen: true,
            borrowId: id,
            bookTitle: borrowedBook?.book?.title || "this book",
        });
    };

    const confirmReturn = async () => {
        try {
            await returnBook(returnConfirm.borrowId);
            setReturnConfirm({ isOpen: false, borrowId: null, bookTitle: "" });
        } catch (err) {
            console.error("Error returning book:", err);
        }
    };

    const cancelReturn = () => {
        setReturnConfirm({ isOpen: false, borrowId: null, bookTitle: "" });
    };

    const handleDelete = async (id) => {
        const borrowedBook = borrowedBooks.find((b) => b.id === id);
        setDeleteConfirm({
            isOpen: true,
            borrowId: id,
            bookTitle: borrowedBook?.book?.title || "this record",
        });
    };

    const confirmDelete = async () => {
        try {
            await deleteBorrowedBook(deleteConfirm.borrowId);
            setDeleteConfirm({ isOpen: false, borrowId: null, bookTitle: "" });
        } catch (err) {
            console.error("Error deleting borrowed book record:", err);
        }
    };

    const cancelDelete = () => {
        setDeleteConfirm({ isOpen: false, borrowId: null, bookTitle: "" });
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
        <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white">
                    Borrowed Books Management
                </h1>{" "}
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center justify-center space-x-2 bg-orange-600 hover:bg-orange-700 dark:bg-orange-700 dark:hover:bg-orange-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition-all duration-200 w-full sm:w-auto text-sm sm:text-base shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                    <Plus className="h-4 w-4" />
                    <span>New Borrowing</span>
                </button>
            </div>
            {/* Search Bar */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-3 sm:p-4 lg:p-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4 sm:h-5 sm:w-5" />{" "}
                    <input
                        type="text"
                        placeholder="Search by book title, member name, or borrow date..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 sm:pl-12 pr-4 py-2.5 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm sm:text-base transition-all duration-200"
                    />
                    {isSearching && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-600 dark:border-orange-400"></div>
                        </div>
                    )}
                </div>
            </div>{" "}
            {/* Tabs */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="border-b border-gray-200 dark:border-gray-700">
                    <nav className="flex space-x-4 sm:space-x-8 px-4 sm:px-6">
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
                                className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors cursor-pointer ${
                                    activeTab === tab.id
                                        ? "border-orange-500 text-orange-600 dark:text-orange-400"
                                        : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                                }`}
                            >
                                {tab.label} ({tab.count})
                            </button>
                        ))}
                    </nav>
                </div>
            </div>
            {/* Borrowed Books List */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                {filteredBorrowedBooks.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-900">
                                <tr>
                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Book
                                    </th>
                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Member
                                    </th>
                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Borrow Date
                                    </th>
                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Due Date
                                    </th>
                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Return Date
                                    </th>
                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {filteredBorrowedBooks.map((borrowedBook) => (
                                    <tr
                                        key={borrowedBook.id}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 dark:text-gray-500 mr-3" />
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {/* ... */}
                                                        {borrowedBook.book?.title || "Unknown Book"}
                                                    </div>{" "}
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                        by{" "}
                                                        {borrowedBook.book?.author?.name ||
                                                            "Unknown Author"}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>{" "}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <User className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-3" />
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {borrowedBook.member?.name ||
                                                            "Unknown Member"}
                                                    </div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                        {borrowedBook.member?.email || ""}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>{" "}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                            <div className="flex items-center">
                                                <Calendar className="h-4 w-4 text-gray-400 dark:text-gray-500 mr-2" />
                                                {borrowedBook.borrowDate
                                                    ? new Date(
                                                          borrowedBook.borrowDate
                                                      ).toLocaleDateString()
                                                    : "N/A"}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                            <div className="flex items-center">
                                                <Calendar className="h-4 w-4 text-gray-400 dark:text-gray-500 mr-2" />
                                                {borrowedBook.dueDate
                                                    ? new Date(
                                                          borrowedBook.dueDate
                                                      ).toLocaleDateString()
                                                    : "N/A"}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                            {borrowedBook.returnDate ? (
                                                <div className="flex items-center">
                                                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                                    {new Date(
                                                        borrowedBook.returnDate
                                                    ).toLocaleDateString()}
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 dark:text-gray-500">
                                                    Not returned
                                                </span>
                                            )}
                                        </td>{" "}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {borrowedBook.returnDate ? (
                                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                                                    Returned
                                                </span>
                                            ) : isOverdue(borrowedBook.dueDate) ? (
                                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300">
                                                    Overdue ({getDaysOverdue(borrowedBook.dueDate)}{" "}
                                                    days)
                                                </span>
                                            ) : (
                                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
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
                                                        className="text-green-600 hover:text-green-800 dark:hover:text-green-400 cursor-pointer"
                                                        title="Mark as returned"
                                                    >
                                                        <RotateCcw className="h-4 w-4" />
                                                    </button>
                                                )}{" "}
                                                <button
                                                    onClick={() => handleDelete(borrowedBook.id)}
                                                    className="text-red-600 hover:text-red-800 dark:hover:text-red-400 cursor-pointer"
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
                        <BookMarked className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                            No borrowed books found
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {searchTerm
                                ? "Try a different search term"
                                : "Get started by borrowing a book"}
                        </p>
                    </div>
                )}
            </div>{" "}
            {/* Modal */}
            <Modal isOpen={showModal} onClose={resetForm} title="New Book Borrowing" size="md">
                <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Book *
                        </label>
                        <select
                            required
                            value={formData.bookId}
                            onChange={(e) => setFormData({ ...formData, bookId: e.target.value })}
                            className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base transition-all duration-200"
                        >
                            <option value="">Select a book</option>
                            {books
                                .filter((book) => (book.availableCopies || 0) > 0)
                                .map((book) => (
                                    <option key={book.id} value={book.id}>
                                        {book.title} - {book.author?.name} ({book.availableCopies}{" "}
                                        available)
                                    </option>
                                ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Member *
                        </label>
                        <select
                            required
                            value={formData.memberId}
                            onChange={(e) => setFormData({ ...formData, memberId: e.target.value })}
                            className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base transition-all duration-200"
                        >
                            <option value="">Select a member</option>
                            {members.map((member) => (
                                <option key={member.id} value={member.id}>
                                    {member.name} - {member.email}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Borrow Date *
                            </label>
                            <input
                                type="date"
                                required
                                value={formData.borrowDate}
                                onChange={(e) =>
                                    setFormData({ ...formData, borrowDate: e.target.value })
                                }
                                className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base transition-all duration-200"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Due Date *
                            </label>
                            <input
                                type="date"
                                required
                                value={formData.dueDate}
                                onChange={(e) =>
                                    setFormData({ ...formData, dueDate: e.target.value })
                                }
                                className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base transition-all duration-200"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                        {" "}
                        <button
                            type="button"
                            onClick={resetForm}
                            className="w-full sm:flex-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 py-2.5 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-all duration-200 text-sm sm:text-base font-medium cursor-pointer"
                        >
                            Cancel
                        </button>{" "}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full sm:flex-1 bg-orange-600 hover:bg-orange-700 dark:bg-orange-700 dark:hover:bg-orange-600 text-white py-2.5 px-4 rounded-lg transition-all duration-200 text-sm sm:text-base font-medium disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed cursor-pointer"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center space-x-2">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    <span>Processing...</span>
                                </div>
                            ) : (
                                "Borrow Book"
                            )}
                        </button>
                    </div>
                </form>
            </Modal>
            {/* Return Confirmation Dialog */}
            <ConfirmDialog
                isOpen={returnConfirm.isOpen}
                onClose={cancelReturn}
                onConfirm={confirmReturn}
                title="Return Book"
                message={`Are you sure you want to mark "${returnConfirm.bookTitle}" as returned?`}
                confirmText="Return"
                cancelText="Cancel"
                type="info"
            />
            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                isOpen={deleteConfirm.isOpen}
                onClose={cancelDelete}
                onConfirm={confirmDelete}
                title="Delete Borrowed Book Record"
                message={`Are you sure you want to delete the borrowed book record for "${deleteConfirm.bookTitle}"? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                type="danger"
            />
        </div>
    );
};

export default BorrowedBooks;
