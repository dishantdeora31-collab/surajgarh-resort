// Resort types derived from backend.d.ts
export type {
  VenueId,
  Timestamp,
  RoomAvailability,
  VenueBooking,
  ContentRecord,
  RoomBooking,
  PublicBookedDate,
  PublicRoomStatus,
  BookingStatus,
  Announcement,
  PhotoCategory,
  Photo,
  Inquiry,
} from "@/backend";

export interface VenueConfig {
  id: string;
  name: string;
  description: string;
  tagline: string;
  image: string;
  color: string;
}

export const VENUES: VenueConfig[] = [
  {
    id: "surajgarh-garden",
    name: "Suraj Garh Garden",
    tagline: "Where celebrations bloom under open skies",
    description:
      "Suraj Garh Garden is our crown jewel outdoor venue. A sprawling lush garden adorned with manicured lawns, vibrant floral arrangements, and majestic trees that create a canopy of natural beauty. Perfect for grand wedding ceremonies, sangeet evenings, and outdoor receptions that leave a lasting impression.",
    image: "/assets/generated/venue-garden.dim_800x500.jpg",
    color: "#1B4D2F",
  },
  {
    id: "sarita-green",
    name: "Sarita Green",
    tagline: "A serene garden sanctuary for intimate celebrations",
    description:
      "Sarita Green is an elegantly designed intimate garden venue surrounded by lush greenery and aromatic flowering plants. Ideal for mehendi ceremonies, intimate family gatherings, and bridal events where the natural setting becomes part of the celebration's story.",
    image: "/assets/generated/venue-garden.dim_800x500.jpg",
    color: "#2D6A4F",
  },
  {
    id: "hari-om-garden",
    name: "Hari Om Garden",
    tagline: "Sacred grounds for divine celebrations",
    description:
      "Hari Om Garden is a spiritually inspired open venue designed to honor traditional ceremonies with its serene ambiance. The space features a central sacred grove, decorative stone pathways, and a devoted puja area, making it perfect for havan ceremonies, engagement rituals, and traditional family events.",
    image: "/assets/generated/venue-garden.dim_800x500.jpg",
    color: "#4A7C59",
  },
  {
    id: "banquet-hall-1",
    name: "Banquet Hall 1",
    tagline: "Grand opulence for your most cherished moments",
    description:
      "Banquet Hall 1 is our flagship indoor celebration space, featuring grand crystal chandeliers, ornate gold detailing, and a stunning stage backdrop that sets the scene for magical wedding receptions. With a capacity for large gatherings and state-of-the-art audio-visual systems, every moment unfolds in cinematic grandeur.",
    image: "/assets/generated/venue-banquet.dim_800x500.jpg",
    color: "#8B6914",
  },
  {
    id: "banquet-hall-2",
    name: "Banquet Hall 2",
    tagline: "Versatile elegance for every celebration style",
    description:
      "Banquet Hall 2 offers flexible event space with modern amenities and classic elegance. Whether it's a corporate gathering, birthday celebration, or wedding pre-function event, this hall adapts seamlessly to your vision with customizable décor packages, premium catering setups, and impeccable service.",
    image: "/assets/generated/venue-banquet.dim_800x500.jpg",
    color: "#6B4F12",
  },
];

export const TOTAL_ROOMS = 60;
