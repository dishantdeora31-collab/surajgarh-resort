import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

export default function HeroSection() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  const scrollDown = () => {
    const next = document.getElementById("surajgarh-garden");
    if (next) next.scrollIntoView({ behavior: "smooth" });
    else window.scrollBy({ top: window.innerHeight * 0.9, behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden"
      data-ocid="hero.section"
      style={{
        backgroundImage:
          "url('/assets/generated/resort-hero.dim_1600x900.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Dark overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "rgba(0,0,0,0.54)" }}
      />

      {/* Decorative gold border frame */}
      <div
        className="absolute inset-6 md:inset-12 pointer-events-none rounded-2xl"
        style={{ border: "1px solid rgba(212,175,55,0.2)" }}
      />

      {/* Content */}
      <div
        className="relative z-10 flex flex-col items-center text-center px-4"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(24px)",
          transition: "opacity 1s ease, transform 1s ease",
        }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div
            className="h-px w-16 md:w-24"
            style={{
              background: "linear-gradient(to right, transparent, #D4AF37)",
            }}
          />
          <span style={{ color: "#D4AF37", fontSize: 20 }}>✦</span>
          <div
            className="h-px w-16 md:w-24"
            style={{
              background: "linear-gradient(to left, transparent, #D4AF37)",
            }}
          />
        </div>

        <p
          className="text-xs md:text-sm tracking-[0.4em] uppercase mb-4 font-medium"
          style={{ color: "#D4AF37", opacity: 0.85 }}
        >
          Est. Since 1985
        </p>

        <h1
          className="font-display text-5xl md:text-7xl xl:text-8xl font-bold tracking-tight leading-none mb-4"
          style={{
            color: "#D4AF37",
            textShadow:
              "0 4px 40px rgba(212,175,55,0.45), 0 2px 0 rgba(0,0,0,0.4)",
            letterSpacing: "0.05em",
          }}
        >
          SURAJGARH
        </h1>
        <h2
          className="font-display text-3xl md:text-5xl xl:text-6xl font-light tracking-[0.15em] uppercase mb-6"
          style={{ color: "#FFFDD0", opacity: 0.9 }}
        >
          RESORT
        </h2>

        <div className="flex items-center gap-3 mb-6">
          <div
            className="h-px w-8"
            style={{ background: "#D4AF37", opacity: 0.5 }}
          />
          <p
            className="text-base md:text-xl font-light tracking-[0.2em] uppercase"
            style={{ color: "#FFFDD0", opacity: 0.8 }}
          >
            A Legacy of Celebrations
          </p>
          <div
            className="h-px w-8"
            style={{ background: "#D4AF37", opacity: 0.5 }}
          />
        </div>

        <p
          className="text-sm md:text-base tracking-[0.15em] uppercase mb-10"
          style={{ color: "#D4AF37", opacity: 0.7 }}
        >
          Rajasthan&#39;s Premier Wedding Destination
        </p>

        <button
          type="button"
          onClick={scrollDown}
          className="px-8 py-3 rounded-full font-semibold tracking-widest uppercase text-sm transition-smooth hover:scale-105"
          style={{
            background: "linear-gradient(135deg, #7a5c1e, #D4AF37, #b8960c)",
            color: "#0A0A0A",
            boxShadow: "0 0 24px rgba(212,175,55,0.4)",
          }}
          data-ocid="hero.explore_button"
        >
          Explore Our Venues
        </button>
      </div>

      {/* Scroll indicator */}
      <button
        type="button"
        onClick={scrollDown}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1"
        aria-label="Scroll down"
        data-ocid="hero.scroll_button"
        style={{
          opacity: visible ? 1 : 0,
          transition: "opacity 1.5s ease 0.5s",
        }}
      >
        <span
          className="text-xs tracking-[0.2em] uppercase"
          style={{ color: "rgba(212,175,55,0.6)" }}
        >
          Scroll
        </span>
        <ChevronDown
          size={24}
          style={{ color: "#D4AF37" }}
          className="animate-bounce"
        />
      </button>
    </section>
  );
}
