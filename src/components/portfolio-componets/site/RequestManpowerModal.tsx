import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Check } from "lucide-react";
import type { JSX } from "react";

import { SERVICE_CATEGORIES } from "../../../lib/siteData";

const STEPS = ["Requirement", "Workforce", "Schedule", "Review"] as const;

interface FormData {
  company: string;
  contact: string;
  phone: string;
  email: string;
  projectType: string;
  workers: string;
  category: string;
  startDate: string;
  location: string;
  message: string;
}

type FormField = keyof FormData;

const INITIAL_FORM: FormData = {
  company: "",
  contact: "",
  phone: "",
  email: "",
  projectType: "",
  workers: "",
  category: "",
  startDate: "",
  location: "",
  message: "",
};

const RequestManpowerModal: React.FC = (): JSX.Element => {
  const [open, setOpen] = useState<boolean>(false);
  const [step, setStep] = useState<number>(0);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [form, setForm] = useState<FormData>(INITIAL_FORM);

  useEffect(() => {
    const handler = (): void => {
      setSubmitted(false);
      setStep(0);
      setForm(INITIAL_FORM);
      setOpen(true);
    };

    window.addEventListener("open-request-modal", handler);

    return () => {
      window.removeEventListener("open-request-modal", handler);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const set =
    (key: FormField) =>
    (
      event: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ): void => {
      setForm((previous) => ({
        ...previous,
        [key]: event.target.value,
      }));
    };

  const next = (): void => {
    setStep((current) => Math.min(current + 1, STEPS.length - 1));
  };

  const back = (): void => {
    setStep((current) => Math.max(current - 1, 0));
  };

  const submit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setSubmitted(true);
  };

  const field = (
    label: string,
    name: FormField,
    type: React.HTMLInputTypeAttribute = "text",
    required: boolean = true,
  ): JSX.Element => (
    <label className="block">
      <span className="font-mono text-[11px] uppercase tracking-wider text-steel">
        {label}
      </span>

      <input
        type={type}
        value={form[name]}
        onChange={set(name)}
        required={required}
        className="mt-1.5 w-full border-0 border-b-2 border-onyx/15 bg-transparent py-2.5 text-onyx outline-none focus:border-amber"
      />
    </label>
  );

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] grid place-items-center bg-onyx/80 p-4 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            onClick={(event) => event.stopPropagation()}
            className="relative grid max-h-[90vh] w-full max-w-2xl grid-cols-1 overflow-hidden bg-titanium text-onyx md:grid-cols-3"
          >
            {/* Left information panel */}
            <div className="hidden flex-col justify-between bg-onyx p-6 text-titanium girder-lines md:flex">
              <div>
                <span className="grid h-9 w-9 place-items-center bg-amber font-display text-lg text-onyx">
                  A
                </span>

                <p className="mt-5 font-display text-lg uppercase leading-tight">
                  Manpower Requisition
                </p>

                <p className="mt-2 text-xs text-titanium/60">
                  Tell us what you need. We deploy verified workers across the
                  UAE.
                </p>
              </div>

              <div className="space-y-2">
                <p className="font-mono text-[11px] uppercase text-amber/80">
                  Live availability
                </p>

                {[
                  "50+ General Helpers",
                  "30+ Skilled Tradesmen",
                  "20+ Cleaning Staff",
                ].map((text) => (
                  <p
                    key={text}
                    className="flex items-center gap-2 text-xs text-titanium/70"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-amber" />
                    {text}
                  </p>
                ))}
              </div>
            </div>

            {/* Form panel */}
            <div className="overflow-y-auto p-6 md:col-span-2 sm:p-8">
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="absolute right-4 top-4 grid h-9 w-9 place-items-center border border-onyx/15 transition-colors hover:bg-onyx hover:text-titanium"
              >
                <X className="h-4 w-4" />
              </button>

              {submitted ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <span className="grid h-16 w-16 place-items-center bg-amber text-onyx">
                    <Check className="h-8 w-8" />
                  </span>

                  <h3 className="mt-6 font-display text-2xl uppercase">
                    Request Received
                  </h3>

                  <p className="mt-3 max-w-xs text-sm text-steel">
                    Thank you, {form.contact || "partner"}. Our team will
                    contact you within 24 hours to confirm deployment details.
                  </p>

                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="mechanical-hover mt-6 bg-onyx px-6 py-3 text-xs font-bold uppercase tracking-wider text-titanium"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={submit}>
                  {/* Step indicator */}
                  <div className="mb-6 flex items-center gap-2">
                    {STEPS.map((stepName, index) => (
                      <div key={stepName} className="flex items-center gap-2">
                        <span
                          className={`h-2 w-2 ${
                            index <= step ? "bg-amber" : "bg-onyx/15"
                          }`}
                        />

                        {index < STEPS.length - 1 && (
                          <span className="h-px w-4 bg-onyx/15" />
                        )}
                      </div>
                    ))}

                    <span className="ml-2 font-mono text-[11px] uppercase text-steel">
                      {STEPS[step]} · {String(step + 1).padStart(2, "0")}/
                      {String(STEPS.length).padStart(2, "0")}
                    </span>
                  </div>

                  {/* Step 1 */}
                  {step === 0 && (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {field("Company Name", "company")}
                      {field("Contact Person", "contact")}
                      {field("Phone", "phone", "tel")}
                      {field("Email", "email", "email")}
                    </div>
                  )}

                  {/* Step 2 */}
                  {step === 1 && (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {field("Project Type", "projectType")}
                      {field("Required Workers", "workers")}

                      <label className="block">
                        <span className="font-mono text-[11px] uppercase tracking-wider text-steel">
                          Worker Category
                        </span>

                        <select
                          value={form.category}
                          onChange={set("category")}
                          className="mt-1.5 w-full border-0 border-b-2 border-onyx/15 bg-transparent py-2.5 text-onyx outline-none focus:border-amber"
                        >
                          <option value="">Select category</option>

                          {SERVICE_CATEGORIES.map((service) => (
                            <option key={service.id} value={service.title}>
                              {service.title}
                            </option>
                          ))}
                        </select>
                      </label>

                      {field("Location", "location")}
                    </div>
                  )}

                  {/* Step 3 */}
                  {step === 2 && (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {field("Start Date", "startDate", "date")}

                      <label className="block sm:col-span-2">
                        <span className="font-mono text-[11px] uppercase tracking-wider text-steel">
                          Message
                        </span>

                        <textarea
                          value={form.message}
                          onChange={set("message")}
                          rows={4}
                          className="mt-1.5 w-full resize-none border-0 border-b-2 border-onyx/15 bg-transparent py-2.5 text-onyx outline-none focus:border-amber"
                        />
                      </label>
                    </div>
                  )}

                  {/* Step 4 */}
                  {step === 3 && (
                    <div className="space-y-3">
                      <p className="font-mono text-[11px] uppercase text-steel">
                        Review your request
                      </p>

                      <dl className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
                        {Object.entries(form).map(([key, value]) =>
                          value ? (
                            <div
                              key={key}
                              className="flex justify-between gap-3 border-b border-onyx/10 pb-1"
                            >
                              <dt className="text-xs capitalize text-steel">
                                {key}
                              </dt>

                              <dd className="text-right font-medium text-onyx">
                                {value}
                              </dd>
                            </div>
                          ) : null,
                        )}
                      </dl>
                    </div>
                  )}

                  {/* Navigation */}
                  <div className="mt-8 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={back}
                      disabled={step === 0}
                      className="text-xs font-bold uppercase tracking-wider text-steel hover:text-onyx disabled:opacity-30"
                    >
                      ← Back
                    </button>

                    {step < STEPS.length - 1 ? (
                      <button
                        type="button"
                        onClick={next}
                        className="mechanical-hover bg-amber px-6 py-3 text-xs font-bold uppercase tracking-wider text-onyx shadow-[3px_3px_0_0_hsl(var(--onyx))]"
                      >
                        Continue →
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="mechanical-hover bg-amber px-6 py-3 text-xs font-bold uppercase tracking-wider text-onyx shadow-[3px_3px_0_0_hsl(var(--onyx))]"
                      >
                        Submit Request
                      </button>
                    )}
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RequestManpowerModal;
