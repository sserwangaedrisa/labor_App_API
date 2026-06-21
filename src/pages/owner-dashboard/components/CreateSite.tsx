// components/SiteModal.tsx
import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast"; // or your preferred toast library
import Loading from "../../../components/ui/Loading"; // A simple loading spinner component
import authorizeGetRequest from "../../../api/authorizeGetRequest";
import authorizePostRequest from "../../../api/authorizePostRequest";

interface SiteData {
  id?: string;
  name: string;
  location: string;
  description: string;
  dutyHours: number;
  foremanId: string;
}

interface SiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  siteId?: string; // If provided, we're in edit mode
}

const SiteModal: React.FC<SiteModalProps> = ({ isOpen, onClose, siteId }) => {
  const [formData, setFormData] = useState<SiteData>({
    name: "",
    location: "",
    description: "",
    dutyHours: 8,
    foremanId: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [foremenList, setForemenList] = useState<
    { id: string; name: string }[]
  >([]);

  // Populate form when editing an existing site
  useEffect(() => {
    if (siteId) {
      setFormData({
        id: siteId,
        name: "",
        location: "",
        description: "",
        dutyHours: 8,
        foremanId: "",
      });
    } else {
      // Reset form for create mode
      setFormData({
        name: "",
        location: "",
        description: "",
        dutyHours: 8,
        foremanId: "",
      });
    }
    setErrors({});
  }, [siteId, isOpen]);

  // Fetch foremen list when component mounts
  useEffect(() => {
    console.log("Fetching foremen list...");
    fetchForemen();
  }, []);

  const fetchForemen = async () => {
    try {
      const response = await authorizeGetRequest("users/foremen");
      setForemenList(response.data || []);
    } catch (error) {
      console.error("Error fetching foremen:", error);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Site name is required";
    }
    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }
    if (formData.dutyHours <= 0 || formData.dutyHours > 24) {
      newErrors.dutyHours = "Duty hours must be between 1 and 24";
    }
    if (!formData.foremanId) {
      newErrors.foremanId = "Please select a foreman";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "dutyHours" ? parseFloat(value) : value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const data: any = await authorizePostRequest("sites/sites", formData);

      if (!data.success) {
        throw new Error(
          data.message || `Failed to ${siteId ? "update" : "create"} site`,
        );
      }

      // Success
      toast.success(`Site ${siteId ? "updated" : "created"} successfully!`);
      onClose(); // Close modal
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : `Failed to ${siteId ? "update" : "create"} site`,
      );
      // Don't close modal on error
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={!isLoading ? onClose : undefined}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-semibold text-gray-900">
              {siteId ? "Edit Site" : "Create New Site"}
            </h2>
            {!isLoading && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Site Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={isLoading}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.name ? "border-red-500" : "border-gray-300"
                } ${isLoading ? "bg-gray-100" : ""}`}
                placeholder="Enter site name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                disabled={isLoading}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.location ? "border-red-500" : "border-gray-300"
                } ${isLoading ? "bg-gray-100" : ""}`}
                placeholder="Enter site location"
              />
              {errors.location && (
                <p className="mt-1 text-sm text-red-600">{errors.location}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                disabled={isLoading}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                placeholder="Enter site description (optional)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Default Duty Hours *
              </label>
              <input
                type="number"
                name="dutyHours"
                value={formData.dutyHours}
                onChange={handleInputChange}
                disabled={isLoading}
                step="0.5"
                min="1"
                max="24"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.dutyHours ? "border-red-500" : "border-gray-300"
                } ${isLoading ? "bg-gray-100" : ""}`}
              />
              {errors.dutyHours && (
                <p className="mt-1 text-sm text-red-600">{errors.dutyHours}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assign Foreman *
              </label>
              <select
                name="foremanId"
                value={formData.foremanId}
                onChange={handleInputChange}
                disabled={isLoading || foremenList.length === 0}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.foremanId ? "border-red-500" : "border-gray-300"
                } ${isLoading || foremenList.length === 0 ? "bg-gray-100" : ""}`}
              >
                <option value="">Select a foreman</option>
                {foremenList.map((foreman) => (
                  <option key={foreman.id} value={foreman.id}>
                    {foreman.name}
                  </option>
                ))}
              </select>
              {errors.foremanId && (
                <p className="mt-1 text-sm text-red-600">{errors.foremanId}</p>
              )}
              {foremenList.length === 0 && (
                <p className="mt-1 text-sm text-yellow-600">
                  No foremen available. Please add foremen first.
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 flex items-center"
              >
                {isLoading && <Loading />}
                {siteId ? "Update Site" : "Create Site"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SiteModal;
