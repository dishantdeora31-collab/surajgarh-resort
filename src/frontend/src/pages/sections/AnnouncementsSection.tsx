import { useActiveAnnouncements } from "@/hooks/useQueries";
import { motion } from "motion/react";

export default function AnnouncementsSection() {
  const { data: announcements = [] } = useActiveAnnouncements();

  if (!announcements.length) return null;

  return (
    <section
      id="announcements"
      className="py-16 px-4 md:px-8"
      style={{ background: "rgba(212,175,55,0.04)" }}
      data-ocid="announcements.section"
    >
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p
            className="text-xs tracking-[0.4em] uppercase mb-2"
            style={{ color: "#D4AF37", opacity: 0.7 }}
          >
            Latest
          </p>
          <h2
            className="font-display text-3xl md:text-4xl font-bold tracking-wider uppercase"
            style={{
              color: "#D4AF37",
              textShadow: "0 0 20px rgba(212,175,55,0.3)",
            }}
          >
            Announcements
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {announcements.map((a, idx) => (
            <motion.div
              key={String(a.id)}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="rounded-xl p-6"
              style={{
                background: "#0A0A0A",
                border: "1px solid rgba(212,175,55,0.3)",
                boxShadow: "0 0 20px rgba(212,175,55,0.06)",
              }}
              data-ocid={`announcements.item.${idx + 1}`}
            >
              <h3
                className="font-display text-lg font-semibold mb-3 leading-snug"
                style={{ color: "#D4AF37" }}
              >
                {a.title}
              </h3>
              <p
                className="text-sm leading-relaxed mb-4"
                style={{ color: "#FFFDD0", opacity: 0.85 }}
              >
                {a.body}
              </p>
              <p
                className="text-xs tracking-wider"
                style={{ color: "rgba(212,175,55,0.5)" }}
              >
                {new Date(a.publishDate).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
