import React, { use } from "react";
import { useState, useEffect } from "react";

interface ConfirmationModalProps {
  title?: string;
  onConfirm: () => void;
  onCancel: () => void;
  operationFinished?: boolean;
  confirmButtonText?: string;
  cancelButtonText?: string;
  description?: string;
  danger?: boolean;
  isLoading?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  title,
  onConfirm,
  onCancel,
  operationFinished,
  confirmButtonText = "Confirm",
  cancelButtonText = "Cancel",
  description,
  danger = false,
  isLoading = false,
}) => {
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  const [isOpen, setIsOpen] = useState<boolean>(true);

  if (!isOpen) return;

  useEffect(() => {
    if (operationFinished) {
      setIsOpen(false);
    }
  }, [operationFinished]);

  const handleSubmission = () => {
    onConfirm();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-white/50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Confirm {title || " to proccess the request"}
          </h3>
        </div>

        <div className="px-6 py-4">
          <p className="text-gray-700">
            {description ||
              `Are you sure you want to ${title?.toLowerCase()}? This action cannot be undone.`}
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelButtonText || "Cancel"}
          </button>
          <button
            onClick={() => handleSubmission()}
            disabled={isLoading}
            className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center ${
              danger
                ? "bg-red-600 hover:bg-red-700 focus:ring-red-500"
                : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isLoading ? "Processing..." : confirmButtonText || "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
