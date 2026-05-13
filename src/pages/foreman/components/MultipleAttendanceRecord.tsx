import React, { useEffect, useState } from "react";
import authorizePostRequest from "../../../api/authorizePostRequest";
import toast from "react-hot-toast";

type Worker = {
  id: string;
  name: string;
  email: string;
  identificationNumber?: string;
};

interface MultipleAttendanceRecordProps {
  siteId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const PAGE_SIZE = 20;

const MultipleAttendanceRecord: React.FC<MultipleAttendanceRecordProps> = ({
  siteId,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [selectedWorkers, setSelectedWorkers] = useState<Worker[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [hours, setHours] = useState("8");
  const [overtime, setOvertime] = useState("0");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const controller = new AbortController();

    const loadWorkers = async () => {
      setLoading(true);
      setFetchError(null);

      try {
        const params = new URLSearchParams({
          siteId,
          page: String(page),
          limit: String(PAGE_SIZE),
          search: searchTerm,
          sortBy: "name",
          order: "asc",
        });

        const response: { success: boolean; data: any; message: string } =
          await authorizePostRequest(
            `/api/workers/search?${params.toString()}`,
            {
              signal: controller.signal,
            },
          );

        if (!response.success) {
          toast.error(response.message || "Failed to load workers");
          console.error(`Error fetching workers: ${response.message}`);
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

    return () => {
      controller.abort();
    };
  }, [siteId, page, searchTerm, isOpen]);

  const isSelected = (worker: Worker) =>
    selectedWorkers.some((item) => item.id === worker.id);

  const toggleWorkerSelection = (worker: Worker) => {
    setSelectedWorkers((current) => {
      if (current.some((item) => item.id === worker.id)) {
        return current.filter((item) => item.id !== worker.id);
      }
      return [...current, worker];
    });
  };

  const removeSelectedWorker = (workerId: string) => {
    setSelectedWorkers((current) =>
      current.filter((item) => item.id !== workerId),
    );
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(1);
  };

  const handleSubmit = async () => {
    setSubmitError(null);

    if (selectedWorkers.length === 0) {
      setSubmitError("Please select at least one worker before submitting.");
      return;
    }

    if (isNaN(Number(hours)) || isNaN(Number(overtime))) {
      setSubmitError("Hours and overtime must be valid numbers.");
      return;
    }

    setSubmitting(true);

    try {
      const response: { success: boolean; data: any; message: string } =
        await authorizePostRequest("/api/work-entries/bulk", {
          method: "POST",
          body: JSON.stringify({
            workersIds: selectedWorkers.map((worker) => worker.id),
            siteId,
            hours,
            overtime,
            notes,
            date,
          }),
        });

      if (!response.success) {
        const body = await response.data;
        throw new Error(
          body?.message || response.message || "Failed to submit attendance",
        );
      }

      setSelectedWorkers([]);
      setSearchTerm("");
      setPage(1);
      setNotes("");
      setHours("8");
      setOvertime("0");

      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Unable to submit attendance",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <div style={headerStyle}>
          <h2 style={{ margin: 0 }}>Record Multiple Attendance</h2>
          <button
            type="button"
            onClick={onClose}
            style={closeButtonStyle}
            aria-label="Close modal"
          >
            ×
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
                <div key={worker.id} style={selectedItemStyle}>
                  <span>
                    {worker.name} ({worker.email})
                  </span>
                  <button
                    type="button"
                    onClick={() => removeSelectedWorker(worker.id)}
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
                    <th style={tableHeaderStyle} />
                    <th style={tableHeaderStyle}>Name</th>
                    <th style={tableHeaderStyle}>Email</th>
                    <th style={tableHeaderStyle}>ID</th>
                  </tr>
                </thead>
                <tbody>
                  {workers.length === 0 ? (
                    <tr>
                      <td colSpan={4} style={emptyCellStyle}>
                        No workers found.
                      </td>
                    </tr>
                  ) : (
                    workers.map((worker) => (
                      <tr key={worker.id} style={tableRowStyle}>
                        <td style={tableCellStyle}>
                          <input
                            type="checkbox"
                            checked={isSelected(worker)}
                            onChange={() => toggleWorkerSelection(worker)}
                          />
                        </td>
                        <td style={tableCellStyle}>{worker.name}</td>
                        <td style={tableCellStyle}>{worker.email}</td>
                        <td style={tableCellStyle}>
                          {worker.identificationNumber || worker.id}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              <div style={paginationStyle}>
                <button
                  type="button"
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  disabled={page <= 1}
                  style={paginationButtonStyle}
                >
                  Previous
                </button>
                <span>
                  Page {page} of {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setPage((current) => Math.min(totalPages, current + 1))
                  }
                  disabled={page >= totalPages}
                  style={paginationButtonStyle}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>

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
        </div>

        <div style={formRowStyle}>
          <label style={labelStyle}>Notes</label>
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Optional notes for this attendance record"
            style={{ ...inputStyle, minHeight: 80, resize: "vertical" }}
          />
        </div>

        {submitError && <p style={{ color: "red" }}>{submitError}</p>}

        <div style={actionsStyle}>
          <button type="button" onClick={onClose} style={secondaryButtonStyle}>
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            style={primaryButtonStyle}
            disabled={submitting}
          >
            {submitting ? "Recording..." : "Record Attendance"}
          </button>
        </div>
      </div>
    </div>
  );
};

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
  backgroundColor: "#2563eb",
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

export default MultipleAttendanceRecord;
