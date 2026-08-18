import { useState } from "react";
import type { JSX } from "react";
import { motion } from "framer-motion";
import {
  Phone,
  Mail,
  MapPin,
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
    icon: MapPin,
    label: "Office",
    value: COMPANY.office,
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

const Contact = (): JSX.Element => {
  const [sent, setSent] = useState<boolean>(false);
  const [form, setForm] = useState<ContactForm>(INITIAL_FORM);

  const set =
    (key: FormFieldName) =>
    (
      event: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >,
    ): void => {
      setForm((current) => ({
        ...current,
        [key]: event.target.value,
      }));
    };

  const field = (
    label: string,
    name: FormFieldName,
    type: string = "text",
  ): JSX.Element => (
    <label className="block">
      <span className="font-mono text-[11px] uppercase tracking-wider text-steel">
        {label}
      </span>

      <input
        type={type}
        value={form[name]}
        onChange={set(name)}
        className="mt-1.5 w-full border-0 border-b-2 border-onyx/15 bg-transparent py-2.5 text-onyx outline-none focus:border-amber"
      />
    </label>
  );

  return (
    <>
      <PageHero
        index="06"
        kicker="Contact Us"
        title="Request Manpower"
        subtitle="Tell us what you need. Our team deploys verified workers across the UAE — fast, reliably, and legally."
        tone="light"
      />

      {/* Contact cards */}
      <section className="bg-titanium text-onyx">
        <div className="mx-auto grid max-w-[120rem] gap-px bg-onyx/10 px-5 py-16 sm:grid-cols-2 lg:grid-cols-5 lg:px-10">
          {CARDS.map((card) => {
            const Icon = card.icon;

            const content = (
              <div className="group h-full bg-titanium p-6 transition-colors hover:bg-amber">
                <Icon className="h-7 w-7 text-amber group-hover:text-onyx" />

                <p className="mt-4 font-mono text-[11px] uppercase tracking-wider text-steel group-hover:text-onyx/70">
                  {card.label}
                </p>

                <p className="mt-1 break-words font-medium">{card.value}</p>
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
      <section className="relative overflow-hidden bg-onyx text-titanium">
        <div className="absolute inset-0 girder-lines" />

        <div className="relative mx-auto grid max-w-[120rem] gap-12 px-5 py-20 lg:grid-cols-12 lg:px-10">
          <div className="lg:col-span-5">
            <SectionHeading
              index="01"
              kicker="Lead Form"
              title="Get in Touch"
              tone="light"
            />

            <p className="mt-5 text-titanium/70">
              Fill in your requirements and our team will respond within 24
              hours to confirm availability and deployment.
            </p>

            <div className="mt-8 space-y-3">
              <p className="font-mono text-[11px] uppercase tracking-wider text-amber/80">
                Live availability
              </p>

              {[
                ["50+", "General Helpers ready"],
                ["30+", "Skilled Tradesmen ready"],
                ["20+", "Cleaning Staff ready"],
              ].map(([number, text]) => (
                <div key={text} className="flex items-center gap-3 text-sm">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-amber" />

                  <span className="font-display text-amber">{number}</span>

                  <span className="text-titanium/60">{text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7">
            {sent ? (
              <div className="border border-amber p-10 text-center">
                <span className="mx-auto grid h-14 w-14 place-items-center bg-amber text-onyx">
                  <Check className="h-7 w-7" />
                </span>

                <h3 className="mt-5 font-display text-2xl uppercase">
                  Request Received
                </h3>

                <p className="mt-3 text-titanium/70">
                  Thank you, {form.contact || "partner"}. Our team will contact
                  you within 24 hours.
                </p>
              </div>
            ) : (
              <form
                onSubmit={(event: React.FormEvent<HTMLFormElement>): void => {
                  event.preventDefault();
                  setSent(true);
                }}
                className="grid gap-5 sm:grid-cols-2"
              >
                {field("Company Name", "company")}

                {field("Contact Person", "contact")}

                {field("Phone", "phone", "tel")}

                {field("Email", "email", "email")}

                {field("Project Type", "projectType")}

                {field("Required Workers", "workers")}

                <label className="block">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-steel">
                    Worker Category
                  </span>

                  <select
                    value={form.category}
                    onChange={set("category")}
                    className="mt-1.5 w-full border-0 border-b-2 border-onyx/15 bg-onyx py-2.5 text-titanium outline-none focus:border-amber"
                  >
                    <option value="">Select category</option>

                    {SERVICE_CATEGORIES.map((service) => (
                      <option key={service.id} value={service.title}>
                        {service.title}
                      </option>
                    ))}
                  </select>
                </label>

                {field("Start Date", "startDate", "date")}

                <label className="block sm:col-span-2">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-steel">
                    Location
                  </span>

                  <input
                    value={form.location}
                    onChange={set("location")}
                    className="mt-1.5 w-full border-0 border-b-2 border-onyx/15 bg-transparent py-2.5 text-titanium outline-none focus:border-amber"
                  />
                </label>

                <label className="block sm:col-span-2">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-steel">
                    Message
                  </span>

                  <textarea
                    value={form.message}
                    onChange={set("message")}
                    rows={4}
                    className="mt-1.5 w-full resize-none border-0 border-b-2 border-onyx/15 bg-transparent py-2.5 text-titanium outline-none focus:border-amber"
                  />
                </label>

                <div className="sm:col-span-2">
                  <motion.button
                    whileHover={{ x: -2, y: -2 }}
                    type="submit"
                    className="mechanical-hover w-full bg-amber px-6 py-4 text-sm font-bold uppercase tracking-wider text-onyx shadow-[4px_4px_0_0_hsl(var(--titanium)/0.2)]"
                  >
                    Request Manpower →
                  </motion.button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="bg-titanium">
        <div className="mx-auto max-w-[120rem] px-5 py-12 lg:px-10">
          <div className="aspect-[16/7] w-full overflow-hidden border border-onyx/10">
            <iframe
              title="AFRIC TECH SOLUTIONS location"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(
                COMPANY.mapQuery,
              )}&output=embed`}
              className="h-full w-full grayscale"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
