import { useState } from "react";
import { usePhotosByCategory } from "../../hooks/useQueries";

const RESORT_SEED_PHOTOS = [
  {
    id: "seed-1",
    url: "/assets/file_000000005a8471fab38cd5bee06017c6-019e2cbc-9f54-735b-abe1-152c98964050.png",
    caption: "Royal Garden Ceremony",
    mediaType: "image",
  },
  {
    id: "seed-2",
    url: "/assets/file_000000001ea071faaf65e0b6e8ff90a5-019e2cbc-a225-739b-bf31-6ef70513dda7.png",
    caption: "Suraj Garh Garden",
    mediaType: "image",
  },
  {
    id: "seed-3",
    url: "/assets/file_0000000032cc71fa9e0b220ef05fdd4e-019e2cbc-a28b-764f-a5d0-0df4ce2ea8e7.png",
    caption: "Banquet Hall Elegance",
    mediaType: "image",
  },
  {
    id: "seed-4",
    url: "/assets/file_00000000a70c71faa0942a2f5597a4f9-019e2cbc-a2ce-765c-a7a2-bad0ab369198.png",
    caption: "Grand Entrance",
    mediaType: "image",
  },
  {
    id: "seed-5",
    url: "/assets/file_00000000c46871fa894e9e84da83077c-019e2cbc-a338-741c-a74f-dea793aaee92.png",
    caption: "Wedding Celebrations",
    mediaType: "image",
  },
  {
    id: "seed-6",
    url: "/assets/file_000000005eb071fabb910adaa68e7b6a-019e2cbc-a3c0-7521-99f2-6d16917770ec.png",
    caption: "Sarita Green Venue",
    mediaType: "image",
  },
  {
    id: "seed-7",
    url: "/assets/file_00000000cfe071faaa62fe72177cf8f2-019e2cbc-a495-76e8-b1b3-ccf5e5476d8e.png",
    caption: "Floral Decor",
    mediaType: "image",
  },
  {
    id: "seed-8",
    url: "/assets/file_0000000096cc720796b1f4de5d073889-019e2cbc-a522-7141-8660-70f9a30bb510.png",
    caption: "Hari Om Garden",
    mediaType: "image",
  },
  {
    id: "seed-9",
    url: "/assets/file_00000000059471fa95a355e6da2ce020-019e2cbc-a51f-753c-a17a-d71971a71a4c.png",
    caption: "Premium Rooms",
    mediaType: "image",
  },
  {
    id: "seed-10",
    url: "/assets/file_000000001b1471fa8d8b1c5bdb736797-019e2cbc-a5e8-74b0-8957-3b2af20f963e.png",
    caption: "Luxurious Ambiance",
    mediaType: "image",
  },
];

const UNAVAILABLE_SVG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%231a1a1a'/%3E%3Ctext x='200' y='155' text-anchor='middle' font-family='serif' font-size='14' fill='%23D4AF37' opacity='0.5'%3EImage unavailable%3C/text%3E%3C/svg%3E`;

type MediaItem = {
  id: string;
  url: string;
  caption: string;
  mediaType: string;
};

