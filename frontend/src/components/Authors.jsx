import React, { useState, useEffect } from "react";
import { useLibrary } from "../context/LibraryContext";
import { Plus, Edit, Trash2, Search, User } from "lucide-react";
import Modal from "./Modal";
import ConfirmDialog from "./ConfirmDialog";

const Authors = () => {
    const { authors, fetchAuthors, addAuthor, updateAuthor, deleteAuthor, loading, error } =
        useLibrary();
    const [showModal, setShowModal] = useState(false);
    const [editingAuthor, setEditingAuthor] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [deleteConfirm, setDeleteConfirm] = useState({
        isOpen: false,
        authorId: null,
        authorName: "",
    });
    const [formData, setFormData] = useState({
        name: "",
        biography: "",
        nationality: "",
    });

    useEffect(() => {
        fetchAuthors();
    }, []);

    const filteredAuthors = authors.filter(
        (author) =>
            author.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            author.nationality?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const resetForm = () => {
        setFormData({
            name: "",
            biography: "",
            nationality: "",
        });
        setEditingAuthor(null);
        setShowModal(false);
    };

    const handleEdit = (author) => {
        setEditingAuthor(author);
        setFormData({
            name: author.name || "",
            biography: author.biography || "",
            nationality: author.nationality || "",
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingAuthor) {
                await updateAuthor(editingAuthor.id, formData);
            } else {
                await addAuthor(formData);
            }
            resetForm();
        } catch (err) {
            console.error("Error saving author:", err);
        }
    };
    const handleDelete = async (id) => {
        const author = authors.find((a) => a.id === id);
        setDeleteConfirm({
            isOpen: true,
            authorId: id,
            authorName: author?.name || "this author",
        });
    };

    const confirmDelete = async () => {
        try {
            await deleteAuthor(deleteConfirm.authorId);
            setDeleteConfirm({ isOpen: false, authorId: null, authorName: "" });
        } catch (err) {
            console.error("Error deleting author:", err);
        }
    };

    const cancelDelete = () => {
        setDeleteConfirm({ isOpen: false, authorId: null, authorName: "" });
    };
    return (
        <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white">
                    Authors Management
                </h1>{" "}
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition-all duration-200 w-full sm:w-auto text-sm sm:text-base shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                    <Plus className="h-4 w-4" />
                    <span>Add Author</span>
                </button>
            </div>

            {/* Search Bar */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-3 sm:p-4 lg:p-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4 sm:h-5 sm:w-5" />
                    <input
                        type="text"
                        placeholder="Search authors by name or nationality..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 sm:pl-12 pr-4 py-2.5 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm sm:text-base transition-all duration-200"
                    />
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
                </div>
            )}

            {/* Authors Grid */}
            {!loading && !error && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                    {filteredAuthors.map((author) => (
                        <div
                            key={author.id}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg dark:hover:shadow-xl transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-600 group"
                        >
                            <div className="p-4 sm:p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                                        {author.name}
                                    </h3>
                                    <div className="flex space-x-1 opacity-70 group-hover:opacity-100 transition-opacity">
                                        {" "}
                                        <button
                                            onClick={() => handleEdit(author)}
                                            className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 p-1.5 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/30 transition-all cursor-pointer"
                                            aria-label="Edit author"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </button>{" "}
                                        <button
                                            onClick={() => handleDelete(author.id)}
                                            className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-all cursor-pointer"
                                            aria-label="Delete author"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                                    {author.nationality && (
                                        <p>
                                            <span className="font-medium text-gray-800 dark:text-gray-200">
                                                Nationality:
                                            </span>{" "}
                                            {author.nationality}
                                        </p>
                                    )}

                                    {author.biography && (
                                        <p className="line-clamp-3">
                                            <span className="font-medium text-gray-800 dark:text-gray-200">
                                                Biography:
                                            </span>{" "}
                                            {author.biography}
                                        </p>
                                    )}

                                    <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mt-3 pt-2 border-t border-gray-100 dark:border-gray-700">
                                        <User className="h-4 w-4" />
                                        <span>{author.books?.length || 0} book(s)</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Empty State */}
            {!loading && !error && filteredAuthors.length === 0 && (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                        <User className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-base sm:text-lg font-medium">
                        No authors found
                    </p>
                    {searchTerm && (
                        <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
                            Try adjusting your search criteria or{" "}
                            <button
                                onClick={() => setSearchTerm("")}
                                className="text-green-600 dark:text-green-400 hover:underline cursor-pointer"
                            >
                                clear the search
                            </button>
                        </p>
                    )}
                    {!searchTerm && (
                        <button
                            onClick={() => setShowModal(true)}
                            className="mt-4 inline-flex items-center space-x-2 text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 cursor-pointer"
                        >
                            <Plus className="h-4 w-4" />
                            <span>Add your first author</span>
                        </button>
                    )}
                </div>
            )}

            {/* Modal */}
            <Modal
                isOpen={showModal}
                onClose={resetForm}
                title={editingAuthor ? "Edit Author" : "Add New Author"}
                size="md"
            >
                <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Name *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base transition-all duration-200"
                            placeholder="e.g., F. Scott Fitzgerald"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Nationality
                        </label>
                        <input
                            type="text"
                            value={formData.nationality}
                            onChange={(e) =>
                                setFormData({ ...formData, nationality: e.target.value })
                            }
                            className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base transition-all duration-200"
                            placeholder="e.g., American"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Biography
                        </label>
                        <textarea
                            rows="4"
                            value={formData.biography}
                            onChange={(e) =>
                                setFormData({ ...formData, biography: e.target.value })
                            }
                            className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base transition-all duration-200 resize-none"
                            placeholder="Brief biography of the author..."
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
                            className="w-full sm:flex-1 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white py-2.5 px-4 rounded-lg transition-all duration-200 text-sm sm:text-base font-medium disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center space-x-2">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    <span>{editingAuthor ? "Updating..." : "Adding..."}</span>
                                </div>
                            ) : editingAuthor ? (
                                "Update Author"
                            ) : (
                                "Add Author"
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
                title="Delete Author"
                message={`Are you sure you want to delete "${deleteConfirm.authorName}"? This will also affect related books.`}
                confirmText="Delete"
                cancelText="Cancel"
                type="danger"
            />
        </div>
    );
};

export default Authors;
