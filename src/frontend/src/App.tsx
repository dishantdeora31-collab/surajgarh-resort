import SiteNav from "@/components/SiteNav";
import VenueSection from "@/components/VenueSection";
import AdminPanel from "@/pages/AdminPanel";
import AnnouncementsSection from "@/pages/sections/AnnouncementsSection";
import ContactSection from "@/pages/sections/ContactSection";
import GallerySection from "@/pages/sections/GallerySection";
import HeroSection from "@/pages/sections/HeroSection";
import InquirySection from "@/pages/sections/InquirySection";
import RoomsSection from "@/pages/sections/RoomsSection";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

const queryClient = new QueryClient();

export default function App() {
  const [adminOpen, setAdminOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
        <SiteNav onAdminOpen={() => setAdminOpen(true)} />
        <main>
          <HeroSection />
          <AnnouncementsSection />
          <section id="venues">
            <VenueSection
              id="surajgarh-garden"
              venueId="surajgarh-garden"
              title="Suraj Garh Garden"
              imageUrl="/assets/generated/venue-garden.dim_800x500.jpg"
            />
            <VenueSection
              id="sarita-green"
              venueId="sarita-green"
              title="Sarita Green"
              imageUrl="/assets/generated/venue-garden.dim_800x500.jpg"
            />
            <VenueSection
              id="hari-om-garden"
              venueId="hari-om-garden"
              title="Hari Om Garden"
              imageUrl="/assets/generated/venue-garden.dim_800x500.jpg"
            />
            <VenueSection
              id="banquet-hall-1"
              venueId="banquet-hall-1"
              title="Banquet Hall 1"
              imageUrl="/assets/generated/venue-banquet.dim_800x500.jpg"
            />
            <VenueSection
              id="banquet-hall-2"
              venueId="banquet-hall-2"
              title="Banquet Hall 2"
              imageUrl="/assets/generated/venue-banquet.dim_800x500.jpg"
            />
          </section>
          <RoomsSection />
          <GallerySection />
          <InquirySection />
          <ContactSection />
        </main>
        <footer className="bg-card border-t border-primary/20 py-10 text-center">
          <p className="font-display text-2xl text-primary mb-1 tracking-widest">
            SURAJGARH RESORT
          </p>
          <p className="text-xs tracking-widest uppercase text-muted-foreground mb-4">
            Premium Wedding &amp; Event Venue
          </p>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Surajgarh Resort. All Rights
            Reserved.
          </p>
        </footer>
        {adminOpen && <AdminPanel onClose={() => setAdminOpen(false)} />}
      </div>
    </QueryClientProvider>
  );
}
