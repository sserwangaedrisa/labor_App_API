import React, { useEffect, useState } from "react";
import authorizePostRequest from "../../../api/authorizePostRequest";
import toast from "react-hot-toast";
import type { ActiveWorker, SiteSettings } from "../../../types/SharedTypes";

interface MultipleAttendanceRecordProps {
  siteId: string;
  isOpen: boolean;
  siteSettings?: SiteSettings;
  currentDate?: Date;
  onClose: () => void;
  onSuccess?: () => void;
}

const PAGE_SIZE = 20;

const MultipleAttendanceRecord: React.FC<MultipleAttendanceRecordProps> = ({
  siteId,
  isOpen,
  siteSettings,
  currentDate,
  onClose,
  onSuccess,
}) => {
  const [workers, setWorkers] = useState<ActiveWorker[]>([]);
  const [selectedWorkers, setSelectedWorkers] = useState<ActiveWorker[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [hours, setHours] = useState(
    siteSettings?.maxDailyHours.toString() || "10",
  );
  const [overtime, setOvertime] = useState(
    siteSettings?.overtimeRate.toString() || "0",
  );
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState<string>();

  //  mode = 'add' (record attendance) or 'delete' (delete attendance)
  const [mode, setMode] = useState<"add" | "delete">("add");
  const [searchDate, setSearchDate] = useState<Date | null>();

  useEffect(() => {
    if (currentDate) {
      setDate(new Date(currentDate).toISOString().slice(0, 10));
    } else {
      setDate(new Date().toISOString().slice(0, 10));
    }

    if (currentDate && isOpen && mode === "delete") {
      setSearchDate(new Date(currentDate));
    } else {
      searchDate ? setSearchDate(null) : setSearchDate(null);
    }
  }, [currentDate, isOpen, mode]);

  useEffect(() => {
    if (!isOpen) return;

    const controller = new AbortController();

    const loadWorkers = async () => {
      setLoading(true);
      setFetchError(null);

      try {
        const params = new URLSearchParams({
          siteId,
          page: String(page),
          date: mode === "delete" && date ? new Date(date).toISOString() : "",
          limit: String(PAGE_SIZE),
          search: searchTerm,
          sortBy: "name",
          order: "asc",
        });

        const response: { success: boolean; data: any; message: string } =
          await authorizePostRequest(`worker/search?${params.toString()}`, {
            signal: controller.signal,
          });

        if (!response.success) {
          toast.error(response.message || "Failed to load workers");
          throw new Error(`Failed to load workers: ${response.message}`);
        }

        const data = await response.data;
        const loadedWorkers = Array.isArray(data.workers) ? data.workers : [];
        setWorkers(loadedWorkers);

        if (typeof data.total === "number") {
          setTotalPages(Math.max(1, Math.ceil(data.total / PAGE_SIZE)));
        } else {
          const fallbackTotal =
            loadedWorkers.length === PAGE_SIZE ? page + 1 : page;
          setTotalPages(Math.max(1, fallbackTotal));
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        setFetchError(
          error instanceof Error ? error.message : "Unable to fetch workers",
        );
      } finally {
        setLoading(false);
      }
    };

    loadWorkers();

    return () => controller.abort();
  }, [siteId, page, searchTerm, isOpen, mode, date]);

  const isSelected = (worker: ActiveWorker) =>
    selectedWorkers.some((item) => item.worker.id === worker.worker.id);

  const toggleWorkerSelection = (worker: ActiveWorker) => {
    setSelectedWorkers((current) => {
      if (current.some((item) => item.worker.id === worker.worker.id)) {
        return current.filter((item) => item.worker.id !== worker.worker.id);
      }
      return [...current, worker];
    });
  };

  const removeSelectedWorker = (workerId: string) => {
    setSelectedWorkers((current) =>
      current.filter((item) => item.worker.id !== workerId),
    );
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(1);
  };

  const handleSubmit = async () => {
    setSubmitError(null);

    if (selectedWorkers.length === 0) {
      setSubmitError(
        mode === "add"
          ? "Please select at least one worker before recording attendance."
          : "Please select at least one worker whose attendance you want to delete.",
      );
      return;
    }

    // For add mode, validate hours/overtime
    if (mode === "add" && (isNaN(Number(hours)) || isNaN(Number(overtime)))) {
      setSubmitError("Hours and overtime must be valid numbers.");
      return;
    }

    setSubmitting(true);

    try {
      let response: { success: boolean; data: any; message: string };
      if (mode === "add") {
        response = await authorizePostRequest("attendance/bulk", {
          workersIds: selectedWorkers.map((worker) => worker.worker.id),
          siteId,
          hours,
          overtime,
          notes,
          date,
        });
      } else {
        response = await authorizePostRequest("attendance/deleteBulk", {
          workersIds: selectedWorkers.map((worker) => worker.worker.id),
          siteId,
          date,
        });
      }

      if (!response.success) {
        const body = await response.data;
        toast.error(response.message || `Failed to ${mode} attendance`);
        throw new Error(
          body?.message || response.message || `Failed to ${mode} attendance`,
        );
      }

      toast.success(
        response.message ||
          `Successfully ${mode === "add" ? "recorded" : "deleted"} attendance for ${selectedWorkers.length} worker(s)`,
      );

      setSelectedWorkers([]);
      setSearchTerm("");
      setPage(1);
      setNotes("");
      setMode("add");

      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : `Unable to ${mode} attendance`,
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <div style={headerStyle}>
          <h2 style={{ margin: 0 }}>
            {mode === "add"
              ? "Record Multiple Attendance"
              : "Delete Multiple Attendance"}
          </h2>

          <button
            type="button"
            onClick={() => (setMode("add"), onClose())}
            style={closeButtonStyle}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        {/* Mode toggle */}
        <div style={modeToggleStyle}>
          <button
            type="button"
            onClick={() => {
              setSelectedWorkers([]);
              setMode("add");
            }}
            style={{
              ...modeButtonStyle,
              backgroundColor: mode === "add" ? "#2563eb" : "#e5e7eb",
              color: mode === "add" ? "#fff" : "#111827",
            }}
          >
            Record Attendance
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedWorkers([]);

              setMode("delete");
            }}
            style={{
              ...modeButtonStyle,
              backgroundColor: mode === "delete" ? "#dc2626" : "#e5e7eb",
              color: mode === "delete" ? "#fff" : "#111827",
            }}
          >
            Delete Attendance
          </button>
        </div>

        <div style={formRowStyle}>
          <label style={labelStyle}>Search workers</label>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search by name, ID or email"
            style={inputStyle}
          />
        </div>

        <div style={formRowStyle}>
          <label style={labelStyle}>Selected workers</label>
          <div style={selectedListStyle}>
            {selectedWorkers.length === 0 ? (
              <span style={emptyStateStyle}>No workers selected yet.</span>
            ) : (
              selectedWorkers.map((worker) => (
                <div key={worker.worker.id} style={selectedItemStyle}>
                  <span>
                    {worker.worker.name} ({worker.worker.email})
                  </span>
                  <button
                    type="button"
                    onClick={() => removeSelectedWorker(worker.worker.id)}
                    style={removeButtonStyle}
                  >
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div style={tableContainerStyle}>
          {loading ? (
            <p>Loading workers...</p>
          ) : fetchError ? (
            <p style={{ color: "red" }}>{fetchError}</p>
          ) : (
            <>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={tableHeaderStyle}></th>
                    <th style={tableHeaderStyle}>Image</th>
                    <th style={tableHeaderStyle}>Name</th>
                    <th style={tableHeaderStyle}>Email</th>
                    <th style={tableHeaderStyle}>ID</th>
                  </tr>
                </thead>
                <tbody>
                  {workers.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={emptyCellStyle}>
                        No workers found.
                      </td>
                    </tr>
                  ) : (
                    workers.map((worker) => (
                      <tr key={worker.worker.id} style={tableRowStyle}>
                        <td style={tableCellStyle}>
                          <input
                            type="checkbox"
                            checked={isSelected(worker)}
                            onChange={() => toggleWorkerSelection(worker)}
                          />
                        </td>
                        <td style={tableCellStyle}>
                          {worker.worker.imageUrl ? (
                            <img
                              src={worker.worker.imageUrl}
                              alt={worker.worker.name}
                              style={avatarStyle}
                            />
                          ) : (
                            <div style={avatarPlaceholderStyle}>
                              {worker.worker.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </td>
                        <td style={tableCellStyle}>{worker.worker.name}</td>
                        <td style={tableCellStyle}>{worker.worker.email}</td>
                        <td style={tableCellStyle}>{worker.worker.id}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              <div style={paginationStyle}>
                {totalPages > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      setPage((current) => Math.max(1, current - 1))
                    }
                    disabled={page <= 1}
                    style={paginationButtonStyle}
                    className="text-sm text-muted-foreground text-center text-blue-00"
                  >
                    {`< Previous`}
                  </button>
                )}
                <span className="text-sm text-muted-foreground text-center text-blue-00">
                  Page {page} of {totalPages}
                </span>
                {totalPages > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      setPage((current) => Math.min(totalPages, current + 1))
                    }
                    disabled={page >= totalPages}
                    style={paginationButtonStyle}
                    className="text-sm text-muted-foreground text-center text-blue-00"
                  >
                    {`Next >`}
                  </button>
                )}
              </div>
            </>
          )}
        </div>

        {/* Show date picker always, but hide hours/overtime/notes in delete mode */}
        <div style={gridStyle}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Date</label>
            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              style={inputStyle}
            />
          </div>
          {mode === "add" && (
            <>
              <div style={formGroupStyle}>
                <label style={labelStyle}>Hours</label>
                <input
                  type="number"
                  min="0"
                  step="0.25"
                  value={hours}
                  onChange={(event) => setHours(event.target.value)}
                  style={inputStyle}
                />
              </div>
              <div style={formGroupStyle}>
                <label style={labelStyle}>Overtime</label>
                <input
                  type="number"
                  min="0"
                  step="0.25"
                  value={overtime}
                  onChange={(event) => setOvertime(event.target.value)}
                  style={inputStyle}
                />
              </div>
            </>
          )}
        </div>

        {mode === "add" && (
          <div style={formRowStyle}>
            <label style={labelStyle}>Notes</label>
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Optional notes for this attendance record"
              style={{ ...inputStyle, minHeight: 80, resize: "vertical" }}
            />
          </div>
        )}

        {submitError && <p style={{ color: "red" }}>{submitError}</p>}

        <div style={actionsStyle}>
          <button
            type="button"
            onClick={() => (setMode("add"), onClose())}
            style={secondaryButtonStyle}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            style={{
              ...primaryButtonStyle,
              backgroundColor: mode === "delete" ? "#dc2626" : "#2563eb",
            }}
            disabled={submitting}
          >
            {submitting
              ? mode === "add"
                ? "Recording..."
                : "Deleting..."
              : mode === "add"
                ? "Record Attendance"
                : "Delete Attendance"}
          </button>
        </div>
      </div>
    </div>
  );
};

// Styles (unchanged except added avatar and mode toggle styles)
const overlayStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.45)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: 16,
  zIndex: 1000,
};

const modalStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: 960,
  maxHeight: "90vh",
  overflowY: "auto",
  backgroundColor: "#fff",
  borderRadius: 10,
  boxShadow: "0 20px 50px rgba(0, 0, 0, 0.15)",
  padding: 24,
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 16,
};

const closeButtonStyle: React.CSSProperties = {
  background: "transparent",
  border: "none",
  fontSize: 24,
  lineHeight: 1,
  cursor: "pointer",
};

const modeToggleStyle: React.CSSProperties = {
  display: "flex",
  gap: 12,
  marginBottom: 20,
  borderBottom: "1px solid #e5e7eb",
  paddingBottom: 12,
};

const modeButtonStyle: React.CSSProperties = {
  flex: 1,
  padding: "8px 12px",
  borderRadius: 8,
  border: "none",
  fontSize: 14,
  fontWeight: 600,
  cursor: "pointer",
  transition: "all 0.2s",
};

const formRowStyle: React.CSSProperties = {
  marginBottom: 16,
};

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: 6,
  fontSize: 14,
  fontWeight: 600,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 6,
  border: "1px solid #d1d5db",
  fontSize: 14,
  outline: "none",
  boxSizing: "border-box",
};

const selectedListStyle: React.CSSProperties = {
  display: "grid",
  gap: 8,
  padding: 8,
  border: "1px solid #e5e7eb",
  borderRadius: 8,
  backgroundColor: "#fafafa",
};

const selectedItemStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "8px 10px",
  borderRadius: 6,
  backgroundColor: "#fff",
  border: "1px solid #e5e7eb",
};

const removeButtonStyle: React.CSSProperties = {
  background: "transparent",
  border: "1px solid #dc2626",
  color: "#dc2626",
  padding: "4px 10px",
  borderRadius: 6,
  cursor: "pointer",
};

const tableContainerStyle: React.CSSProperties = {
  width: "100%",
  overflowX: "auto",
  marginBottom: 16,
};

const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
};

const tableHeaderStyle: React.CSSProperties = {
  textAlign: "left",
  padding: "12px 10px",
  fontSize: 14,
  fontWeight: 700,
  borderBottom: "1px solid #d1d5db",
};

const tableRowStyle: React.CSSProperties = {
  backgroundColor: "#fff",
};

const tableCellStyle: React.CSSProperties = {
  padding: "10px",
  borderBottom: "1px solid #e5e7eb",
  fontSize: 14,
};

const emptyCellStyle: React.CSSProperties = {
  textAlign: "center",
  padding: 24,
  color: "#6b7280",
};

const paginationStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: 12,
};

