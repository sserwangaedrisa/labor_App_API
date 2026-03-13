import React, { useEffect, useState } from "react";
import Icon from "../../../components/ui/AppIconl";
import Image from "../../../components/ui/AppImage";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import * as sharedTypes from "../../../types/SharedTypes";

interface Worker {
  id: number | string;
  name: string;
  avatar?: string;
  avatarAlt?: string;
  wageRate: number;
}

interface Errors {
  date?: string;
  hours?: string;
}
interface AttendanceModalProps {
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  worker: sharedTypes.User;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (data: sharedTypes.WorkEntry) => void;
}

const AttendanceModal: React.FC<AttendanceModalProps> = ({
  worker,
  isSubmitting,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<sharedTypes.WorkEntry>({
    date: new Date(),
    hours: 0,
    overtime: 0,
    notes: "",
    workerId: worker?.id ?? "",
    siteId: "",
  });

  const [errors, setErrors] = useState<Errors>({});

  const statusOptions = [
    { value: "present", label: "Present" },
    { value: "absent", label: "Absent" },
    { value: "halfday", label: "Half Day" },
    { value: "overtime", label: "Overtime" },
  ];

  const validateForm = (): boolean => {
    const newErrors: Errors = {};

    if (!formData.hours || formData.hours <= 0) {
      newErrors.hours = "Please enter valid hours";
    }

    if (!formData.hours || formData.hours > 24) {
      newErrors.hours = "Hours cannot exceed 24";
    }

    const selectedDate = formData.date ? new Date(formData.date) : null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!selectedDate || selectedDate > today) {
      newErrors.date = "Cannot record attendance for future dates";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        ...formData,
        workerId: worker?.id,
        date: new Date(formData.date),
      });
    }
  };

  const handleChange = (field: keyof sharedTypes.WorkEntry, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors?.[field as keyof Errors]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="fixed inset-0 z-modal flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      {isSubmitting ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              className="opacity-25"
            />
            <path
              fill="currentColor"
              className="opacity-75"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>

          <span className="animate-pulse">Saving attendance...</span>
        </span>
      ) : (
        <div className="bg-card rounded-xl shadow-elevation-5 w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between md:p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src={worker?.imageUrl}
                  alt={worker?.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Record Attendance
                </h3>
                <p className="caption text-muted-foreground text-sm">
                  {worker?.name}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-smooth focus-ring"
              aria-label="Close modal"
            >
              <Icon key="x" name="X" size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-4 space-y-4 md:p-6">
            <Input
              type="date"
              label="Date"
              value={
                formData.date
                  ? new Date(formData.date).toISOString().split("T")[0]
                  : ""
              }
              onChange={(e) => handleChange("date", e.target.value)}
              max={new Date().toISOString().split("T")[0]}
              required
            />
            <Input
              type="number"
              label="Hours Worked"
              placeholder="Enter hours (e.g., 8)"
              value={formData?.hours}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange("hours", e.target.value)
              }
              min={0}
              max={24}
              step={0.5}
              required
            />
            <Input
              type="number"
              label="Overtime Hours"
              placeholder="Enter overtime hours (e.g., 2)"
              value={formData?.overtime}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange("overtime", e.target.value)
              }
              min={0}
              max={24}
              step={0.5}
            />

            <Input
              type="text"
              label="comment (Optional)"
              placeholder="Add any additional notes"
              value={formData?.notes}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange("notes", e.target.value)
              }
            />

            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Wage Rate:</span>
                <span className="data-text font-medium text-foreground">
                  ${worker?.wageRating}/day
                </span>
              </div>

              {formData?.hours && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Estimated Earnings:
                  </span>
                  <span className="data-text font-semibold text-primary">
                    ${((formData?.hours * worker?.wageRating) / 8).toFixed(2)}
                  </span>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" className="">
                Submit
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AttendanceModal;
