import React, { useState, useEffect } from "react";
import { useLibrary } from "../context/LibraryContext";
import { Plus, Edit, Trash2, Search, Mail, Phone, MapPin, Users } from "lucide-react";
import Modal from "./Modal";
import ConfirmDialog from "./ConfirmDialog";

const Members = () => {
    const { members, fetchMembers, addMember, updateMember, deleteMember, loading, error } =
        useLibrary();

    const [showModal, setShowModal] = useState(false);
    const [editingMember, setEditingMember] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [deleteConfirm, setDeleteConfirm] = useState({
        isOpen: false,
        memberId: null,
        memberName: "",
    });
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
    });

    useEffect(() => {
        fetchMembers();
    }, []);

    const filteredMembers = members.filter(
        (member) =>
            member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.phone?.includes(searchTerm)
    );

    const resetForm = () => {
        setFormData({
            name: "",
            email: "",
            phone: "",
            address: "",
        });
        setEditingMember(null);
        setShowModal(false);
    };

    const handleEdit = (member) => {
        setEditingMember(member);
        setFormData({
            name: member.name || "",
            email: member.email || "",
            phone: member.phone || "",
            address: member.address || "",
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingMember) {
                await updateMember(editingMember.id, formData);
            } else {
                await addMember(formData);
            }
            resetForm();
        } catch (err) {
            console.error("Error saving member:", err);
        }
    };

    const handleDelete = async (id) => {
        const member = members.find((m) => m.id === id);
        setDeleteConfirm({
            isOpen: true,
            memberId: id,
            memberName: member?.name || "this member",
        });
    };

    const confirmDelete = async () => {
        try {
            await deleteMember(deleteConfirm.memberId);
            setDeleteConfirm({ isOpen: false, memberId: null, memberName: "" });
        } catch (err) {
            console.error("Error deleting member:", err);
        }
    };

    const cancelDelete = () => {
        setDeleteConfirm({ isOpen: false, memberId: null, memberName: "" });
    };

    return (
        <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white">
                    Members Management
                </h1>{" "}
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition-all duration-200 w-full sm:w-auto text-sm sm:text-base shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                    <Plus className="h-4 w-4" />
                    <span>Add Member</span>
                </button>
            </div>

            {/* Search Bar */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-3 sm:p-4 lg:p-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4 sm:h-5 sm:w-5" />
                    <input
                        type="text"
                        placeholder="Search members by name, email, or phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 sm:pl-12 pr-4 py-2.5 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm sm:text-base transition-all duration-200"
                    />
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
                </div>
            )}

            {/* Members Grid */}
            {!loading && !error && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                    {filteredMembers.map((member) => (
                        <div
                            key={member.id}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg dark:hover:shadow-xl transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-600 group"
                        >
                            <div className="p-3 sm:p-4 lg:p-6">
                                <div className="flex justify-between items-start mb-3 sm:mb-4">
                                    <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-800 dark:text-white line-clamp-2 flex-1 mr-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                                        {member.name}
                                    </h3>
                                    <div className="flex space-x-1 flex-shrink-0 opacity-70 group-hover:opacity-100 transition-opacity">
                                        {" "}
                                        <button
                                            onClick={() => handleEdit(member)}
                                            className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 p-1.5 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-all cursor-pointer"
                                            aria-label="Edit member"
                                        >
                                            <Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                        </button>{" "}
                                        <button
                                            onClick={() => handleDelete(member.id)}
                                            className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-all cursor-pointer"
                                            aria-label="Delete member"
                                        >
                                            <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                                    <div className="flex items-center space-x-2">
                                        <Mail className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                                        <span className="truncate">{member.email}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Phone className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                                        <span>{member.phone}</span>
                                    </div>
                                    <div className="flex items-start space-x-2">
                                        <MapPin className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500 flex-shrink-0 mt-0.5" />
                                        <span className="truncate">
                                            {member.address || "No address"}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-3 sm:mt-4">
                                    <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300">
                                        <Users className="w-1.5 h-1.5 mr-1.5" />
                                        Active Member
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Empty State */}
            {!loading && !error && filteredMembers.length === 0 && (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                        <Users className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-base sm:text-lg font-medium">
                        No members found
                    </p>
                    {searchTerm && (
                        <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
                            Try adjusting your search criteria or{" "}
                            <button
                                onClick={() => setSearchTerm("")}
                                className="text-purple-600 dark:text-purple-400 hover:underline cursor-pointer"
                            >
                                clear the search
                            </button>
                        </p>
                    )}
                    {!searchTerm && (
                        <button
                            onClick={() => setShowModal(true)}
                            className="mt-4 inline-flex items-center space-x-2 text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 cursor-pointer"
                        >
                            <Plus className="h-4 w-4" />
                            <span>Add your first member</span>
                        </button>
                    )}
                </div>
            )}

            {/* Modal */}
            <Modal
                isOpen={showModal}
                onClose={resetForm}
                title={editingMember ? "Edit Member" : "Add New Member"}
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
                            className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base transition-all duration-200"
                            placeholder="Enter member name"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Email *
                        </label>
                        <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base transition-all duration-200"
                            placeholder="Enter email address"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Phone *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base transition-all duration-200"
                            placeholder="Enter phone number"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Address
                        </label>
                        <textarea
                            rows="3"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base transition-all duration-200"
                            placeholder="Enter address (optional)"
                        />
                    </div>

                    <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                        {" "}
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
                            className="w-full sm:flex-1 bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600 text-white py-2.5 px-4 rounded-lg transition-all duration-200 text-sm sm:text-base font-medium disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center space-x-2">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    <span>{editingMember ? "Updating..." : "Adding..."}</span>
                                </div>
                            ) : editingMember ? (
                                "Update Member"
                            ) : (
                                "Add Member"
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
                title="Delete Member"
                message={`Are you sure you want to delete "${deleteConfirm.memberName}"? This will also affect their borrowed books.`}
                confirmText="Delete"
                cancelText="Cancel"
                type="danger"
            />
        </div>
    );
};

export default Members;
