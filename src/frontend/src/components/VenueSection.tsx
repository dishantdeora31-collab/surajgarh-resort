import VenueCalendar from "@/components/VenueCalendar";
import { useContentMap } from "@/hooks/useQueries";
import { motion } from "motion/react";

type Props = {
  id: string;
  venueId: string;
  title: string;
  imageUrl: string;
};

function OrnamentDivider() {
  return (
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
        style={{ background: "linear-gradient(to left, transparent, #D4AF37)" }}
      />
    </div>
  );
}

export default function VenueSection({ id, venueId, title, imageUrl }: Props) {
  const { get } = useContentMap();

  const description =
    get(`${venueId}Description`) ||
    `${title} is one of Surajgarh Resort's most cherished venues, offering a breathtaking setting for weddings, celebrations, and gatherings. Nestled within lush grounds, every corner has been crafted to create timeless memories.`;

  return (
    <section
      id={id}
      className="py-12 px-4 md:px-8 max-w-7xl mx-auto"
      data-ocid={`${id}.section`}
    >
      {/* Hero image with title overlay */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative w-full rounded-2xl overflow-hidden mb-2"
        style={{ minHeight: 280 }}
      >
        <img
          src={imageUrl}
          alt={title}
          className="w-full object-cover"
          style={{ maxHeight: 420, width: "100%", objectFit: "cover" }}
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
            {title}
          </h2>
        </div>
      </motion.div>

      <OrnamentDivider />

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="text-center text-base md:text-lg leading-relaxed max-w-3xl mx-auto mb-12"
        style={{ color: "#FFFDD0", opacity: 0.9 }}
      >
        {description}
      </motion.p>

      {/* Calendar */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.1 }}
      >
        <h3
          className="text-center text-xl font-semibold mb-6 tracking-wider uppercase"
          style={{ color: "#D4AF37" }}
        >
          Availability Calendar
        </h3>
        <div className="max-w-xl mx-auto">
          <VenueCalendar venueId={venueId} />
        </div>
      </motion.div>
    </section>
  );
}
