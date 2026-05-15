import { motion } from "motion/react";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  titleGlow?: "gold" | "purple" | "none";
}

export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "center",
  titleGlow = "gold",
}: SectionHeaderProps) {
  const alignClass =
    align === "center" ? "text-center items-center" : "text-left items-start";
  const glowClass =
    titleGlow === "gold"
      ? "text-glow-divine"
      : titleGlow === "purple"
        ? "text-glow-cosmic"
        : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className={`flex flex-col gap-3 ${alignClass}`}
    >
      {eyebrow && (
        <span className="text-xs font-display font-semibold tracking-[0.25em] uppercase text-primary">
          {eyebrow}
        </span>
      )}
      <h2
        className={`font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-foreground ${glowClass}`}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="max-w-2xl text-muted-foreground text-base sm:text-lg leading-relaxed">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
