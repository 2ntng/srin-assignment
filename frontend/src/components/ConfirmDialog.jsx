import React from "react";
import { AlertTriangle, X } from "lucide-react";

const ConfirmDialog = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Confirm Action",
    message = "Are you sure you want to proceed?",
    confirmText = "Confirm",
    cancelText = "Cancel",
    type = "danger", // danger, warning, info
}) => {
    if (!isOpen) return null;

    const getTypeStyles = () => {
        switch (type) {
            case "danger":
                return {
                    icon: "text-red-600",
                    button: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
                };
            case "warning":
                return {
                    icon: "text-yellow-600",
                    button: "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500",
                };
            default:
                return {
                    icon: "text-blue-600",
                    button: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
                };
        }
    };

    const styles = getTypeStyles();

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };
    return (
        <div
            className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200"
            onClick={handleBackdropClick}
        >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-200 animate-in slide-in-from-bottom-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-3">
                        <AlertTriangle className={`h-6 w-6 ${styles.icon}`} />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {title}
                        </h3>
                    </div>{" "}
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="p-6">
                    <p className="text-gray-600 dark:text-gray-300 mb-6">{message}</p>

                    <div className="flex space-x-3">
                        {" "}
                        <button
                            onClick={onConfirm}
                            className={`flex-1 text-white py-2 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer ${styles.button}`}
                        >
                            {confirmText}
                        </button>{" "}
                        <button
                            onClick={onClose}
                            className="flex-1 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 cursor-pointer"
                        >
                            {cancelText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;