const paginationButtonStyle: React.CSSProperties = {
  padding: "8px 14px",
  borderRadius: 6,
  border: "1px solid #d1d5db",
  background: "#fff",
  cursor: "pointer",
};

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: 16,
  marginBottom: 16,
};

const formGroupStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
};

const actionsStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "flex-end",
  gap: 12,
  marginTop: 8,
};

const primaryButtonStyle: React.CSSProperties = {
  padding: "12px 18px",
  borderRadius: 8,
  border: "none",
  color: "#fff",
  fontWeight: 600,
  cursor: "pointer",
};

const secondaryButtonStyle: React.CSSProperties = {
  padding: "12px 18px",
  borderRadius: 8,
  border: "1px solid #9ca3af",
  backgroundColor: "#fff",
  color: "#111827",
  cursor: "pointer",
};

const emptyStateStyle: React.CSSProperties = {
  color: "#6b7280",
};

const avatarStyle: React.CSSProperties = {
  width: 40,
  height: 40,
  borderRadius: "50%",
  objectFit: "cover",
  backgroundColor: "#f3f4f6",
};

const avatarPlaceholderStyle: React.CSSProperties = {
  width: 40,
  height: 40,
  borderRadius: "50%",
  backgroundColor: "#d1d5db",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 16,
  fontWeight: 600,
  color: "#1f2937",
};

export default MultipleAttendanceRecord;
