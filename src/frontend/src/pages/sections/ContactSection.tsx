import { useContentMap } from "@/hooks/useQueries";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

export default function ContactSection() {
  const { get } = useContentMap();

  const phone = get("contactPhone") || "+91 94600 12345";
  const email = get("contactEmail") || "info@surajgarhresort.com";
  const address =
    get("contactAddress") ||
    "Surajgarh Road, Jhunjhunu District, Rajasthan – 333001";

  const [form, setForm] = useState({ name: "", phone: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      toast.error("Please fill in your name and phone number.");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setForm({ name: "", phone: "", message: "" });
      toast.success("Enquiry sent! Our team will contact you soon.", {
        duration: 5000,
      });
    }, 900);
  };

  return (
    <section
      id="contact"
      className="py-20 px-4 md:px-8"
      style={{ background: "rgba(10,10,10,0.95)" }}
      data-ocid="contact.section"
    >
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p
            className="text-xs tracking-[0.4em] uppercase mb-2"
            style={{ color: "#D4AF37", opacity: 0.7 }}
          >
            Get In Touch
          </p>
          <h2
            className="font-display text-3xl md:text-5xl font-bold tracking-wider uppercase"
            style={{
              color: "#D4AF37",
              textShadow: "0 0 24px rgba(212,175,55,0.3)",
            }}
          >
            Contact Us
          </h2>
          <div className="flex items-center gap-3 mt-4 justify-center">
            <div
              className="h-px w-16"
              style={{
                background: "linear-gradient(to right, transparent, #D4AF37)",
              }}
            />
            <span style={{ color: "#D4AF37" }}>✦</span>
            <div
              className="h-px w-16"
              style={{
                background: "linear-gradient(to left, transparent, #D4AF37)",
              }}
            />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Contact details */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-6"
          >
            <p
              className="text-base leading-relaxed"
              style={{ color: "#FFFDD0", opacity: 0.8 }}
            >
              We'd love to hear from you. Whether you're planning a grand
              wedding, a corporate retreat, or a family celebration — our team
              is here to create the experience of a lifetime.
            </p>

            <div className="flex flex-col gap-5 mt-4">
              <ContactItem
                icon={<Phone size={20} />}
                label="Phone"
                value={phone}
                href={`tel:${phone.replace(/\s/g, "")}`}
              />
              <ContactItem
                icon={<Mail size={20} />}
                label="Email"
                value={email}
                href={`mailto:${email}`}
              />
              <ContactItem
                icon={<MapPin size={20} />}
                label="Address"
                value={address}
              />
            </div>

            {/* Working hours */}
            <div
              className="mt-4 rounded-xl p-5"
              style={{
                background: "rgba(212,175,55,0.05)",
                border: "1px solid rgba(212,175,55,0.2)",
              }}
            >
              <p
                className="text-sm font-semibold mb-3 tracking-wider uppercase"
                style={{ color: "#D4AF37" }}
              >
                Working Hours
              </p>
              <div
                className="text-sm space-y-1"
                style={{ color: "#FFFDD0", opacity: 0.75 }}
              >
                <p>Mon – Sat: 9:00 AM – 8:00 PM</p>
                <p>Sunday: 10:00 AM – 6:00 PM</p>
              </div>
            </div>
          </motion.div>

          {/* Enquiry form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col gap-5 rounded-2xl p-6 md:p-8"
            style={{
              background: "rgba(212,175,55,0.04)",
              border: "1px solid rgba(212,175,55,0.2)",
              boxShadow: "0 0 30px rgba(212,175,55,0.04)",
            }}
            data-ocid="contact.enquiry_form"
          >
            <p
              className="font-display text-xl font-semibold tracking-wider"
              style={{ color: "#D4AF37" }}
            >
              Send an Enquiry
            </p>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="contact-name"
                className="text-xs tracking-wider uppercase"
                style={{ color: "rgba(212,175,55,0.7)" }}
              >
                Your Name *
              </label>
              <input
                id="contact-name"
                type="text"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="Enter your full name"
                className="rounded-lg px-4 py-3 text-sm outline-none transition-smooth"
                style={{
                  background: "rgba(10,10,10,0.8)",
                  border: "1px solid rgba(212,175,55,0.25)",
                  color: "#FFFDD0",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "rgba(212,175,55,0.6)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(212,175,55,0.25)";
                }}
                data-ocid="contact.name_input"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="contact-phone"
                className="text-xs tracking-wider uppercase"
                style={{ color: "rgba(212,175,55,0.7)" }}
              >
                Phone Number *
              </label>
              <input
                id="contact-phone"
                type="tel"
                value={form.phone}
                onChange={(e) =>
                  setForm((f) => ({ ...f, phone: e.target.value }))
                }
                placeholder="+91 XXXXX XXXXX"
                className="rounded-lg px-4 py-3 text-sm outline-none transition-smooth"
                style={{
                  background: "rgba(10,10,10,0.8)",
                  border: "1px solid rgba(212,175,55,0.25)",
                  color: "#FFFDD0",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "rgba(212,175,55,0.6)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(212,175,55,0.25)";
                }}
                data-ocid="contact.phone_input"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="contact-message"
                className="text-xs tracking-wider uppercase"
                style={{ color: "rgba(212,175,55,0.7)" }}
              >
                Message
              </label>
              <textarea
                id="contact-message"
                value={form.message}
                onChange={(e) =>
                  setForm((f) => ({ ...f, message: e.target.value }))
                }
                placeholder="Tell us about your event or enquiry..."
                rows={4}
                className="rounded-lg px-4 py-3 text-sm outline-none transition-smooth resize-none"
                style={{
                  background: "rgba(10,10,10,0.8)",
                  border: "1px solid rgba(212,175,55,0.25)",
                  color: "#FFFDD0",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "rgba(212,175,55,0.6)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(212,175,55,0.25)";
                }}
                data-ocid="contact.message_textarea"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-1 flex items-center justify-center gap-2 rounded-full py-3 font-semibold tracking-widest uppercase text-sm transition-smooth hover:scale-105 disabled:opacity-60"
              style={{
                background: submitting
                  ? "rgba(212,175,55,0.3)"
                  : "linear-gradient(135deg, #7a5c1e, #D4AF37, #b8960c)",
                color: "#0A0A0A",
                boxShadow: submitting
                  ? "none"
                  : "0 0 20px rgba(212,175,55,0.35)",
              }}
              data-ocid="contact.submit_button"
            >
              {submitting ? (
                <span className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
              ) : (
                <Send size={16} />
              )}
              {submitting ? "Sending..." : "Send Enquiry"}
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}

function ContactItem({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <div className="flex items-start gap-4">
      <div
        className="mt-0.5 p-2.5 rounded-xl flex-shrink-0"
        style={{ background: "rgba(212,175,55,0.1)", color: "#D4AF37" }}
      >
        {icon}
      </div>
      <div>
        <p
          className="text-xs tracking-wider uppercase mb-1"
          style={{ color: "rgba(212,175,55,0.6)" }}
        >
          {label}
        </p>
        <p
          className="text-sm leading-relaxed"
          style={{ color: "#FFFDD0", opacity: 0.85 }}
        >
          {value}
        </p>
      </div>
    </div>
  );

  if (href) {
    return (
      <a href={href} className="transition-smooth hover:opacity-80">
        {content}
      </a>
    );
  }
  return <div>{content}</div>;
}
