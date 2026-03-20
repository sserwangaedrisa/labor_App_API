// components/SiteSettings/SiteSettings.tsx
import React, { useState, useEffect } from "react";
import type {
  SiteSettings,
  UpdateSettingsDto,
} from "../../../types/SharedTypes";
// import {
//   siteSettingsService,
// } from "../../services/siteSettingsService";
import authorizePostRequest from "../../../api/authorizePostRequest";
import { format } from "date-fns";
import { toast } from "react-hot-toast";

interface SiteSettingsProps {
  initialDate?: Date;
  siteID: string;
  onSettingsUpdate?: (settings: SiteSettings) => void;
  // NEW: Add setCurrentDate prop
  setCurrentDate?: (date: Date) => void;
}

const SiteSettingsComponent: React.FC<SiteSettingsProps> = ({
  initialDate = new Date(),
  siteID,
  onSettingsUpdate,
  setCurrentDate, // NEW: Destructure the prop
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate);

  const [currentSettings, setCurrentSettings] = useState<SiteSettings>({
    id: "dummy-settings-1",
    siteId: "dummy_siteId",
    overtimeRate: 0,
    maxDailyHours: 8,
    baseHourlyRate: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  const [settingsHistory, setSettingsHistory] = useState<SiteSettings[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [deletingSettingId, setDeletingSettingId] = useState<string | null>(
    null,
  );
  const [updatingSettingId, setUpdatingSettingId] = useState<string | null>(
    null,
  );

  // State for history date range
  const [historyStartDate, setHistoryStartDate] = useState<string>(
    format(new Date(), "yyyy-MM-01"),
  );
  const [historyEndDate, setHistoryEndDate] = useState<string>(
    format(new Date(), "yyyy-MM-dd"),
  );

  // Form state
  const [formData, setFormData] = useState<UpdateSettingsDto>({
    siteId: siteID,
    id: "",
    overtimeRate: 0,
    maxDailyHours: 10,
    baseHourlyRate: 0,
    createdAt: initialDate
      ? new Date(initialDate).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
    startDateStr: format(new Date(), "yyyy-MM-01"),
    endDateStr: format(new Date(), "yyyy-MM-dd"),
  });

  // Load settings when date changes
  useEffect(() => {
    loadSettingsForDate(selectedDate);
    setFormData({ ...formData, siteId: siteID });
  }, [selectedDate, siteID]);

  const loadSettingsForDate = async (date: Date) => {
    setIsLoading(true);
    try {
      const formattedDate = format(date, "yyyy-MM-dd");

      let settings: SiteSettings | null = null;
      try {
        const requestDate = new Date(formattedDate);
        const response = await authorizePostRequest<any>("settings/byDate", {
          siteID,
          dateStr: requestDate,
        });

        if (response?.data) {
          settings = response.data;
        } else {
          settings = currentSettings;
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
        settings = currentSettings;
      }

      if (!settings) {
        toast.error("No settings available");
        setIsLoading(false);
        return;
      }

      setCurrentSettings(settings);
      setFormData({
        siteId: siteID,
        overtimeRate: settings.overtimeRate,
        maxDailyHours: settings.maxDailyHours,
        baseHourlyRate: settings.baseHourlyRate,
      });
    } catch (error) {
      console.error("Error loading settings:", error);
      toast.error("Failed to load site settings");
    } finally {
      setIsLoading(false);
    }
  };

  const loadSettingsHistory = async () => {
    try {
      const history = await authorizePostRequest<any>("settings/history", {
        ...formData,
        startDateStr: historyStartDate,
        endDateStr: historyEndDate,
        createdAt: initialDate,
        siteID,
      });

      if (!history.data) {
        setSettingsHistory([]);
        toast.error("no data found");
        return;
      }

      setSettingsHistory(history.data);
      setShowHistory(true);
    } catch (error) {
      console.error("Error loading history:", error);
      toast.error("Failed to load settings history");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: parseFloat(value) || 0,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFormData({
      ...formData,
      siteId: siteID,
      createdAt: new Date(initialDate).toISOString().split("T")[0],
    });

    try {
      let updatedSettings: {
        success: boolean;
        status?: string;
        message?: string;
        data?: SiteSettings;
      };

      // Check if settings exist for the selected date AND it's not the dummy
      const settingsExistForSelectedDate =
        currentSettings?.id !== "dummy-settings-1" &&
        format(new Date(currentSettings.createdAt), "yyyy-MM-dd") ===
          format(selectedDate, "yyyy-MM-dd");

      if (settingsExistForSelectedDate) {
        // Update existing settings
        updatedSettings = await authorizePostRequest("settings/update", {
          ...formData,
          id: currentSettings.id,
          createdAt: initialDate,
        });
        if (!updatedSettings.success) {
          console.log(updatedSettings?.message);
          toast.error(updatedSettings?.message || "Something went wrong");
          return;
        }
        toast.success("Settings updated successfully");
      } else {
        // Create new settings
        updatedSettings = await authorizePostRequest("settings/create", {
          ...formData,
          createdAt: initialDate,
        });

        if (!updatedSettings?.success) {
          console.log(updatedSettings?.message);
          toast.error(updatedSettings?.message || "Something went wrong");
          return;
        }

        toast.success("Settings created successfully");
      }

      setCurrentSettings(
        updatedSettings.data ? updatedSettings.data : currentSettings,
      );
      setIsEditing(false);

      if (onSettingsUpdate) {
        onSettingsUpdate(
          updatedSettings.data ? updatedSettings.data : currentSettings,
        );
      }

      // Refresh history if showing
      if (showHistory) {
        loadSettingsHistory();
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setIsLoading(false);
    }
  };

  // NEW: Handle delete settings
  const handleDeleteSettings = async (settingId: string, settingDate: Date) => {
    if (
      !confirm(
        "Are you sure you want to delete this settings record? This action cannot be undone.",
      )
    ) {
      return;
    }

    setDeletingSettingId(settingId);
    try {
      const response = await authorizePostRequest<{
        success: boolean;
        status?: string;
        message?: string;
        data?: SiteSettings;
      }>("settings/delete", {
        id: settingId,
        siteID,
      });

      if (!response.success) {
        toast.error(response.message || "Failed to delete settings");
        return;
      }

      toast.success("Settings deleted successfully");

      // Refresh history list
      await loadSettingsHistory();

      // If the deleted settings is the currently selected one, reload current settings
      const currentSettingDate = new Date(currentSettings.createdAt);
      if (currentSettingDate.toDateString() === settingDate.toDateString()) {
        await loadSettingsForDate(selectedDate);
      }
    } catch (error) {
      console.error("Error deleting settings:", error);
      toast.error("Failed to delete settings");
    } finally {
      setDeletingSettingId(null);
    }
  };

  // MODIFIED: Update parent when date changes
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    setSelectedDate(newDate);
    setIsEditing(false);

    // Call the parent's setCurrentDate function if provided
    if (setCurrentDate) {
      setCurrentDate(newDate);
    }
  };

  const handleApplyToCurrent = () => {
    if (currentSettings) {
      setFormData({
        siteId: siteID,
        overtimeRate: currentSettings.overtimeRate,
        maxDailyHours: currentSettings.maxDailyHours,
        baseHourlyRate: currentSettings.baseHourlyRate,
      });
    }
  };

  const formatDateTime = (dateString: string) => {
    return format(new Date(dateString), "MMM dd-yyyy");
  };

  if (isLoading && !currentSettings) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      {/* Header with Date Selection */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 md:mb-0">
          Site Settings
        </h2>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label
              htmlFor="date"
              className="text-sm text-gray-600 dark:text-gray-400"
            >
              Date:
            </label>
            <input
              type="date"
              id="date"
              value={format(selectedDate, "yyyy-MM-dd")}
              onChange={handleDateChange}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {isEditing ? "Cancel" : "Edit Settings"}
          </button>

          <button
            onClick={() => setShowHistory(!showHistory)}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            {showHistory ? "Hide History" : "View History"}
          </button>
        </div>
      </div>

      {/* Current Settings Display/Edit Form */}
      <div className="mb-8">
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Overtime Rate (x)
                </label>
                <input
                  type="number"
                  name="overtimeRate"
                  value={formData.overtimeRate}
                  onChange={handleInputChange}
                  step="0.1"
                  min="1"
                  max="3"
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Max Daily Hours
                </label>
                <input
                  type="number"
                  name="maxDailyHours"
                  value={formData.maxDailyHours}
                  onChange={handleInputChange}
                  step="0.5"
                  min="1"
                  max="24"
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Base Hourly Rate ($)
                </label>
                <input
                  type="number"
                  name="baseHourlyRate"
                  value={formData.baseHourlyRate}
                  onChange={handleInputChange}
                  step="0.5"
                  min="0"
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleApplyToCurrent}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Reset to Current
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {isLoading ? "Saving..." : "Save Settings"}
              </button>
            </div>
          </form>
        ) : (
          currentSettings && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Overtime Rate
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {currentSettings.overtimeRate}x
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Max Daily Hours
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {currentSettings.maxDailyHours} hrs
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Base Hourly Rate
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    ${currentSettings.baseHourlyRate}/hr
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Last Updated
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatDateTime(
                      new Date(currentSettings.updatedAt)
                        .toISOString()
                        .split("T")[0],
                    )}
                  </p>
                </div>
              </div>
            </div>
          )
        )}
      </div>

      {/* Settings History */}
      {showHistory && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Settings History
          </h3>

          {/* Date range filters for history */}
          <div className="mb-4 flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex items-center space-x-2">
              <label
                htmlFor="historyStartDate"
                className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap"
              >
                From:
              </label>
              <input
                type="date"
                id="historyStartDate"
                value={historyStartDate}
                onChange={(e) => setHistoryStartDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div className="flex items-center space-x-2">
              <label
                htmlFor="historyEndDate"
                className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap"
              >
                To:
              </label>
              <input
                type="date"
                id="historyEndDate"
                value={historyEndDate}
                onChange={(e) => setHistoryEndDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <button
              onClick={loadSettingsHistory}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Apply Filter
            </button>

            <button
              onClick={() => {
                setHistoryStartDate(format(new Date(), "yyyy-MM-01"));
                setHistoryEndDate(format(new Date(), "yyyy-MM-dd"));
                loadSettingsHistory();
              }}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Reset to Current Month
            </button>
          </div>

          <button
            onClick={loadSettingsHistory}
            className="mb-4 px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400"
          >
            Refresh History
          </button>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Overtime Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Max Hours
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Base Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Updated
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {settingsHistory.map((setting) => (
                  <tr
                    key={setting.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {format(new Date(setting.createdAt), "yyyy-MM-dd")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {setting.overtimeRate}x
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {setting.maxDailyHours} hrs
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      ${setting.baseHourlyRate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDateTime(
                        new Date(setting.updatedAt).toISOString().split("T")[0],
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                      <button
                        onClick={() => {
                          setSelectedDate(new Date(setting.createdAt));
                          setCurrentSettings(setting);
                          setShowHistory(false);

                          // Also update parent when viewing a historical date
                          if (setCurrentDate) {
                            setCurrentDate(new Date(setting.createdAt));
                          }
                        }}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        View
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteSettings(
                            setting.id,
                            new Date(setting.createdAt),
                          )
                        }
                        disabled={deletingSettingId === setting.id}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {deletingSettingId === setting.id
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default SiteSettingsComponent;
