import React, { useState, useEffect, useRef } from "react";
import Header from "../components/ui/LandingPageNav";
import {
  Phone,
  Mail,
  MapPin,
  Briefcase,
  Users,
  Award,
  Hammer,
  PaintRoller,
  Wrench,
  HardHat,
  Sparkles,
  ChevronRight,
  Calendar,
  Send,
} from "lucide-react";

const LandingPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState("home");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [formSent, setFormSent] = useState(false);

  // Refs for sections
  const homeRef = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const servicesRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setFormSent(true);
    setTimeout(() => setFormSent(false), 3000);
    setFormData({ name: "", email: "", phone: "", message: "" });
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const sections = ["home", "about", "services", "contact"];
    const observers: IntersectionObserver[] = [];

    sections.forEach((sectionId) => {
      const element = document.getElementById(sectionId);
      if (element) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                setActiveSection(sectionId);
              } else if (activeSection === sectionId) {
                setActiveSection(activeSection);
              }
            });
          },
          { threshold: 0.3, rootMargin: "-80px 0px 0px 0px" },
        );
        observer.observe(element);
        observers.push(observer);
      }
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  const navItems = [
    { id: "home", label: "Home", ref: homeRef },
    { id: "about", label: "About", ref: aboutRef },
    { id: "services", label: "Services", ref: servicesRef },
    { id: "contact", label: "Contact", ref: contactRef },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      {/* <nav className="fixed w-full bg-white/90 backdrop-blur-md shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <HardHat className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                Ailam Labor Supply
              </span>
            </div>
            <div className="hidden md:flex space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`transition ${
                    activeSection === item.id
                      ? "text-blue-600 font-semibold border-b-2 border-blue-600"
                      : "text-gray-700 hover:text-blue-600"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={handleLogin}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Staff Login
            </button>
          </div>
        </div>
      </nav> */}
      <div>
        <Header />
      </div>

      {/* Hero Section */}
      <section
        id="home"
        ref={homeRef}
        className="relative h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight text-orange-500">
            <span className="text-orange-400"> Skilled Labor Supply for</span>
            <span className="text-blue-400"> UAE's Construction Leaders</span>
          </h1>
          <p className="mt-6 text-center text-lg md:text-xl text-gray-200 max-w-3xl mx-auto">
            We provide vetted masons, electricians, carpenters, steel fixers,
            and housekeepers to top construction companies across the UAE.
            Precision, professionalism, and scale.
          </p>
          <div className="mt-10 flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => scrollToSection("contact")}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center"
            >
              Request Labor <ChevronRight className="ml-2 h-5 w-5" />
            </button>
            <button
              onClick={() => scrollToSection("services")}
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition"
            >
              Our Services
            </button>
          </div>
          <div className="mt-12 flex flex-wrap justify-center gap-8 text-base text-gray-200">
            <div className="flex items-center">
              <Award className="h-5 w-5 text-blue-400 mr-2" /> 5+ Years
            </div>
            <div className="flex items-center">
              <Users className="h-5 w-5 text-blue-400 mr-2" /> 1000+ Workers
            </div>
          </div>
        </div>
      </section>

      {/* About Us */}
      <section
        id="about"
        ref={aboutRef}
        className="py-20 bg-white scroll-mt-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-orange-400">
              About Ailam Labor Supply
            </h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto mt-4 rounded-full"></div>
          </div>
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="lg:w-1/2">
              <p className="text-gray-600 text-center text-lg leading-relaxed">
                Since 2019, Ailam Labor Supply has been the trusted partner for
                major UAE construction firms including
                <span className="font-semibold">
                  {" "}
                  Binghatti, DAMAC, Emaar, and ALEC
                </span>
                . We specialize in subcontracting skilled labor for critical
                construction phases — from foundation to finishing.
              </p>
              <p className="mt-4 text-gray-600 text-lg leading-relaxed">
                With a workforce exceeding{" "}
                <span className="font-bold text-blue-600">
                  1,000 skilled professionals
                </span>{" "}
                and growing, we combine operational precision with deep industry
                experience. Our weapon: organization, professionalism, and the
                ability to scale without compromising quality.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-xl text-center">
                  <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="font-bold text-2xl">5+</div>
                  <div className="text-gray-600">Years Excellence</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-xl text-center">
                  <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="font-bold text-2xl">1000+</div>
                  <div className="text-gray-600">Skilled Workers</div>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2 grid grid-cols-2 gap-4">
              <img
                src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                className="rounded-xl shadow-md h-48 w-full object-cover"
                alt="Construction site"
              />
              <img
                src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                className="rounded-xl shadow-md h-48 w-full object-cover"
                alt="Electrician"
              />
              <img
                src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                className="rounded-xl shadow-md h-48 w-full object-cover mt-8"
                alt="Mason"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section
        id="services"
        ref={servicesRef}
        className="py-20 bg-gradient-to-b from-gray-50 to-white scroll-mt-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-orange-900">
              Our Services
            </h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto mt-4 rounded-full"></div>
            <p className="mt-4 text-center text-gray-600 max-w-2xl mx-auto">
              Two flexible engagement models tailored to your project needs.
            </p>
          </div>

          <div className="space-y-16">
            {/* Labor Supply Services - Brighter cards */}
            <div>
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-base font-semibold">
                  <Users className="h-4 w-4" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mt-3">
                  Labor Supply Services
                </h3>
                <p className="text-gray-600 max-w-2xl mx-auto mt-2 text-center">
                  We supply skilled and unskilled workers directly to your site
                  — daily, weekly, or long-term. You manage the tasks, we
                  provide the manpower.
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {laborSupplyServices.map((service, idx) => (
                  <div
                    key={idx}
                    className="relative rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group min-h-[240px]"
                  >
                    {/* Brighter background: lighter overlay + white tint */}
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                      style={{ backgroundImage: `url(${service.bgImage})` }}
                    />
                    <div className="absolute inset-0 group-hover:bg-black/15 transition-colors" />
                    {/* White semi-transparent card inner for extra brightness */}
                    <div className="relative z-10 p-6 h-full flex flex-col">
                      <div className="w-12 h-12 bg-white/30 rounded-lg flex items-center justify-center text-white mb-4">
                        {service.icon}
                      </div>
                      <h3 className="w-fit text-xl text-center font-semibold mb-2 text-orange-300 backdrop-blur-sm">
                        {service.title}
                      </h3>
                      <p className="text-gray-100 text-base leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Subcontracting Services - Single background image covering all cards */}
            <div className="pt-8 border-t border-gray-200">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-base font-semibold">
                  <Briefcase className="h-4 w-4" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mt-3">
                  Subcontracting Services
                </h3>
                <p className="text-gray-600 text-center max-w-2xl mx-auto mt-2">
                  We take full responsibility for specific construction packages
                  — from planning to handover. Quality, schedule, and site
                  management included.
                </p>
              </div>
              {/* Container with single background image (contract signing) */}
              <div className="relative rounded-2xl overflow-hidden">
                {/* Dark overlay for readability */}
                <div className="absolute inset-0"></div>
                <div className="relative z-10 p-8">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {subcontractingServices.map((service, idx) => (
                      <div
                        key={idx}
                        className="bg-black/10 rounded-xl p-6 hover:bg-black/20 transition-all duration-300 border border-white/10"
                      >
                        <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center text-gray-500 mb-4">
                          {service.icon}
                        </div>
                        <h3 className="text-xl font-semibold mb-2 text-orange-300">
                          {service.title}
                        </h3>
                        <p className="text-gray-600 text-base leading-relaxed">
                          {service.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Call to action */}
          <div className="mt-16 text-center bg-blue-50 rounded-2xl p-8">
            <p className="text-gray-800 text-lg font-medium">
              Not sure which model fits your project?
            </p>
            <button
              onClick={() => scrollToSection("contact")}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition inline-flex items-center"
            >
              Contact us for a consultation{" "}
              <ChevronRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Clients & Stats */}
      <section className="py-16 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-semibold text-gray-800">
              Trusted by leading construction companies
            </h3>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {[
              "Binghatti",
              "DAMAC",
              "Emaar",
              "ALEC",
              "Al Habtoor",
              "Brookfield",
            ].map((client) => (
              <div
                key={client}
                className="text-gray-500 font-bold text-xl md:text-2xl tracking-tight opacity-70 hover:opacity-100 transition"
              >
                {client}
              </div>
            ))}
          </div>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-6 bg-blue-50 rounded-2xl">
              <div className="text-4xl font-bold text-blue-600">100%</div>
              <div className="text-gray-700 mt-2">
                Compliance with UAE labor laws
              </div>
            </div>
            <div className="p-6 bg-blue-50 rounded-2xl">
              <div className="text-4xl font-bold text-blue-600">24/7</div>
              <div className="text-gray-700 mt-2">
                Site support & foreman coordination
              </div>
            </div>
            <div className="p-6 bg-blue-50 rounded-2xl">
              <div className="text-4xl font-bold text-blue-600">7 Days</div>
              <div className="text-gray-700 mt-2">
                Average mobilization time
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        ref={contactRef}
        className="py-20 bg-gray-50 scroll-mt-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Get in Touch
            </h2>
            <p className="mt-4 text-gray-600">
              Need skilled labor for your next project? Let's talk.
            </p>
          </div>
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="lg:w-1/2 space-y-6">
              <div className="flex items-start space-x-4">
                <MapPin className="h-6 w-6 text-blue-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900">Visit Us</h4>
                  <p className="text-gray-600">
                    Sharjah, UAE
                    <br />
                    Industrial Area 13, near Sharjah Airport Road
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Phone className="h-6 w-6 text-blue-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900">Call Us</h4>
                  <p className="text-gray-600">+971 55 532 3454</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Mail className="h-6 w-6 text-blue-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900">Email</h4>
                  <p className="text-gray-600">ailam@gmail.com</p>
                </div>
              </div>
              <div className="mt-8 bg-white p-6 rounded-xl shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Working Hours
                </h4>
                <p className="text-gray-600">
                  Sunday - Thursday: 8:00 AM - 6:00 PM
                  <br />
                  Friday: Closed
                  <br />
                  Saturday: By appointment
                </p>
              </div>
            </div>
            <div className="lg:w-1/2">
              <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-xl shadow-md space-y-4"
              >
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Message / Labor Requirement
                  </label>
                  <textarea
                    rows={4}
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center"
                >
                  {formSent ? "Sent ✓" : "Send Message"}{" "}
                  <Send className="ml-2 h-4 w-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center">
              <HardHat className="h-6 w-6 text-blue-400" />
              <span className="ml-2 text-lg font-bold text-white">
                Ailam Labor Supply
              </span>
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="hover:text-white transition"
                >
                  {item.label}
                </button>
              ))}
            </div>
            <p className="text-base mt-4 md:mt-0">
              © {new Date().getFullYear()} Ailam Labor Supply. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Labor Supply Services (brighter cards)
const laborSupplyServices = [
  {
    title: "Masons",
    description:
      "Experienced block layers, plasterers, and tile fixers for structural and finishing work.",
    icon: <Wrench className="h-6 w-6" />,
    bgImage:
      "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Electricians",
    description:
      "Licensed electricians for wiring, panels, lighting, and MEP works.",
    icon: <Sparkles className="h-6 w-6" />,
    bgImage:
      "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Carpenters (Formwork & Finish)",
    description:
      "Formwork, shuttering, finish carpentry, and furniture installation.",
    icon: <Hammer className="h-6 w-6" />,
    bgImage:
      "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Steel Fixers",
    description:
      "Rebar placement, tying, and reinforcement for concrete structures.",
    icon: <HardHat className="h-6 w-6" />,
    bgImage:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Painters",
    description:
      "Cleaning, site maintenance, and post-construction tidy-up crews.",
    icon: <PaintRoller className="h-6 w-6" />,
    bgImage:
      "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "General Laborers",
    description:
      "Skilled and semi-skilled workers for material handling, excavation support, and site assistance.",
    icon: <Users className="h-6 w-6" />,
    bgImage:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
];

// Subcontracting Services (no individual bg images, container handles it)
const subcontractingServices = [
  {
    title: "Plastering Works",
    description:
      "Complete internal and external plastering for residential and commercial projects.",
    icon: <Briefcase className="h-6 w-6" />,
  },
  {
    title: "Steel Fixing",
    description:
      "Rebar placement, tying, and reinforcement as a subcontract package.",
    icon: <HardHat className="h-6 w-6" />,
  },
  {
    title: "Carpentry & Shuttering",
    description:
      "Full formwork, shuttering, and false ceiling carpentry subcontracting.",
    icon: <Hammer className="h-6 w-6" />,
  },
  {
    title: "MEP Rough-ins",
    description:
      "Electrical and plumbing rough-in works for villa and building projects.",
    icon: <Wrench className="h-6 w-6" />,
  },
  {
    title: "Block & Masonry Works",
    description:
      "Complete blockwork, masonry, and stone cladding subcontracting.",
    icon: <Hammer className="h-6 w-6" />,
  },
  {
    title: "Finishing Packages",
    description:
      "Painting, tiling, and flooring finishing works on subcontract basis.",
    icon: <PaintRoller className="h-6 w-6" />,
  },
];

export default LandingPage;
