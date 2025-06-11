import React, { useState, useEffect } from "react";
import { useLibrary } from "../context/LibraryContext";
import { Plus, Edit, Trash2, Search, BookOpen } from "lucide-react";
import Modal from "./Modal";
import ConfirmDialog from "./ConfirmDialog";

const Books = () => {
    const {
        books,
        authors,
        fetchBooks,
        fetchAuthors,
        addBook,
        updateBook,
        deleteBook,
        loading,
        error,
    } = useLibrary();

    const [showModal, setShowModal] = useState(false);
    const [editingBook, setEditingBook] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [deleteConfirm, setDeleteConfirm] = useState({
        isOpen: false,
        bookId: null,
        bookTitle: "",
    });
    const [formData, setFormData] = useState({
        title: "",
        category: "",
        publishingYear: "",
        isbn: "",
        totalCopies: "",
        authorId: "",
    });

    useEffect(() => {
        fetchBooks();
        fetchAuthors();
    }, []);

    const filteredBooks = books.filter(
        (book) =>
            book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.author?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const resetForm = () => {
        setFormData({
            title: "",
            category: "",
            publishingYear: "",
            isbn: "",
            totalCopies: "",
            authorId: "",
        });
        setEditingBook(null);
        setShowModal(false);
    };

    const handleEdit = (book) => {
        setEditingBook(book);
        setFormData({
            title: book.title || "",
            category: book.category || "",
            publishingYear: book.publishingYear || "",
            isbn: book.isbn || "",
            totalCopies: book.totalCopies || "",
            authorId: book.author?.id || "",
        });
        setShowModal(true);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const bookData = {
                ...formData,
                publishingYear: parseInt(formData.publishingYear),
                totalCopies: parseInt(formData.totalCopies),
                author: { id: formData.authorId },
            };

            if (editingBook) {
                await updateBook(editingBook.id, bookData);
            } else {
                await addBook(bookData);
            }

            resetForm();
        } catch (err) {
            console.error("Error saving book:", err);
        }
    };
    const handleDelete = async (id) => {
        const book = books.find((b) => b.id === id);
        setDeleteConfirm({
            isOpen: true,
            bookId: id,
            bookTitle: book?.title || "this book",
        });
    };

    const confirmDelete = async () => {
        try {
            await deleteBook(deleteConfirm.bookId);
            setDeleteConfirm({ isOpen: false, bookId: null, bookTitle: "" });
        } catch (err) {
            console.error("Error deleting book:", err);
        }
    };

    const cancelDelete = () => {
        setDeleteConfirm({ isOpen: false, bookId: null, bookTitle: "" });
    };
    return (
        <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white">
                    Books Management
                </h1>{" "}
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition-all duration-200 w-full sm:w-auto text-sm sm:text-base shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                    <Plus className="h-4 w-4" />
                    <span>Add Book</span>
                </button>
            </div>
            {/* Search Bar */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-3 sm:p-4 lg:p-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4 sm:h-5 sm:w-5" />
                    <input
                        type="text"
                        placeholder="Search books by title, category, or author..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 sm:pl-12 pr-4 py-2.5 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm sm:text-base transition-all duration-200"
                    />
                </div>
            </div>
            {/* Loading State */}
            {loading && (
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            )}
            {/* Error State */}
            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
                </div>
            )}
            {/* Books Grid */}
            {!loading && !error && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                    {filteredBooks.map((book) => (
                        <div
                            key={book.id}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg dark:hover:shadow-xl transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-600 group"
                        >
                            <div className="p-3 sm:p-4 lg:p-6">
                                <div className="flex justify-between items-start mb-3 sm:mb-4">
                                    <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-800 dark:text-white line-clamp-2 flex-1 mr-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                        {book.title}
                                    </h3>
                                    <div className="flex space-x-1 flex-shrink-0 opacity-70 group-hover:opacity-100 transition-opacity">
                                        {" "}
                                        <button
                                            onClick={() => handleEdit(book)}
                                            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all cursor-pointer"
                                            aria-label="Edit book"
                                        >
                                            <Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                        </button>{" "}
                                        <button
                                            onClick={() => handleDelete(book.id)}
                                            className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-all cursor-pointer"
                                            aria-label="Delete book"
                                        >
                                            <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                                    <p>
                                        <span className="font-medium text-gray-800 dark:text-gray-200">
                                            Author:
                                        </span>{" "}
                                        {book.author?.name || "Unknown"}
                                    </p>
                                    <p>
                                        <span className="font-medium text-gray-800 dark:text-gray-200">
                                            Category:
                                        </span>{" "}
                                        {book.category}
                                    </p>
                                    <p>
                                        <span className="font-medium text-gray-800 dark:text-gray-200">
                                            Year:
                                        </span>{" "}
                                        {book.publishingYear}
                                    </p>
                                    <p>
                                        <span className="font-medium text-gray-800 dark:text-gray-200">
                                            ISBN:
                                        </span>{" "}
                                        {book.isbn || "N/A"}
                                    </p>
                                    <p>
                                        <span className="font-medium text-gray-800 dark:text-gray-200">
                                            Copies:
                                        </span>{" "}
                                        {book.availableCopies || 0}/{book.totalCopies || 0}
                                    </p>
                                </div>

                                <div className="mt-3 sm:mt-4">
                                    <span
                                        className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full transition-colors ${
                                            (book.availableCopies || 0) > 0
                                                ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                                                : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
                                        }`}
                                    >
                                        <div
                                            className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                                (book.availableCopies || 0) > 0
                                                    ? "bg-green-500"
                                                    : "bg-red-500"
                                            }`}
                                        ></div>
                                        {(book.availableCopies || 0) > 0
                                            ? "Available"
                                            : "Not Available"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {/* Empty State */}
            {!loading && !error && filteredBooks.length === 0 && (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                        <BookOpen className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-base sm:text-lg font-medium">
                        No books found
                    </p>
                    {searchTerm && (
                        <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
                            Try adjusting your search criteria or{" "}
                            <button
                                onClick={() => setSearchTerm("")}
                                className="text-blue-600 dark:text-blue-400 hover:underline"
                            >
                                clear the search
                            </button>
                        </p>
                    )}
                    {!searchTerm && (
                        <button
                            onClick={() => setShowModal(true)}
                            className="mt-4 inline-flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                        >
                            <Plus className="h-4 w-4" />
                            <span>Add your first book</span>
                        </button>
                    )}
                </div>
            )}{" "}
            {/* Modal */}
            <Modal
                isOpen={showModal}
                onClose={resetForm}
                title={editingBook ? "Edit Book" : "Add New Book"}
                size="md"
            >
                <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Title *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base transition-all duration-200"
                            placeholder="Enter book title"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Author *
                        </label>
                        <select
                            required
                            value={formData.authorId}
                            onChange={(e) => setFormData({ ...formData, authorId: e.target.value })}
                            className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base transition-all duration-200"
                        >
                            <option value="">Select an author</option>
                            {authors.map((author) => (
                                <option key={author.id} value={author.id}>
                                    {author.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Category *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base transition-all duration-200"
                            placeholder="Enter book category"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Publishing Year *
                            </label>
                            <input
                                type="number"
                                required
                                min="1000"
                                max={new Date().getFullYear() + 1}
                                value={formData.publishingYear}
                                onChange={(e) =>
                                    setFormData({ ...formData, publishingYear: e.target.value })
                                }
                                className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base transition-all duration-200"
                                placeholder="YYYY"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Total Copies *
                            </label>
                            <input
                                type="number"
                                required
                                min="1"
                                max="9999"
                                value={formData.totalCopies}
                                onChange={(e) =>
                                    setFormData({ ...formData, totalCopies: e.target.value })
                                }
                                className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base transition-all duration-200"
                                placeholder="Number of copies"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            ISBN
                        </label>
                        <input
                            type="text"
                            value={formData.isbn}
                            onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                            className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base transition-all duration-200"
                            placeholder="Enter ISBN (optional)"
                        />
                    </div>

                    <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <button
                            type="button"
                            onClick={resetForm}
                            className="w-full sm:flex-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 py-2.5 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-all duration-200 text-sm sm:text-base font-medium cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full sm:flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white py-2.5 px-4 rounded-lg transition-all duration-200 text-sm sm:text-base font-medium disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center space-x-2">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    <span>{editingBook ? "Updating..." : "Adding..."}</span>
                                </div>
                            ) : editingBook ? (
                                "Update Book"
                            ) : (
                                "Add Book"
                            )}
                        </button>
                    </div>
                </form>
            </Modal>
            {/* Confirmation Dialog */}
            <ConfirmDialog
                isOpen={deleteConfirm.isOpen}
                onClose={cancelDelete}
                onConfirm={confirmDelete}
                title="Delete Book"
                message={`Are you sure you want to delete "${deleteConfirm.bookTitle}"? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                type="danger"
            />
        </div>
    );
};

export default Books;
