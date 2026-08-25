import { useState } from "react";
import type { ChangeEvent, FormEvent, JSX } from "react";
import { motion } from "framer-motion";
import {
  Phone,
  Mail,
  Clock,
  MessageCircle,
  Check,
  type LucideIcon,
} from "lucide-react";

import { COMPANY, SERVICE_CATEGORIES } from "../../lib/siteData";
import PageHero from "../../components/portfolio-componets/site/PageHero";
import SectionHeading from "../../components/portfolio-componets/site/SectionHeading";

interface ContactForm {
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

type FormFieldName = keyof ContactForm;

interface ContactCard {
  icon: LucideIcon;
  label: string;
  value: string;
  href?: string;
}

const CARDS: ContactCard[] = [
  {
    icon: Phone,
    label: "Phone",
    value: COMPANY.phone,
    href: `tel:${COMPANY.phoneRaw}`,
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: COMPANY.phone,
    href: `https://wa.me/${COMPANY.whatsapp}`,
  },
  {
    icon: Mail,
    label: "Email",
    value: COMPANY.email,
    href: `mailto:${COMPANY.email}`,
  },
  {
    icon: Clock,
    label: "Business Hours",
    value: COMPANY.hours,
  },
];

const INITIAL_FORM: ContactForm = {
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

// Web3Forms uses the access key on the client side.
// Create the key at https://web3forms.com/ and add it to your .env file as:
// VITE_WEB3FORMS_ACCESS_KEY=your_access_key
const WEB3FORMS_ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;
const Contact = (): JSX.Element => {
  const [sent, setSent] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [form, setForm] = useState<ContactForm>(INITIAL_FORM);

  const set =
    (key: FormFieldName) =>
    (
      event: ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >,
    ): void => {
      setForm((current) => ({
        ...current,
        [key]: event.target.value,
      }));

      if (error) {
        setError("");
      }
    };

  const field = (
    label: string,
    name: FormFieldName,
    type: string = "text",
    required = false,
  ): JSX.Element => (
    <label className="block">
      <span className="font-mono text-[11px] uppercase tracking-wider text-slate-500">
        {label}
      </span>

      <input
        type={type}
        name={name}
        value={form[name]}
        onChange={set(name)}
        required={required}
        className="mt-1.5 w-full rounded border border-slate-700 bg-transparent py-2.5 text-slate-200 outline-none transition-colors placeholder:text-slate-600 focus:border-amber-400"
      />
    </label>
  );

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();
    setError("");

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

      setSent(true);
      setForm(INITIAL_FORM);
    } catch (submissionError) {
      console.error("Web3Forms submission error:", submissionError);

      setError(
        submissionError instanceof Error
          ? "Something went wrong while sending your request. Please Try Again."
          : "Something went wrong while sending your request. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHero
        index="06"
        kicker="Contact Us"
        title=""
        subtitle=""
        tone="light"
        bgImage="src/assets/contactUsCoverPic.png"
      />

      {/* Contact cards */}
      <section className="bg-slate-300 text-onyx shadow-md shadow-black/20">
        <div className="mx-auto grid max-w-[120rem] gap-px bg-onyx/10 px-5 py-16 sm:grid-cols-2 lg:grid-cols-4 lg:px-10">
          {CARDS.map((card) => {
            const Icon = card.icon;

            const content = (
              <div className="mr-4 group h-fit rounded-md bg-slate-400/90 p-6 transition-colors hover:bg-slate-400/50">
                <Icon className="h-7 w-7 text-green-500/90 group-hover:text-onyx" />

                <p className="mt-4 font-mono text-[11px] uppercase tracking-wider text-slate-600 group-hover:text-onyx/70">
                  {card.label}
                </p>

                <p className="mt-1 break-words font-medium text-slate-800">
                  {card.value}
                </p>
              </div>
            );

            if (card.href) {
              return (
                <a
                  key={card.label}
                  href={card.href}
                  target={card.href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    card.href.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                >
                  {content}
                </a>
              );
            }

            return <div key={card.label}>{content}</div>;
          })}
        </div>
      </section>

      {/* Form + availability */}
      <section className="relative overflow-hidden border-t border-slate-800 bg-slate-950 text-slate-100">
        {/* Background atmosphere */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(51,65,85,0.35),transparent_35%),radial-gradient(circle_at_85%_80%,rgba(30,41,59,0.5),transparent_40%)]" />

        {/* Industrial line pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 girder-lines" />
        </div>

        {/* Subtle vertical divider */}
        <div className="absolute left-1/2 top-0 hidden h-full w-px bg-slate-800 lg:block" />

        <div className="relative mx-auto grid max-w-[120rem] gap-12 px-5 py-20 lg:grid-cols-12 lg:px-10">
          {/* LEFT SIDE */}
          <div className="lg:col-span-5">
            <SectionHeading
              index="01"
              kicker="Lead Form"
              title="Get in Touch"
              tone="light"
            />

            <p className="mt-5 max-w-xl leading-7 text-slate-400">
              Fill in your requirements and our team will respond within 24
              hours to confirm availability and deployment.
            </p>

            {/* Availability panel */}
            <div className="mt-8 border border-slate-800 bg-slate-900/70 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.25)]">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-amber-400">
                Live availability
              </p>

              <div className="mt-5 space-y-4">
                {[
                  ["50+", "General Helpers ready"],
                  ["30+", "Skilled Tradesmen ready"],
                  ["20+", "Cleaning Staff ready"],
                ].map(([number, text]) => (
                  <div
                    key={text}
                    className="flex items-center gap-4 border-b border-slate-800 pb-4 last:border-0 last:pb-0"
                  >
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-40" />
                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-amber-400" />
                    </span>

                    <span className="min-w-[55px] font-display text-xl font-bold text-amber-400">
                      {number}
                    </span>

                    <span className="text-sm text-slate-400">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Small supporting panel */}
            <div className="mt-5 flex items-center gap-4 border border-slate-800 bg-slate-900/40 p-5">
              <div className="h-10 w-1 bg-amber-400" />

              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">
                  Deployment Response
                </p>

                <p className="mt-1 text-sm text-slate-300">
                  Fast manpower coordination for active projects.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE / FORM */}
          <div className="lg:col-span-7">
            {sent ? (
              <div className="border border-amber-400/50 bg-slate-900 p-10 text-center shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
                <span className="mx-auto grid h-14 w-14 place-items-center bg-amber-400 text-slate-950">
                  <Check className="h-7 w-7" />
                </span>

                <h3 className="mt-5 font-display text-2xl uppercase tracking-wide text-slate-100">
                  Request Received
                </h3>

                <p className="mt-3 text-slate-400">
                  Thank you, {form.contact || "partner"}. Your manpower request
                  has been sent successfully. Our team will contact you within
                  24 hours.
                </p>

                <button
                  type="button"
                  onClick={() => setSent(false)}
                  className="mt-7 border border-slate-700 px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-300 transition-colors hover:border-amber-400 hover:text-amber-400"
                >
                  Send Another Request
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="grid gap-5 rounded border border-slate-800 bg-slate-500/30 p-6 shadow-[0_25px_70px_rgba(0,0,0,0.35)] sm:grid-cols-2 lg:p-8"
              >
                {/* Web3Forms spam honeypot */}
                <input
                  type="checkbox"
                  name="botcheck"
                  className="hidden"
                  style={{ display: "none" }}
                  tabIndex={-1}
                  autoComplete="off"
                />

                {field("Company Name", "company", "text", true)}

                {field("Contact Person", "contact", "text", true)}

                {field("Phone", "phone", "tel", true)}

                {field("Email", "email", "email", true)}

                {field("Project Type", "projectType", "text", true)}

                {field("Required Workers", "workers", "number", true)}

                {/* Worker Category */}
                <label className="block">
                  <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-slate-500">
                    Worker Category
                  </span>

                  <select
                    name="category"
                    value={form.category}
                    onChange={set("category")}
                    required
                    className="mt-1.5 w-full rounded border border-slate-700 bg-slate-900/90 py-2.5 text-slate-200 outline-none transition-colors focus:border-amber-400"
                  >
                    <option value="">Select category</option>

                    {SERVICE_CATEGORIES.map((service) => (
                      <option key={service.id} value={service.title}>
                        {service.title}
                      </option>
                    ))}
                  </select>
                </label>

                {field("Start Date", "startDate", "date", true)}

                {/* Location */}
                <label className="block sm:col-span-2">
                  <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-slate-500">
                    Location
                  </span>

                  <input
                    type="text"
                    name="location"
                    value={form.location}
                    onChange={set("location")}
                    required
                    className="mt-1.5 w-full rounded border border-slate-700 bg-transparent py-2.5 text-slate-200 outline-none transition-colors placeholder:text-slate-600 focus:border-amber-400"
                  />
                </label>

                {/* Message */}
                <label className="block sm:col-span-2">
                  <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-slate-500">
                    Message
                  </span>

                  <textarea
                    name="message"
                    value={form.message}
                    onChange={set("message")}
                    rows={4}
                    required
                    className="mt-1.5 w-full resize-none rounded border border-slate-700 bg-transparent py-2.5 text-slate-200 outline-none transition-colors placeholder:text-slate-600 focus:border-amber-400"
                  />
                </label>

                {/* Error */}
                {error && (
                  <div
                    role="alert"
                    className="sm:col-span-2 border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
                  >
                    {error}
                  </div>
                )}

                {/* Submit */}
                <div className="pt-2 sm:col-span-2">
                  <motion.button
                    whileHover={!submitting ? { x: -2, y: -2 } : undefined}
                    type="submit"
                    disabled={submitting}
                    className="mechanical-hover w-full bg-amber-400 px-6 py-4 text-sm font-bold uppercase tracking-[0.15em] text-slate-950 shadow-[4px_4px_0_0_rgba(148,163,184,0.25)] transition-colors hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? "Sending Request..." : "Request Manpower →"}
                  </motion.button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
