import type { JSX } from "react";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";

import { TESTIMONIALS } from "../../../lib/siteData";
import SectionHeading from "../site/SectionHeading";

const TestimonialsSection = (): JSX.Element => {
  return (
    <section className="bg-titanium text-onyx">
      <div className="mx-auto max-w-[120rem] px-5 py-20 lg:px-10 lg:py-32">
        <SectionHeading index="06" kicker="Proof" title="Client Testimonials" />

        <div className="mt-12 grid gap-px bg-onyx/10 md:grid-cols-3">
          {TESTIMONIALS.map((testimonial, index) => (
            <motion.figure
              key={index}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.4,
                delay: index * 0.1,
              }}
              className="flex flex-col gap-5 bg-titanium p-7"
            >
              <Quote className="h-8 w-8 text-amber" />

              <blockquote className="text-lg leading-relaxed text-onyx">
                "{testimonial.quote}"
              </blockquote>

              <figcaption className="mt-auto border-t border-onyx/10 pt-4">
                <p className="font-display text-sm uppercase">
                  {testimonial.author}
                </p>

                <p className="font-mono text-[11px] uppercase tracking-wider text-steel">
                  {testimonial.role}
                </p>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