export default function GallerySection() {
  const { data: backendPhotos = [] } = usePhotosByCategory("gallery");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const items: MediaItem[] =
    backendPhotos.length > 0
      ? backendPhotos.map((p) => ({
          id: String(p.id),
          url: p.url,
          caption: p.caption,
          mediaType: p.mediaType,
        }))
      : RESORT_SEED_PHOTOS;

  const openLightbox = (idx: number) => setLightboxIndex(idx);
  const closeLightbox = () => setLightboxIndex(null);
  const prev = () =>
    setLightboxIndex((i) =>
      i !== null ? (i - 1 + items.length) % items.length : 0,
    );
  const next = () =>
    setLightboxIndex((i) => (i !== null ? (i + 1) % items.length : 0));

  const current = lightboxIndex !== null ? items[lightboxIndex] : null;

  return (
    <section
      id="gallery"
      className="py-20 px-4 md:px-8 bg-stone-950"
      data-ocid="gallery.section"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-14">
          <p className="text-xs tracking-[0.5em] uppercase text-amber-400/60 mb-3">
            Cherished Memories
          </p>
          <h2
            className="font-display text-4xl md:text-6xl font-bold tracking-[0.2em] uppercase text-amber-400"
            style={{
              textShadow: "0 0 40px rgba(212,175,55,0.35)",
              fontFamily: "'Cormorant Garamond', 'Playfair Display', serif",
            }}
          >
            MOMENTS GALLERY
          </h2>
          <div className="flex items-center gap-4 mt-5 justify-center">
            <div
              className="h-px flex-1 max-w-24"
              style={{
                background: "linear-gradient(to right, transparent, #D4AF37)",
              }}
            />
            <span className="text-amber-400 text-lg">✦</span>
            <div className="h-px w-8" style={{ background: "#D4AF37" }} />
            <span className="text-amber-400 text-lg">✦</span>
            <div
              className="h-px flex-1 max-w-24"
              style={{
                background: "linear-gradient(to left, transparent, #D4AF37)",
              }}
            />
          </div>
          <p className="mt-4 text-sm tracking-widest text-stone-400">
            Capturing the essence of royal celebrations at Surajgarh
          </p>
        </div>

        {/* Masonry Grid */}
        {items.length === 0 ? (
          <p className="text-center text-stone-500 tracking-widest py-12">
            Gallery coming soon
          </p>
        ) : (
          <div
            className="columns-1 sm:columns-2 lg:columns-3 gap-4"
            data-ocid="gallery.list"
          >
            {items.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                className="break-inside-avoid mb-4 group relative rounded-xl overflow-hidden cursor-pointer border border-amber-400/10 hover:border-amber-400/40 transition-all duration-300 w-full text-left"
                onClick={() => openLightbox(idx)}
                data-ocid={`gallery.item.${idx + 1}`}
              >
                {item.mediaType === "video" ? (
                  <div className="relative bg-stone-900">
                    <video
                      src={item.url}
                      className="w-full object-cover"
                      muted
                      playsInline
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-black/50 rounded-full p-4">
                        <svg
                          className="w-10 h-10 text-amber-400"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          role="img"
                          aria-label="Play video"
                        >
                          <title>Play video</title>
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ) : (
                  <img
                    src={item.url}
                    alt={item.caption || "Gallery photo"}
                    className="w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        UNAVAILABLE_SVG;
                    }}
                  />
                )}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(212,175,55,0.08) 60%, transparent 100%)",
                  }}
                >
                  {item.caption && (
                    <p className="p-4 text-sm tracking-wide text-amber-100 font-medium">
                      {item.caption}
                    </p>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && current && (
        <dialog
          open
          className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center w-full max-w-full h-full m-0 p-0 border-0"
          onClick={closeLightbox}
          onKeyDown={(e) => {
            if (e.key === "Escape") closeLightbox();
          }}
          aria-modal="true"
          tabIndex={-1}
          data-ocid="gallery.dialog"
        >
          <button
            type="button"
            className="absolute top-4 right-4 text-amber-400 hover:text-white transition-colors text-3xl font-light w-10 h-10 flex items-center justify-center"
            onClick={closeLightbox}
            aria-label="Close gallery"
            data-ocid="gallery.close_button"
          >
            ✕
          </button>
          <button
            type="button"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-400 hover:text-white transition-colors text-5xl font-thin w-12 h-12 flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            aria-label="Previous"
            data-ocid="gallery.pagination_prev"
          >
            ‹
          </button>
          <div
            className="max-w-5xl max-h-[80vh] flex items-center justify-center px-16"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            {current.mediaType === "video" ? (
              <video
                src={current.url}
                controls
                autoPlay
                className="max-w-full max-h-[75vh] rounded-lg"
              >
                <track kind="captions" />
              </video>
            ) : (
              <img
                src={current.url}
                alt={current.caption || "Gallery photo"}
                className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = UNAVAILABLE_SVG;
                }}
              />
            )}
          </div>
          <div
            className="mt-4 text-center"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            {current.caption && (
              <p className="text-amber-200 text-sm tracking-widest mb-1">
                {current.caption}
              </p>
            )}
            <p className="text-stone-500 text-xs tracking-widest">
              {lightboxIndex + 1} / {items.length}
            </p>
          </div>
          <button
            type="button"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-400 hover:text-white transition-colors text-5xl font-thin w-12 h-12 flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            aria-label="Next"
            data-ocid="gallery.pagination_next"
          >
            ›
          </button>
        </dialog>
      )}
    </section>
  );
}
