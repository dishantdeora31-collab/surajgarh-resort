import ParticleField from "@/components/ParticleField";
import { useSiteConfigContext } from "@/context/SiteConfigContext";
import { motion } from "motion/react";

const navLinks = [
  { label: "Story", href: "#story" },
  { label: "Regions", href: "#regions" },
  { label: "Evolution", href: "#evolution" },
  { label: "Bestiary", href: "#bestiary" },
  { label: "Combat", href: "#combat" },
];

const glowPulse = [
  "0 0 30px oklch(0.65 0.22 60 / 0.4), 0 0 80px oklch(0.65 0.22 60 / 0.2)",
  "0 0 60px oklch(0.65 0.22 60 / 0.85), 0 0 120px oklch(0.65 0.22 60 / 0.45), 0 0 180px oklch(0.65 0.22 60 / 0.25)",
  "0 0 30px oklch(0.65 0.22 60 / 0.4), 0 0 80px oklch(0.65 0.22 60 / 0.2)",
];

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export default function FooterSection() {
  const { siteConfig } = useSiteConfigContext();
  const year = new Date().getFullYear();
  const utmLink = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
    typeof window !== "undefined" ? window.location.hostname : "",
  )}`;
  const socialLinks = siteConfig?.socialLinks ?? [];

  return (
    <footer
      id="footer"
      data-ocid="footer.section"
      className="relative overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, oklch(0.12 0 0) 0%, oklch(0.10 0.02 270) 50%, oklch(0.08 0 0) 100%)",
      }}
    >
      <ParticleField
        count={50}
        className="absolute inset-0 w-full h-full opacity-40"
      />

      {/* Top border shimmer */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, oklch(0.65 0.22 60 / 0.6), oklch(0.50 0.18 270 / 0.3), transparent)",
        }}
      />

      {/* Central ambient glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] blur-[120px] opacity-12 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, oklch(0.65 0.22 60 / 0.25) 0%, transparent 70%)",
        }}
      />

      {/* Big tagline CTA */}
      <div className="relative border-b border-border/20 py-24">
        <div className="container max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
          >
            <p className="text-xs font-display font-semibold tracking-[0.4em] uppercase text-primary/60 mb-8">
              VAMP-X: ASCENT
            </p>

            {/* FIGHT. EVOLVE. ASCEND. — breathing gold glow */}
            <motion.h2
              className="font-display font-bold text-5xl sm:text-7xl lg:text-8xl tracking-[0.06em] uppercase mb-8"
              style={{ color: "oklch(0.65 0.22 60)" }}
              animate={{ textShadow: glowPulse }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              Fight. Evolve. Ascend.
            </motion.h2>

            <p className="text-muted-foreground text-lg leading-relaxed max-w-xl mx-auto mb-10">
              The collapse has begun. Heaven awaits. Your journey from human to
              cosmic entity starts now.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                type="button"
                data-ocid="footer.preorder_button"
                onClick={() => scrollTo("hero")}
                className="px-10 py-4 font-display font-bold text-sm tracking-widest uppercase rounded-sm
                  gradient-divine text-background shadow-glow-divine transition-smooth
                  hover:scale-105 hover:shadow-[0_0_80px_oklch(0.65_0.22_60/0.6)] active:scale-95"
              >
                Pre-Order Now
              </button>
              <button
                type="button"
                data-ocid="footer.watchtrailer_button"
                onClick={() => scrollTo("hero")}
                className="px-10 py-4 font-display font-semibold text-sm tracking-widest uppercase rounded-sm
                  border border-primary/40 text-primary bg-primary/5 backdrop-blur-sm transition-smooth
                  hover:bg-primary/15 hover:border-primary/80 active:scale-95"
              >
                Watch Trailer
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer bottom bar */}
      <div className="relative container max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-1">
            <span
              className="font-display font-bold text-xl tracking-wider"
              style={{
                color: "oklch(0.65 0.22 60)",
                textShadow: "0 0 16px oklch(0.65 0.22 60 / 0.5)",
              }}
            >
              VAMP-X: ASCENT
            </span>
            <span className="text-xs font-display tracking-[0.2em] uppercase text-muted-foreground">
              All rights reserved
            </span>
          </div>

          <nav
            className="flex flex-wrap gap-4 justify-center"
            aria-label="Footer navigation"
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                data-ocid={`footer.nav.${link.label.toLowerCase()}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo(link.href.slice(1));
                }}
                className="text-xs font-display font-semibold tracking-[0.15em] uppercase text-muted-foreground hover:text-primary transition-smooth"
              >
                {link.label}
              </a>
            ))}
            {socialLinks.map((sl) => (
              <a
                key={sl.id}
                href={sl.url}
                data-ocid={`footer.social.${sl.platform.toLowerCase()}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-display font-semibold tracking-[0.15em] uppercase text-primary/70 hover:text-primary transition-smooth"
              >
                {sl.linkLabel || sl.platform}
              </a>
            ))}
          </nav>

          <p className="text-xs text-muted-foreground/60 text-center">
            © {year}.{" "}
            <a
              href={utmLink}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-smooth"
            >
              Built with love using caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
