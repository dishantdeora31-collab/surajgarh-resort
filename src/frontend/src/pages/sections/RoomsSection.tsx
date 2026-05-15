import VenueCalendar from "@/components/VenueCalendar";
import { useContentMap } from "@/hooks/useQueries";
import { BedDouble } from "lucide-react";
import { motion } from "motion/react";

export default function RoomsSection() {
  const { get } = useContentMap();
  const description =
    get("roomsDescription") ||
    "Surajgarh Resort offers 60 elegantly appointed rooms designed for discerning guests. Each room blends Rajasthani grandeur with modern comforts — from hand-painted murals and ornate furniture to plush bedding and contemporary amenities. Ideal for wedding guests, family stays, and corporate retreats.";

  return (
    <section
      id="rooms"
      className="py-20 px-4 md:px-8 max-w-7xl mx-auto"
      data-ocid="rooms.section"
    >
      {/* Hero image */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="relative w-full rounded-2xl overflow-hidden mb-2"
      >
        <img
          src="/assets/generated/resort-room.dim_800x500.jpg"
          alt="Our Rooms"
          className="w-full object-cover"
          style={{ maxHeight: 420, objectFit: "cover" }}
        />
        <div
          className="absolute inset-0 flex flex-col items-center justify-end pb-10"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)",
          }}
        >
          <h2
            className="font-display text-3xl md:text-5xl font-bold tracking-widest uppercase text-center"
            style={{
              color: "#D4AF37",
              textShadow: "0 2px 24px rgba(212,175,55,0.5)",
            }}
          >
            Our Rooms
          </h2>
        </div>
      </motion.div>

      {/* Ornament */}
      <div className="flex items-center gap-3 my-8">
        <div
          className="flex-1 h-px"
          style={{
            background: "linear-gradient(to right, transparent, #D4AF37)",
          }}
        />
        <span className="text-xl" style={{ color: "#D4AF37" }}>
          ✦
        </span>
        <div
          className="flex-1 h-px"
          style={{
            background: "linear-gradient(to left, transparent, #D4AF37)",
          }}
        />
      </div>

      {/* Description + stats */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="flex flex-col md:flex-row items-center gap-8 mb-12"
      >
        <p
          className="text-base md:text-lg leading-relaxed max-w-2xl text-center md:text-left flex-1"
          style={{ color: "#FFFDD0", opacity: 0.9 }}
        >
          {description}
        </p>

        {/* Stat card */}
        <div
          className="flex flex-col items-center justify-center rounded-2xl px-10 py-8 flex-shrink-0"
          style={{
            background: "rgba(212,175,55,0.07)",
            border: "1px solid rgba(212,175,55,0.3)",
            boxShadow: "0 0 30px rgba(212,175,55,0.08)",
          }}
          data-ocid="rooms.stat_card"
        >
          <BedDouble size={36} style={{ color: "#D4AF37" }} className="mb-2" />
          <span
            className="font-display text-6xl font-bold"
            style={{
              color: "#D4AF37",
              textShadow: "0 0 20px rgba(212,175,55,0.4)",
            }}
          >
            60
          </span>
          <span
            className="text-xs tracking-[0.25em] uppercase mt-1"
            style={{ color: "#FFFDD0", opacity: 0.7 }}
          >
            Total Rooms
          </span>
        </div>
      </motion.div>

      {/* Calendar */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.15 }}
      >
        <h3
          className="text-center text-xl font-semibold mb-6 tracking-wider uppercase"
          style={{ color: "#D4AF37" }}
        >
          Room Availability Calendar
        </h3>
        <div className="max-w-xl mx-auto">
          <VenueCalendar type="room" />
        </div>
      </motion.div>
    </section>
  );
}
