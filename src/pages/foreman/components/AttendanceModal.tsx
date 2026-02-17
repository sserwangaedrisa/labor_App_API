import React, { useState } from 'react';
import Icon from '../../../components/ui/AppIconl';
import Image from '../../../components/ui/AppImage';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

interface Worker {
  id: number | string;
  name: string;
  avatar?: string;
  avatarAlt?: string;
  wageRate: number;
}


interface FormData {
  date: string;
  hours: string;
  status: string;
  notes: string;
  workerId?: string | number;
  workerName?: string;
}

interface Errors {
  date?: string;
  hours?: string;
}
interface AttendanceModalProps {
  worker: Worker;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
}


const AttendanceModal: React.FC<AttendanceModalProps> = ({
  worker,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<FormData>({
    date: new Date().toISOString().split('T')[0],
    hours: '',
    status: 'present',
    notes:'',
  });

  const [errors, setErrors] = useState<Errors>({});

  const statusOptions = [
    { value: 'present', label: 'Present' },
    { value: 'absent', label: 'Absent' },
    { value: 'halfday', label: 'Half Day' },
    { value: 'overtime', label: 'Overtime' },
  ];

  const validateForm = (): boolean => {
    const newErrors: Errors = {};

    if (!formData.hours || parseFloat(formData.hours) <= 0) {
      newErrors.hours = 'Please enter valid hours';
    }

    if (parseFloat(formData.hours) > 24) {
      newErrors.hours = 'Hours cannot exceed 24';
    }

    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate > today) {
      newErrors.date = 'Cannot record attendance for future dates';
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
        workerName: worker?.name,
      });
      onClose();
    }
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors?.[field as keyof Errors]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 z-modal flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="bg-card rounded-xl shadow-elevation-5 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between md:p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
              <Image
                src={worker?.avatar}
                alt={worker?.avatarAlt}
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
            <Icon key = "x" name="X" size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4 md:p-6">
          <Input
            type="date"
            label="Date"
            value={formData?.date}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChange('date', e.target.value)
            }
            error={errors?.date}
            max={new Date().toISOString().split('T')[0]}
            required
          />

          <Select
            label="Status"
            options={statusOptions}
            value={formData?.status}
            onChange={(value: string) => handleChange('status', value)}
            required
          />

          <Input
            type="number"
            label="Hours Worked"
            placeholder="Enter hours (e.g., 8)"
            value={formData?.hours}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChange('hours', e.target.value)
            }
            error={errors?.hours}
            min="0"
            max="24"
            step="0.5"
            required
            description="Enter hours worked for the selected date"
          />

          <Input
            type="text"
            label="Notes (Optional)"
            placeholder="Add any additional notes"
            value={formData?.notes}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChange('notes', e.target.value)
            }
          />

          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Wage Rate:</span>
              <span className="data-text font-medium text-foreground">
                ${worker?.wageRate}/day
              </span>
            </div>

            {formData?.hours && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Estimated Earnings:
                </span>
                <span className="data-text font-semibold text-primary">
                  $
                  {(
                    parseFloat(formData?.hours) *
                    (worker?.wageRate / 8)
                  ).toFixed(2)}
                </span>
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className=''
            >
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AttendanceModal;
