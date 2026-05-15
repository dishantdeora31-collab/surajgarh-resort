import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const navLinks = [
  { label: "Venues", href: "#venues" },
  { label: "Rooms", href: "#rooms" },
  { label: "Gallery", href: "#gallery" },
  { label: "Contact", href: "#contact" },
];

function scrollTo(id: string) {
  document
    .getElementById(id.replace("#", ""))
    ?.scrollIntoView({ behavior: "smooth" });
}

export default function SiteNav({ onAdminOpen }: { onAdminOpen: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dotMenuOpen, setDotMenuOpen] = useState(false);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dotRef.current && !dotRef.current.contains(e.target as Node)) {
        setDotMenuOpen(false);
      }
    };
    if (dotMenuOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [dotMenuOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
        data-ocid="nav.header"
        className={`fixed top-0 left-0 right-0 z-50 transition-smooth ${
          scrolled
            ? "bg-card/90 border-b border-border/60 backdrop-blur-md shadow-subtle"
            : "bg-transparent"
        }`}
      >
        <div className="container max-w-6xl mx-auto px-6 h-14 sm:h-16 flex items-center justify-between gap-6">
          {/* Brand */}
          <button
            type="button"
            data-ocid="nav.brand"
            onClick={() => scrollTo("hero")}
            className="font-display font-bold text-lg sm:text-xl tracking-[0.15em] text-primary text-glow-gold transition-smooth hover:scale-105"
          >
            SURAJGARH RESORT
          </button>

          {/* Desktop nav */}
          <nav
            className="hidden sm:flex items-center gap-1"
            aria-label="Main navigation"
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                data-ocid={`nav.link.${link.label.toLowerCase()}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo(link.href);
                }}
                className="px-3 py-2 text-xs font-body font-bold tracking-[0.14em] uppercase text-muted-foreground hover:text-primary transition-smooth rounded-sm hover:bg-primary/8"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right side: CTA + three-dot */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              type="button"
              data-ocid="nav.enquire_button"
              onClick={() => scrollTo("contact")}
              className="px-4 py-2 text-xs font-body font-bold tracking-widest uppercase rounded-sm
                gradient-divine text-background shadow-glow-sm transition-smooth
                hover:scale-105 hover:shadow-glow-divine active:scale-95"
            >
              Enquire Now
            </button>

            {/* Three-dot menu */}
            <div className="relative" ref={dotRef}>
              <button
                type="button"
                data-ocid="nav.dot_menu_button"
                aria-label="More options"
                aria-expanded={dotMenuOpen}
                onClick={() => setDotMenuOpen((v) => !v)}
                className="flex flex-col items-center justify-center gap-[3px] w-8 h-8 rounded hover:bg-primary/10 transition-smooth text-muted-foreground hover:text-primary"
              >
                <span className="block w-1 h-1 rounded-full bg-current" />
                <span className="block w-1 h-1 rounded-full bg-current" />
                <span className="block w-1 h-1 rounded-full bg-current" />
              </button>
              <AnimatePresence>
                {dotMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -4 }}
                    transition={{ duration: 0.15 }}
                    data-ocid="nav.dot_menu"
                    className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-border/60 bg-card/95 backdrop-blur-md shadow-subtle overflow-hidden z-60"
                  >
                    <button
                      type="button"
                      data-ocid="nav.admin_panel_button"
                      onClick={() => {
                        setDotMenuOpen(false);
                        onAdminOpen();
                      }}
                      className="w-full px-4 py-3 text-sm font-display font-semibold tracking-wide text-foreground hover:bg-primary/10 hover:text-primary transition-smooth text-left flex items-center gap-2"
                    >
                      <span className="text-primary">⚙</span>
                      Admin Panel
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile menu toggle */}
          <button
            type="button"
            data-ocid="nav.mobile_menu_toggle"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className="sm:hidden flex flex-col gap-1.5 p-2 rounded text-foreground hover:text-primary transition-smooth"
          >
            <span
              className={`block w-5 h-0.5 bg-current transition-smooth ${mobileOpen ? "rotate-45 translate-y-2" : ""}`}
            />
            <span
              className={`block w-5 h-0.5 bg-current transition-smooth ${mobileOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`block w-5 h-0.5 bg-current transition-smooth ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`}
            />
          </button>
        </div>
      </motion.header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            data-ocid="nav.mobile_menu"
            className="fixed inset-0 z-40 bg-background/98 backdrop-blur-xl sm:hidden flex flex-col"
          >
            <div className="container px-6 pt-20 pb-8 flex flex-col gap-2">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  data-ocid={`nav.mobile_link.${link.label.toLowerCase()}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setMobileOpen(false);
                    setTimeout(() => scrollTo(link.href), 200);
                  }}
                  className="py-4 text-lg font-display font-bold tracking-wide text-foreground hover:text-primary border-b border-primary/20 transition-smooth"
                >
                  {link.label}
                </motion.a>
              ))}
              <motion.button
                type="button"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.49 }}
                onClick={() => {
                  setMobileOpen(false);
                  setTimeout(() => scrollTo("contact"), 200);
                }}
                data-ocid="nav.mobile_enquire_button"
                className="mt-6 py-4 font-body font-bold tracking-widest uppercase rounded-sm gradient-divine text-background shadow-glow-sm"
              >
                Enquire Now
              </motion.button>
              <motion.button
                type="button"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.56 }}
                onClick={() => {
                  setMobileOpen(false);
                  onAdminOpen();
                }}
                data-ocid="nav.mobile_admin_button"
                className="mt-2 py-3 font-display font-semibold tracking-wide text-sm border border-border/40 rounded-sm text-muted-foreground hover:text-primary transition-smooth"
              >
                ⚙ Admin Panel
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
