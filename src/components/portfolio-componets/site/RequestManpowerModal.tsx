import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Check, Loader2 } from "lucide-react";
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

// Web3Forms access key.
// Add this to your .env file:
//
// VITE_WEB3FORMS_ACCESS_KEY=your_access_key
//
const WEB3FORMS_ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY as
  | string
  | undefined;

const RequestManpowerModal: React.FC = (): JSX.Element => {
  const [open, setOpen] = useState<boolean>(false);
  const [step, setStep] = useState<number>(0);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [form, setForm] = useState<FormData>(INITIAL_FORM);

  /*
   * Listen for the custom event that opens the manpower request modal.
   */
  useEffect(() => {
    const handler = (): void => {
      setSubmitted(false);
      setSubmitting(false);
      setError("");
      setStep(0);
      setForm(INITIAL_FORM);
      setOpen(true);
    };

    window.addEventListener("open-request-modal", handler);

    return () => {
      window.removeEventListener("open-request-modal", handler);
    };
  }, []);

  /*
   * Prevent background scrolling while modal is open.
   */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  /*
   * Update form values.
   */
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

      if (error) {
        setError("");
      }
    };

  /*
   * Validate the current step before allowing the user to continue.
   */
  const validateCurrentStep = (): boolean => {
    setError("");

    if (step === 0) {
      if (
        !form.company.trim() ||
        !form.contact.trim() ||
        !form.phone.trim() ||
        !form.email.trim()
      ) {
        setError("Please complete all required contact details.");
        return false;
      }

      if (!/^\S+@\S+\.\S+$/.test(form.email)) {
        setError("Please enter a valid email address.");
        return false;
      }
    }

    if (step === 1) {
      if (
        !form.projectType.trim() ||
        !form.workers.trim() ||
        !form.category.trim() ||
        !form.location.trim()
      ) {
        setError("Please complete all workforce requirements.");
        return false;
      }
    }

    if (step === 2) {
      if (!form.startDate.trim() || !form.message.trim()) {
        setError("Please provide the start date and project message.");
        return false;
      }
    }

    return true;
  };

  /*
   * Move to the next step.
   */
  const next = (): void => {
    if (!validateCurrentStep()) {
      return;
    }

    setStep((current) => Math.min(current + 1, STEPS.length - 1));
  };

  /*
   * Move back one step.
   */
  const back = (): void => {
    setError("");

    setStep((current) => Math.max(current - 1, 0));
  };

  /*
   * Submit request to Web3Forms.
   */
  const submit = async (
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    setError("");

    /*
     * Final validation.
     */
    if (
      !form.company.trim() ||
      !form.contact.trim() ||
      !form.phone.trim() ||
      !form.email.trim() ||
      !form.projectType.trim() ||
      !form.workers.trim() ||
      !form.category.trim() ||
      !form.startDate.trim() ||
      !form.location.trim() ||
      !form.message.trim()
    ) {
      setError("Please complete all required fields before submitting.");
      return;
    }

    /*
     * Make sure the Web3Forms key exists.
     */
    if (!WEB3FORMS_ACCESS_KEY) {
      setError(
        "The contact form is not configured yet. Please add VITE_WEB3FORMS_ACCESS_KEY to your environment variables.",
      );
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        access_key: WEB3FORMS_ACCESS_KEY,

        subject: `New Manpower Request — ${form.company || "Website Enquiry"}`,

        from_name: "AFRIC TECH SOLUTIONS Website",

        replyto: form.email,

        email: form.email,

        company: form.company,
        contact: form.contact,
        phone: form.phone,
        projectType: form.projectType,
        workers: form.workers,
        category: form.category,
        startDate: form.startDate,
        location: form.location,
        message: form.message,

        /*
         * Web3Forms spam protection.
         */
        botcheck: false,
      };

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "We could not send your request. Please try again.",
        );
      }

      /*
       * Submission succeeded.
       */
      setSubmitted(true);
    } catch (submissionError) {
      console.error("Web3Forms submission error:", submissionError);

      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Something went wrong while sending your request. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  /*
   * Reusable form field.
   */
  const field = (
    label: string,
    name: FormField,
    type: React.HTMLInputTypeAttribute = "text",
    required: boolean = true,
  ): JSX.Element => (
    <label className="block">
      <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-slate-500">
        {label}
        {required && <span className="ml-1 text-amber-400">*</span>}
      </span>

      <input
        type={type}
        name={name}
        value={form[name]}
        onChange={set(name)}
        required={required}
        disabled={submitting}
        className="mt-1.5 w-full rounded border border-slate-700 bg-slate-900/80 px-3 py-2.5 text-slate-200 outline-none transition-colors placeholder:text-slate-600 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/20 disabled:cursor-not-allowed disabled:opacity-60"
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
          className="fixed inset-0 z-[70] grid place-items-center bg-slate-950/85 p-4 backdrop-blur-md"
          onClick={() => {
            if (!submitting) {
              setOpen(false);
            }
          }}
        >
          <motion.div
            initial={{
              opacity: 0,
              y: 24,
              scale: 0.98,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 24,
              scale: 0.98,
            }}
            transition={{ duration: 0.25 }}
            onClick={(event) => event.stopPropagation()}
            className="relative grid max-h-[92vh] w-full max-w-3xl grid-cols-1 overflow-hidden rounded border border-slate-800 bg-slate-950 text-slate-100 shadow-[0_30px_100px_rgba(0,0,0,0.55)] md:grid-cols-3"
          >
            {/* =========================================================
                LEFT INFORMATION PANEL
            ========================================================== */}
            <div className="hidden flex-col justify-between border-r border-slate-800 bg-slate-950 p-6 md:flex">
              <div>
                {/* Logo / Brand mark */}
                <span className="grid h-10 w-10 place-items-center bg-amber-400 font-display text-lg font-bold text-slate-950 shadow-[3px_3px_0_0_rgba(148,163,184,0.2)]">
                  A
                </span>

                <p className="mt-6 font-display text-xl uppercase leading-tight text-slate-100">
                  Manpower
                  <br />
                  Requisition
                </p>

                <p className="mt-3 text-xs leading-5 text-slate-400">
                  Tell us what you need. We deploy verified workers across the
                  UAE with speed and supervision.
                </p>
              </div>

              {/* Availability */}
              <div className="space-y-4">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-amber-400">
                  Live availability
                </p>

                {[
                  ["50+", "General Helpers"],
                  ["30+", "Skilled Tradesmen"],
                  ["20+", "Cleaning Staff"],
                ].map(([number, text]) => (
                  <div
                    key={text}
                    className="flex items-center gap-3 border-b border-slate-800 pb-3 last:border-0"
                  >
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-40" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-400" />
                    </span>

                    <span className="min-w-[45px] font-display text-lg font-bold text-amber-400">
                      {number}
                    </span>

                    <span className="text-xs text-slate-400">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* =========================================================
                FORM PANEL
            ========================================================== */}
            <div className="relative overflow-y-auto bg-slate-900/95 p-6 sm:p-8 md:col-span-2">
              {/* Close button */}
              <button
                type="button"
                onClick={() => {
                  if (!submitting) {
                    setOpen(false);
                  }
                }}
                aria-label="Close manpower request form"
                disabled={submitting}
                className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded border border-slate-700 text-slate-400 transition-colors hover:border-amber-400 hover:text-amber-400 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <X className="h-4 w-4" />
              </button>

              {/* =======================================================
                  SUCCESS STATE
              ======================================================== */}
              {submitted ? (
                <div className="flex min-h-[500px] flex-col items-center justify-center px-4 py-12 text-center">
                  <span className="grid h-16 w-16 place-items-center bg-amber-400 text-slate-950 shadow-[4px_4px_0_0_rgba(148,163,184,0.2)]">
                    <Check className="h-8 w-8" />
                  </span>

                  <h3 className="mt-6 font-display text-2xl uppercase tracking-wide text-slate-100">
                    Request Received
                  </h3>

                  <p className="mt-3 max-w-sm text-sm leading-6 text-slate-400">
                    Thank you,{" "}
                    <span className="font-medium text-slate-200">
                      {form.contact || "partner"}
                    </span>
                    . Your manpower request has been sent successfully. Our team
                    will contact you within 24 hours.
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      setSubmitted(false);
                      setStep(0);
                      setForm(INITIAL_FORM);
                      setError("");
                    }}
                    className="mechanical-hover mt-7 border border-slate-700 bg-slate-950 px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-300 transition-colors hover:border-amber-400 hover:text-amber-400"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={submit}>
                  {/* ===================================================
                      STEP INDICATOR
                  ==================================================== */}
                  <div className="mb-8 flex items-center gap-2 pr-8">
                    {STEPS.map((stepName, index) => (
                      <div key={stepName} className="flex items-center gap-2">
                        <span
                          className={`h-2.5 w-2.5 rounded-full transition-colors ${
                            index <= step ? "bg-amber-400" : "bg-slate-700"
                          }`}
                        />

                        {index < STEPS.length - 1 && (
                          <span
                            className={`h-px w-5 transition-colors ${
                              index < step ? "bg-amber-400" : "bg-slate-700"
                            }`}
                          />
                        )}
                      </div>
                    ))}

                    <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.15em] text-slate-500">
                      {STEPS[step]} · {String(step + 1).padStart(2, "0")}/
                      {String(STEPS.length).padStart(2, "0")}
                    </span>
                  </div>

                  {/* ===================================================
                      STEP 1 — REQUIREMENT / CONTACT
                  ==================================================== */}
                  {step === 0 && (
                    <div className="grid gap-5 sm:grid-cols-2">
                      {field("Company Name", "company", "text", true)}

                      {field("Contact Person", "contact", "text", true)}

                      {field("Phone", "phone", "tel", true)}

                      {field("Email", "email", "email", true)}
                    </div>
                  )}

                  {/* ===================================================
                      STEP 2 — WORKFORCE
                  ==================================================== */}
                  {step === 1 && (
                    <div className="grid gap-5 sm:grid-cols-2">
                      {field("Project Type", "projectType", "text", true)}

                      {field("Required Workers", "workers", "number", true)}

                      {/* Worker category */}
                      <label className="block">
                        <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-slate-500">
                          Worker Category
                          <span className="ml-1 text-amber-400">*</span>
                        </span>

                        <select
                          name="category"
                          value={form.category}
                          onChange={set("category")}
                          required
                          disabled={submitting}
                          className="mt-1.5 w-full rounded border border-slate-700 bg-slate-900/90 px-3 py-2.5 text-slate-200 outline-none transition-colors focus:border-amber-400 focus:ring-1 focus:ring-amber-400/20 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <option value="">Select category</option>

                          {SERVICE_CATEGORIES.map((service) => (
                            <option key={service.id} value={service.title}>
                              {service.title}
                            </option>
                          ))}
                        </select>
                      </label>

                      {field("Location", "location", "text", true)}
                    </div>
                  )}

                  {/* ===================================================
                      STEP 3 — SCHEDULE
                  ==================================================== */}
                  {step === 2 && (
                    <div className="grid gap-5 sm:grid-cols-2">
                      {field("Start Date", "startDate", "date", true)}

                      <label className="block sm:col-span-2">
                        <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-slate-500">
                          Message
                          <span className="ml-1 text-amber-400">*</span>
                        </span>

                        <textarea
                          name="message"
                          value={form.message}
                          onChange={set("message")}
                          rows={5}
                          required
                          disabled={submitting}
                          placeholder="Tell us about your project, worker requirements, shift details, accommodation, transport, or any other relevant information..."
                          className="mt-1.5 w-full resize-none rounded border border-slate-700 bg-slate-900/80 px-3 py-2.5 text-slate-200 outline-none transition-colors placeholder:text-slate-600 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/20 disabled:cursor-not-allowed disabled:opacity-60"
                        />
                      </label>
                    </div>
                  )}

                  {/* ===================================================
                      STEP 4 — REVIEW
                  ==================================================== */}
                  {step === 3 && (
                    <div className="space-y-5">
                      <div>
                        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-amber-400">
                          Review your request
                        </p>

                        <p className="mt-2 text-sm text-slate-400">
                          Please verify the information below before sending
                          your manpower request.
                        </p>
                      </div>

                      <dl className="grid gap-x-6 gap-y-3 rounded border border-slate-800 bg-slate-950/60 p-5 text-sm sm:grid-cols-2">
                        {Object.entries(form).map(([key, value]) =>
                          value ? (
                            <div
                              key={key}
                              className="border-b border-slate-800 pb-2 last:border-0"
                            >
                              <dt className="font-mono text-[10px] uppercase tracking-wider text-slate-500">
                                {key.replace(/([A-Z])/g, " $1").trim()}
                              </dt>

                              <dd className="mt-1 break-words font-medium text-slate-200">
                                {value}
                              </dd>
                            </div>
                          ) : null,
                        )}
                      </dl>
                    </div>
                  )}

                  {/* ===================================================
                      ERROR MESSAGE
                  ==================================================== */}
                  {error && (
                    <div
                      role="alert"
                      className="mt-5 border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm leading-5 text-red-300"
                    >
                      {error}
                    </div>
                  )}

                  {/* ===================================================
                      NAVIGATION
                  ==================================================== */}
                  <div className="mt-8 flex items-center justify-between border-t border-slate-800 pt-6">
                    <button
                      type="button"
                      onClick={back}
                      disabled={step === 0 || submitting}
                      className="text-xs font-bold uppercase tracking-wider text-slate-500 transition-colors hover:text-slate-200 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      ← Back
                    </button>

                    {step < STEPS.length - 1 ? (
                      <button
                        type="button"
                        onClick={next}
                        disabled={submitting}
                        className="mechanical-hover bg-amber-400 px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-950 shadow-[4px_4px_0_0_rgba(148,163,184,0.2)] transition-colors hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Continue →
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={submitting}
                        className="mechanical-hover flex min-w-[160px] items-center justify-center gap-2 bg-amber-400 px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-950 shadow-[4px_4px_0_0_rgba(148,163,184,0.2)] transition-colors hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          "Submit Request"
                        )}
                      </button>
                    )}
                  </div>

                  {/* Web3Forms honeypot */}
                  <input
                    type="checkbox"
                    name="botcheck"
                    className="hidden"
                    style={{ display: "none" }}
                    tabIndex={-1}
                    autoComplete="off"
                  />
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
