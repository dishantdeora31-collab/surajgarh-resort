import { useVenueBookedDates } from "@/hooks/useQueries";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

type Props =
  | { venueId: string; type?: never }
  | { type: "room"; venueId?: never };

export default function VenueCalendar({ venueId, type }: Props) {
  const [current, setCurrent] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const effectiveId = type === "room" ? "rooms" : (venueId ?? "");
  const { data: bookedDates = [], refetch } = useVenueBookedDates(effectiveId);

  useEffect(() => {
    const id = setInterval(() => refetch(), 30000);
    return () => clearInterval(id);
  }, [refetch]);

  const year = current.getFullYear();
  const month = current.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const bookedSet = new Set(
    bookedDates.map((b) => {
      const d = new Date(b.date);
      return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    }),
  );

  const isBooked = (day: number) => bookedSet.has(`${year}-${month}-${day}`);

  const prev = () => setCurrent(new Date(year, month - 1, 1));
  const next = () => setCurrent(new Date(year, month + 1, 1));

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div
      className="w-full rounded-xl overflow-hidden border"
      style={{
        borderColor: "rgba(212,175,55,0.25)",
        background: "rgba(10,10,10,0.7)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4"
        style={{
          background: "linear-gradient(135deg,#7a5c1e,#D4AF37,#b8960c)",
        }}
      >
        <button
          type="button"
          onClick={prev}
          className="p-1.5 rounded-full transition-smooth hover:bg-black/20"
          aria-label="Previous month"
          data-ocid="venue_calendar.prev_button"
        >
          <ChevronLeft size={18} className="text-black" />
        </button>
        <span className="font-bold tracking-widest text-black text-sm md:text-base uppercase">
          {MONTHS[month]} {year}
        </span>
        <button
          type="button"
          onClick={next}
          className="p-1.5 rounded-full transition-smooth hover:bg-black/20"
          aria-label="Next month"
          data-ocid="venue_calendar.next_button"
        >
          <ChevronRight size={18} className="text-black" />
        </button>
      </div>

      {/* Weekday labels */}
      <div
        className="grid grid-cols-7 border-b"
        style={{ borderColor: "rgba(212,175,55,0.15)" }}
      >
        {WEEKDAYS.map((d) => (
          <div
            key={d}
            className="py-2 text-center text-xs font-semibold uppercase tracking-wider"
            style={{ color: "#D4AF37" }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 p-2 gap-1">
        {cells.map((day, i) =>
          day === null ? (
            <div key={`empty-at-${i}-of-${cells.length}`} />
          ) : (
            <div
              key={day}
              className="aspect-square flex items-center justify-center rounded-lg text-xs md:text-sm font-medium transition-smooth"
              style={
                isBooked(day)
                  ? {
                      background: "#1B4D2F",
                      color: "#fff",
                      border: "1px solid #2d7a4a",
                    }
                  : { color: "#FFFDD0", border: "1px solid transparent" }
              }
              title={isBooked(day) ? "Booked" : "Available"}
            >
              {day}
            </div>
          ),
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 px-4 pb-4 pt-1">
        <div className="flex items-center gap-1.5">
          <div
            className="w-3 h-3 rounded"
            style={{ background: "#1B4D2F", border: "1px solid #2d7a4a" }}
          />
          <span className="text-xs" style={{ color: "#D4AF37" }}>
            Booked
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div
            className="w-3 h-3 rounded"
            style={{
              background: "rgba(255,253,208,0.1)",
              border: "1px solid rgba(255,253,208,0.3)",
            }}
          />
          <span className="text-xs" style={{ color: "#FFFDD0", opacity: 0.7 }}>
            Available
          </span>
        </div>
      </div>
    </div>
  );
}
