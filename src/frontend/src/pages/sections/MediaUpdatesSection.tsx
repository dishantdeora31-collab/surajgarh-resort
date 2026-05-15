interface CustomContentBlock {
  id: string;
  blockType: string;
  title: string;
  content: string;
  url?: string;
  targetSection?: string;
  order: bigint;
}
import SectionHeader from "@/components/SectionHeader";
import { useSiteConfigContext } from "@/context/SiteConfigContext";
import { Download, FileText, Image, Video } from "lucide-react";
import { motion } from "motion/react";

function extractYouTubeId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return u.pathname.slice(1);
    if (u.hostname.includes("youtube.com")) return u.searchParams.get("v");
  } catch {
    // not a valid URL, try regex
  }
  const m = url.match(/(?:v=|youtu\.be\/)([\w-]{11})/);
  return m ? m[1] : null;
}

function ContentBlock({
  block,
  index,
}: { block: CustomContentBlock; index: number }) {
  const delay = index * 0.1;

  const blockStyles = {
    background:
      "linear-gradient(135deg, oklch(0.14 0.02 270 / 0.8), oklch(0.18 0.04 260 / 0.6))",
    border: "1px solid oklch(0.28 0.06 60 / 0.35)",
    boxShadow: "0 0 30px oklch(0.65 0.22 60 / 0.06)",
  };

  return (
    <motion.div
      data-ocid={`media.block.${index + 1}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="rounded-xl overflow-hidden p-6 flex flex-col gap-4"
      style={blockStyles}
    >
      {/* Block title */}
      {block.title && (
        <h3 className="font-display font-bold text-lg text-foreground flex items-center gap-2">
          {block.blockType === "paragraph" && (
            <FileText className="w-4 h-4 text-primary/70" />
          )}
          {block.blockType === "image" && (
            <Image className="w-4 h-4 text-primary/70" />
          )}
          {block.blockType === "video" && (
            <Video className="w-4 h-4 text-primary/70" />
          )}
          {block.blockType === "file" && (
            <Download className="w-4 h-4 text-primary/70" />
          )}
          {block.title}
        </h3>
      )}

      {/* Paragraph */}
      {block.blockType === "paragraph" && block.content && (
        <p className="text-muted-foreground text-sm leading-relaxed">
          {block.content}
        </p>
      )}

      {/* Image */}
      {block.blockType === "image" && block.url && (
        <div className="rounded-lg overflow-hidden border border-border/30">
          <img
            src={block.url}
            alt={block.title || "Media"}
            className="w-full h-auto object-cover max-h-80"
          />
        </div>
      )}

      {/* Video */}
      {block.blockType === "video" &&
        block.url &&
        (() => {
          const videoId = extractYouTubeId(block.url);
          return videoId ? (
            <div
              className="relative w-full rounded-lg overflow-hidden"
              style={{ paddingBottom: "56.25%" }}
            >
              <iframe
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube.com/embed/${videoId}`}
                title={block.title || "Video"}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <a
              href={block.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary text-sm underline underline-offset-2 hover:text-primary/80 transition-colors"
            >
              Watch Video →
            </a>
          );
        })()}

      {/* File */}
      {block.blockType === "file" && block.url && (
        <a
          href={block.url}
          download
          target="_blank"
          rel="noopener noreferrer"
          data-ocid={`media.file_download.${index + 1}`}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-display font-semibold text-sm transition-smooth w-fit"
          style={{
            background: "oklch(0.65 0.22 60 / 0.12)",
            border: "1px solid oklch(0.65 0.22 60 / 0.35)",
            color: "oklch(0.75 0.22 55)",
          }}
        >
          <Download className="w-4 h-4" />
          Download File
        </a>
      )}
      {block.content && block.blockType !== "paragraph" && (
        <p className="text-muted-foreground text-xs leading-relaxed">
          {block.content}
        </p>
      )}
    </motion.div>
  );
}

export default function MediaUpdatesSection() {
  const { siteConfig } = useSiteConfigContext();

  const blocks = (siteConfig?.customContent ?? [])
    .filter((b) => !b.targetSection || b.targetSection === "standalone")
    .sort((a, b) => Number(a.order) - Number(b.order));

  if (blocks.length === 0) return null;

  return (
    <section
      id="media-updates"
      data-ocid="media.section"
      className="relative py-24 sm:py-32 overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, oklch(0.11 0.01 270) 0%, oklch(0.13 0.02 260) 50%, oklch(0.11 0.01 270) 100%)",
      }}
    >
      {/* Ambient glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] blur-[160px] opacity-[0.06] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, oklch(0.65 0.22 60) 0%, oklch(0.50 0.18 270) 60%, transparent 100%)",
        }}
      />
      {/* Top shimmer */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, oklch(0.65 0.22 60 / 0.4), transparent)",
        }}
      />

      <div className="relative container max-w-6xl mx-auto px-6">
        <SectionHeader
          eyebrow="Updates & Media"
          title="Latest From The World"
          subtitle="News, media, and announcements from the VAMP-X universe."
        />

        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blocks.map((block, i) => (
            <ContentBlock key={block.id} block={block} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
