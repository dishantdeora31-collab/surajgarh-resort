import { useSubmitInquiry } from "@/hooks/useInquiries";
import { useState } from "react";

const GOLD = "#D4AF37";

const INQUIRY_TYPES = [
  "Venue Booking",
  "Room Booking",
  "Wedding Package",
  "General Inquiry",
  "Other",
];

const inputClass =
  "w-full px-4 py-3 rounded-xl text-sm outline-none transition-all placeholder:text-stone-500";
const inputStyle = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(212,175,55,0.25)",
  color: "#FFFDD0",
};
const inputFocusStyle = {
  border: `1px solid ${GOLD}`,
  boxShadow: "0 0 0 2px rgba(212,175,55,0.15)",
};

function GoldInput({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const id = label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-xs tracking-widest uppercase font-semibold"
        style={{ color: GOLD, opacity: 0.8 }}
      >
        {label}
        {required && " *"}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={inputClass}
        style={focused ? { ...inputStyle, ...inputFocusStyle } : inputStyle}
      />
    </div>
  );
}

function OrnamentDivider() {
  return (
    <div className="flex items-center gap-4 justify-center">
      <div
        className="h-px w-24"
        style={{
          background: "linear-gradient(to right, transparent, #D4AF37)",
        }}
      />
      <span style={{ color: GOLD, fontSize: 18 }}>✦</span>
      <div
        className="h-px w-24"
        style={{
          background: "linear-gradient(to left, transparent, #D4AF37)",
        }}
      />
    </div>
  );
}

export default function InquirySection() {
  const submitInquiry = useSubmitInquiry();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    inquiryType: "Venue Booking",
    message: "",
  });
  const [showThankYou, setShowThankYou] = useState(false);
  const [selectFocused, setSelectFocused] = useState(false);
  const [textareaFocused, setTextareaFocused] = useState(false);

  function set(k: keyof typeof form, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (
      !form.name.trim() ||
      !form.phone.trim() ||
      !form.email.trim() ||
      !form.message.trim()
    )
      return;
    try {
      await submitInquiry.mutateAsync(form);
      setShowThankYou(true);
      setForm({
        name: "",
        phone: "",
        email: "",
        inquiryType: "Venue Booking",
        message: "",
      });
    } catch {
      // silently fail
    }
  }

  return (
    <>
      <section
        id="inquiry"
        data-ocid="inquiry.section"
        className="py-16 px-4 md:px-8 relative overflow-hidden"
        style={{ background: "#0a0a0a" }}
      >
        {/* Background glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] blur-[120px] opacity-10 pointer-events-none"
          style={{ background: GOLD }}
        />

        <div className="max-w-2xl mx-auto relative">
          {/* Heading */}
          <div className="text-center mb-10">
            <p
              className="text-xs tracking-[0.4em] uppercase mb-3"
              style={{ color: GOLD, opacity: 0.7 }}
            >
              Get In Touch
            </p>
            <h2
              className="font-display text-3xl md:text-4xl font-bold tracking-widest uppercase mb-4"
              style={{
                color: GOLD,
                textShadow: "0 0 24px rgba(212,175,55,0.35)",
              }}
            >
              Make an Enquiry
            </h2>
            <OrnamentDivider />
            <p
              className="mt-5 text-sm leading-relaxed"
              style={{ color: "#FFFDD0", opacity: 0.65 }}
            >
              Share your vision with us and our team will curate an
              unforgettable celebration tailored for you.
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-5"
            data-ocid="inquiry.form"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <GoldInput
                label="Customer Name"
                value={form.name}
                onChange={(v) => set("name", v)}
                placeholder="Your full name"
                required
              />
              <GoldInput
                label="Phone Number"
                type="tel"
                value={form.phone}
                onChange={(v) => set("phone", v)}
                placeholder="+91 XXXXX XXXXX"
                required
              />
            </div>

            <GoldInput
              label="Email Address"
              type="email"
              value={form.email}
              onChange={(v) => set("email", v)}
              placeholder="your@email.com"
              required
            />

            {/* Select */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="inquiry-type"
                className="text-xs tracking-widest uppercase font-semibold"
                style={{ color: GOLD, opacity: 0.8 }}
              >
                Inquiry Type
              </label>
              <select
                id="inquiry-type"
                value={form.inquiryType}
                onChange={(e) => set("inquiryType", e.target.value)}
                onFocus={() => setSelectFocused(true)}
                onBlur={() => setSelectFocused(false)}
                data-ocid="inquiry.type_select"
                className={inputClass}
                style={
                  selectFocused
                    ? { ...inputStyle, ...inputFocusStyle }
                    : inputStyle
                }
              >
                {INQUIRY_TYPES.map((t) => (
                  <option key={t} value={t} style={{ background: "#1a1a1a" }}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Textarea */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="inquiry-message"
                className="text-xs tracking-widest uppercase font-semibold"
                style={{ color: GOLD, opacity: 0.8 }}
              >
                Message *
              </label>
              <textarea
                id="inquiry-message"
                value={form.message}
                onChange={(e) => set("message", e.target.value)}
                placeholder="Tell us about your event, preferred dates, number of guests..."
                rows={4}
                required
                onFocus={() => setTextareaFocused(true)}
                onBlur={() => setTextareaFocused(false)}
                data-ocid="inquiry.message_textarea"
                className={`${inputClass} resize-none`}
                style={
                  textareaFocused
                    ? { ...inputStyle, ...inputFocusStyle }
                    : inputStyle
                }
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitInquiry.isPending}
              data-ocid="inquiry.submit_button"
              className="w-full py-4 rounded-xl font-display font-bold tracking-[0.15em] uppercase text-sm transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
              style={{
                background: `linear-gradient(135deg, ${GOLD}, #b8941f)`,
                color: "#0a0a0a",
                boxShadow: submitInquiry.isPending
                  ? "none"
                  : "0 4px 24px rgba(212,175,55,0.35)",
              }}
            >
              {submitInquiry.isPending ? "Sending Enquiry..." : "Send Enquiry"}
            </button>
          </form>
        </div>
      </section>

      {/* Thank-you modal */}
      {showThankYou && (
        <div
          className="fixed inset-0 z-[9998] flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.85)" }}
          data-ocid="inquiry.dialog"
        >
          <div
            className="w-full max-w-md p-8 rounded-2xl flex flex-col items-center gap-6 text-center relative"
            style={{
              background: "#0f0f0f",
              border: `1px solid ${GOLD}`,
              boxShadow: "0 0 60px rgba(212,175,55,0.2)",
            }}
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
              style={{
                background: "rgba(212,175,55,0.1)",
                border: "1px solid rgba(212,175,55,0.4)",
              }}
            >
              ✉️
            </div>
            <div>
              <h3
                className="font-display text-2xl font-bold tracking-wider mb-3"
                style={{ color: GOLD }}
              >
                Thank You!
              </h3>
              <OrnamentDivider />
              <p
                className="mt-4 text-sm leading-relaxed"
                style={{ color: "#FFFDD0", opacity: 0.8 }}
              >
                Your enquiry has been received.
                <br />
                Our team will contact you within 24 hours.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowThankYou(false)}
              data-ocid="inquiry.close_button"
              className="px-8 py-3 rounded-xl font-display font-bold tracking-widest uppercase text-sm transition-all hover:scale-[1.02]"
              style={{
                background: `linear-gradient(135deg, ${GOLD}, #b8941f)`,
                color: "#0a0a0a",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
