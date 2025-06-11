import React, { useEffect } from "react";
import { X } from "lucide-react";

const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    size = "md", // sm, md, lg, xl
    showCloseButton = true,
}) => {
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const getSizeClasses = () => {
        switch (size) {
            case "sm":
                return "max-w-sm";
            case "lg":
                return "max-w-2xl";
            case "xl":
                return "max-w-4xl";
            default:
                return "max-w-lg";
        }
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };
    return (
        <div
            className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-40 animate-in fade-in duration-200"
            onClick={handleBackdropClick}
        >
            <div
                className={`bg-white dark:bg-gray-800 rounded-xl shadow-2xl ${getSizeClasses()} w-full mx-2 sm:mx-4 transform transition-all duration-200 animate-in slide-in-from-bottom-4 max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col border border-gray-200 dark:border-gray-700`}
            >
                {title && (
                    <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                            {title}
                        </h2>
                        {showCloseButton && (
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer"
                            >
                                <X className="h-5 w-5 sm:h-6 sm:w-6" />
                            </button>
                        )}
                    </div>
                )}

                <div className="flex-1 overflow-y-auto">{children}</div>
            </div>
        </div>
    );
};

export default Modal;
