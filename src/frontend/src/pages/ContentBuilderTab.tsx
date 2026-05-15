// Local type definitions (not from backend — this is frontend-only config)
interface CustomContentBlock {
  id: string;
  blockType: string;
  title: string;
  content: string;
  url?: string;
  targetSection?: string;
  order: bigint;
}

interface SiteConfig {
  customContent?: CustomContentBlock[];
  announcement: { enabled: boolean; message: string; bgColor: string };
  seo: { pageTitle: string; metaDescription: string; keywords: string };
  socialLinks?: SocialLink[];
  tagline?: string;
  characters?: unknown[];
  worldRegions?: unknown[];
  narrative?: string;
}

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  linkLabel: string;
}
import { useSiteConfigContext } from "@/context/SiteConfigContext";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// ─── Reuse same field styles as AdminPanel ────────────────────────────────────
function EditorField({
  label,
  value,
  onChange,
  multiline = false,
  placeholder = "",
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  placeholder?: string;
  hint?: string;
}) {
  const cls =
    "w-full px-3 py-2 rounded-lg text-sm font-body text-foreground placeholder:text-muted-foreground/40 outline-none transition-smooth";
  const style = {
    background: "oklch(0.11 0 0)",
    border: "1px solid oklch(0.26 0 0)",
  };
  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-xs font-display font-semibold tracking-[0.12em] uppercase text-muted-foreground">
        {label}
      </p>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={4}
          className={cls}
          style={style}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cls}
          style={style}
        />
      )}
      {hint && <p className="text-[11px] text-muted-foreground/60">{hint}</p>}
    </div>
  );
}

function SectionHeading({
  icon,
  title,
  description,
}: { icon: string; title: string; description: string }) {
  return (
    <div className="flex flex-col gap-1 mb-2">
      <h3
        className="font-display font-bold text-lg flex items-center gap-2"
        style={{ color: "oklch(0.75 0.22 55)" }}
      >
        <span>{icon}</span> {title}
      </h3>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
}

function SaveRow({
  onSave,
  onUndo,
  saving,
  canUndo,
}: {
  onSave: () => void;
  onUndo: () => void;
  saving: boolean;
  canUndo: boolean;
}) {
  return (
    <div className="flex items-center justify-end gap-3 pt-2">
      {canUndo && (
        <button
          type="button"
          onClick={onUndo}
          data-ocid="admin.content_builder_undo_button"
          className="px-4 py-2 rounded-lg text-sm font-display font-semibold transition-smooth hover:opacity-80"
          style={{
            background: "oklch(0.20 0 0)",
            border: "1px solid oklch(0.30 0 0)",
            color: "oklch(0.65 0 0)",
          }}
        >
          ↩ Undo
        </button>
      )}
      <button
        type="button"
        onClick={onSave}
        disabled={saving}
        data-ocid="admin.content_builder_save_button"
        className="px-6 py-2.5 rounded-lg text-sm font-display font-bold tracking-widest uppercase transition-smooth hover:scale-[1.02] active:scale-95 disabled:opacity-50"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.65 0.22 60), oklch(0.55 0.20 55))",
          color: "oklch(0.10 0 0)",
          boxShadow: "0 0 16px oklch(0.65 0.22 60 / 0.25)",
        }}
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
}

// ─── Content Block types ──────────────────────────────────────────────────────
const TARGET_SECTIONS = [
  { value: "standalone", label: "Standalone (Media & Updates section)" },
  { value: "kael", label: "Kael — The Ascendant" },
  { value: "seraphiel", label: "Seraphiel — The Fallen Angel" },
  { value: "nyra", label: "Nyra — The Survivor Queen" },
  { value: "azrath", label: "Azrath — The First Fallen" },
  { value: "eternal", label: "The Eternal Presence" },
  { value: "fallen-earth", label: "Fallen Earth" },
  { value: "cursed-wilderness", label: "Cursed Wilderness" },
  { value: "ashen-realms", label: "Ashen Realms" },
  { value: "celestial-frontier", label: "Celestial Frontier" },
  { value: "heaven", label: "Heaven" },
];

const BLOCK_TYPES = [
  { value: "paragraph", label: "Paragraph" },
  { value: "image", label: "Image" },
  { value: "video", label: "Video" },
  { value: "file", label: "File" },
];

const inputStyle = {
  background: "oklch(0.11 0 0)",
  border: "1px solid oklch(0.26 0 0)",
};
const selectCls =
  "w-full px-3 py-2 rounded-lg text-sm font-body text-foreground outline-none transition-smooth";

function ContentBlockCard({
  block,
  index,
  onUpdate,
  onRemove,
  open,
  onToggle,
}: {
  block: CustomContentBlock;
  index: number;
  onUpdate: (id: string, patch: Partial<CustomContentBlock>) => void;
  onRemove: (id: string) => void;
  open: boolean;
  onToggle: () => void;
}) {
  const typeLabel =
    BLOCK_TYPES.find((t) => t.value === block.blockType)?.label ??
    block.blockType;
  const sectionLabel =
    TARGET_SECTIONS.find(
      (s) => s.value === (block.targetSection ?? "standalone"),
    )?.label ?? "Standalone";
  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{
        borderColor: open ? "oklch(0.65 0.22 60 / 0.4)" : "oklch(0.22 0 0)",
      }}
    >
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 text-left transition-smooth hover:bg-[oklch(0.16_0_0)]"
      >
        <div className="flex flex-col gap-0.5">
          <span className="font-display font-bold text-sm text-foreground">
            {block.title || "Untitled Block"}
          </span>
          <span className="text-[11px] text-muted-foreground">
            {typeLabel} · Order {Number(block.order)} · {sectionLabel}
          </span>
        </div>
        <span className="text-muted-foreground text-xs">
          {open ? "▲" : "▼"}
        </span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div
              className="px-4 pb-5 flex flex-col gap-4"
              style={{ borderTop: "1px solid oklch(0.20 0 0)" }}
            >
              <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <EditorField
                  label="Title"
                  value={block.title}
                  onChange={(v) => onUpdate(block.id, { title: v })}
                  placeholder="Block heading"
                />
                <div className="flex flex-col gap-1.5">
                  <p className="text-xs font-display font-semibold tracking-[0.12em] uppercase text-muted-foreground">
                    Block Type
                  </p>
                  <select
                    value={block.blockType}
                    onChange={(e) =>
                      onUpdate(block.id, { blockType: e.target.value })
                    }
                    className={selectCls}
                    style={inputStyle}
                  >
                    {BLOCK_TYPES.map((bt) => (
                      <option key={bt.value} value={bt.value}>
                        {bt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <p className="text-xs font-display font-semibold tracking-[0.12em] uppercase text-muted-foreground">
                    Target Section
                  </p>
                  <select
                    value={block.targetSection ?? "standalone"}
                    onChange={(e) =>
                      onUpdate(block.id, { targetSection: e.target.value })
                    }
                    className={selectCls}
                    style={inputStyle}
                  >
                    {TARGET_SECTIONS.map((ts) => (
                      <option key={ts.value} value={ts.value}>
                        {ts.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <p className="text-xs font-display font-semibold tracking-[0.12em] uppercase text-muted-foreground">
                    Sort Order
                  </p>
                  <input
                    type="number"
                    min={0}
                    value={Number(block.order)}
                    onChange={(e) =>
                      onUpdate(block.id, {
                        order: BigInt(e.target.value || "0"),
                      })
                    }
                    className={selectCls}
                    style={inputStyle}
                  />
                </div>
              </div>
              {block.blockType === "paragraph" ? (
                <EditorField
                  label="Content"
                  value={block.content}
                  onChange={(v) => onUpdate(block.id, { content: v })}
                  multiline
                  placeholder="Write your paragraph here..."
                />
              ) : (
                <EditorField
                  label={
                    block.blockType === "image"
                      ? "Image URL"
                      : block.blockType === "video"
                        ? "Video URL (YouTube or direct)"
                        : "File URL"
                  }
                  value={block.url ?? ""}
                  onChange={(v) => onUpdate(block.id, { url: v })}
                  placeholder={
                    block.blockType === "image"
                      ? "https://..."
                      : block.blockType === "video"
                        ? "https://youtube.com/..."
                        : "https://..."
                  }
                />
              )}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => onRemove(block.id)}
                  data-ocid={`admin.delete_content_block.${index + 1}`}
                  className="px-4 py-1.5 rounded-lg text-xs font-display font-semibold transition-smooth hover:opacity-80"
                  style={{
                    background: "oklch(0.30 0.15 15 / 0.15)",
                    border: "1px solid oklch(0.55 0.22 15 / 0.4)",
                    color: "oklch(0.65 0.22 15)",
                  }}
                >
                  Delete Block
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Sub-sections ─────────────────────────────────────────────────────────────
function CustomContentSection({
  blocks,
  onUpdate,
  onAdd,
  onRemove,
}: {
  blocks: CustomContentBlock[];
  onUpdate: (id: string, patch: Partial<CustomContentBlock>) => void;
  onAdd: () => void;
  onRemove: (id: string) => void;
}) {
  const [openId, setOpenId] = useState<string | null>(null);
  const sorted = [...blocks].sort((a, b) => Number(a.order) - Number(b.order));
  return (
    <div className="flex flex-col gap-5">
      <SectionHeading
        icon="📦"
        title="Custom Content Blocks"
        description="Add paragraphs, images, videos, or files to character profiles, world regions, or a standalone media section."
      />
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onAdd}
          data-ocid="admin.add_content_block_button"
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-display font-bold transition-smooth hover:opacity-80"
          style={{
            background: "oklch(0.65 0.22 60 / 0.12)",
            border: "1px solid oklch(0.65 0.22 60 / 0.4)",
            color: "oklch(0.75 0.22 55)",
          }}
        >
          + Add Block
        </button>
      </div>
      {sorted.length === 0 ? (
        <div
          data-ocid="admin.content_blocks_empty_state"
          className="py-10 text-center rounded-xl"
          style={{ border: "1px dashed oklch(0.28 0 0)" }}
        >
          <p className="text-muted-foreground text-sm font-display">
            No content blocks yet.
          </p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            Click "+ Add Block" to start adding content.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {sorted.map((block, i) => (
            <ContentBlockCard
              key={block.id}
              block={block}
              index={i}
              onUpdate={onUpdate}
              onRemove={onRemove}
              open={openId === block.id}
              onToggle={() => setOpenId(openId === block.id ? null : block.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function AnnouncementSection({
  announcement,
  onUpdate,
}: {
  announcement: SiteConfig["announcement"];
  onUpdate: (a: SiteConfig["announcement"]) => void;
}) {
  const previewBg = announcement.bgColor || "oklch(0.28 0.12 60)";
  return (
    <div className="flex flex-col gap-5">
      <SectionHeading
        icon="📢"
        title="Announcement Banner"
        description="Display a dismissible banner at the top of the site. Toggle on/off without losing your message."
      />
      <div
        className="flex items-center gap-4 p-4 rounded-xl"
        style={{
          background: "oklch(0.13 0 0)",
          border: "1px solid oklch(0.22 0 0)",
        }}
      >
        <span className="text-sm font-display font-semibold text-muted-foreground">
          Banner Status
        </span>
        <button
          type="button"
          onClick={() =>
            onUpdate({ ...announcement, enabled: !announcement.enabled })
          }
          data-ocid="admin.announcement_toggle"
          className="relative w-12 h-6 rounded-full transition-smooth flex-shrink-0"
          style={{
            background: announcement.enabled
              ? "oklch(0.65 0.22 60)"
              : "oklch(0.28 0 0)",
            border: "1px solid oklch(0.35 0 0)",
          }}
          aria-label="Toggle announcement banner"
        >
          <span
            className="absolute top-0.5 w-5 h-5 rounded-full transition-smooth"
            style={{
              background: "oklch(0.95 0 0)",
              left: announcement.enabled ? "calc(100% - 22px)" : "2px",
            }}
          />
        </button>
        <span
          className="text-xs font-display font-bold tracking-wide px-2.5 py-1 rounded-full"
          style={{
            background: announcement.enabled
              ? "oklch(0.65 0.22 60 / 0.15)"
              : "oklch(0.24 0 0)",
            color: announcement.enabled
              ? "oklch(0.75 0.22 55)"
              : "oklch(0.55 0 0)",
            border: `1px solid ${announcement.enabled ? "oklch(0.65 0.22 60 / 0.4)" : "oklch(0.30 0 0)"}`,
          }}
        >
          {announcement.enabled ? "LIVE" : "HIDDEN"}
        </span>
      </div>
      <EditorField
        label="Banner Message"
        value={announcement.message}
        onChange={(v) => onUpdate({ ...announcement, message: v })}
        placeholder="e.g. VAMP-X: ASCENT launches soon! Order your 4K CD today."
      />
      <div className="flex flex-col gap-1.5">
        <p className="text-xs font-display font-semibold tracking-[0.12em] uppercase text-muted-foreground">
          Background Color
        </p>
        <div className="flex gap-3 items-center">
          <input
            type="color"
            value={
              announcement.bgColor.startsWith("#")
                ? announcement.bgColor
                : "#b8860b"
            }
            onChange={(e) =>
              onUpdate({ ...announcement, bgColor: e.target.value })
            }
            className="w-10 h-9 rounded-lg cursor-pointer"
            style={{
              border: "1px solid oklch(0.30 0 0)",
              background: "none",
              padding: "2px",
            }}
            aria-label="Pick banner background color"
          />
          <input
            type="text"
            value={announcement.bgColor}
            onChange={(e) =>
              onUpdate({ ...announcement, bgColor: e.target.value })
            }
            placeholder="#b8860b or oklch(...)"
            className="flex-1 px-3 py-2 rounded-lg text-sm font-body text-foreground placeholder:text-muted-foreground/40 outline-none"
            style={inputStyle}
          />
        </div>
      </div>
      {/* Live preview */}
      <div className="flex flex-col gap-1.5">
        <p className="text-xs font-display font-semibold tracking-[0.12em] uppercase text-muted-foreground">
          Live Preview
        </p>
        <div
          className="w-full px-4 py-3 rounded-lg text-sm font-display text-center font-semibold"
          style={{ background: previewBg, color: "oklch(0.95 0 0)" }}
        >
          {announcement.message || "Your announcement will appear here"}
        </div>
      </div>
    </div>
  );
}

function SeoSection({
  seo,
  onUpdate,
}: {
  seo: SiteConfig["seo"];
  onUpdate: (s: SiteConfig["seo"]) => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      <SectionHeading
        icon="🔍"
        title="SEO Settings"
        description="These affect how search engines find and display the site."
      />
      <div
        className="flex items-start gap-3 p-3 rounded-lg text-xs font-body"
        style={{
          background: "oklch(0.65 0.22 60 / 0.07)",
          border: "1px solid oklch(0.65 0.22 60 / 0.25)",
          color: "oklch(0.70 0.15 55)",
        }}
      >
        <span className="text-base">ℹ️</span>
        <p>
          These affect how search engines find the site. Changes take effect the
          next time search engines crawl your pages.
        </p>
      </div>
      <EditorField
        label="Page Title"
        value={seo.pageTitle}
        onChange={(v) => onUpdate({ ...seo, pageTitle: v })}
        placeholder="VAMP-X: ASCENT — Fight. Evolve. Ascend."
        hint="Shown in browser tab and search results (~60 characters ideal)"
      />
      <EditorField
        label="Meta Description"
        value={seo.metaDescription}
        onChange={(v) => onUpdate({ ...seo, metaDescription: v })}
        multiline
        placeholder="An epic open-world action RPG set at the end of reality..."
        hint="~155 characters ideal for search snippet"
      />
      <EditorField
        label="Keywords"
        value={seo.keywords}
        onChange={(v) => onUpdate({ ...seo, keywords: v })}
        placeholder="VAMP-X, action RPG, open world, divine, ascension"
        hint="Comma-separated keywords"
      />
    </div>
  );
}

function SocialLinkRow({
  link,
  index,
  onUpdate,
  onRemove,
}: {
  link: SocialLink;
  index: number;
  onUpdate: (id: string, patch: Partial<SocialLink>) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div
      className="p-4 rounded-xl flex flex-col gap-4"
      style={{
        background: "oklch(0.14 0 0)",
        border: "1px solid oklch(0.22 0 0)",
      }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <EditorField
          label="Platform"
          value={link.platform}
          onChange={(v) => onUpdate(link.id, { platform: v })}
          placeholder="Twitter, Instagram, YouTube..."
        />
        <EditorField
          label="Display Label"
          value={link.linkLabel}
          onChange={(v) => onUpdate(link.id, { linkLabel: v })}
          placeholder="Follow us"
        />
        <EditorField
          label="URL"
          value={link.url}
          onChange={(v) => onUpdate(link.id, { url: v })}
          placeholder="https://..."
        />
      </div>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => onRemove(link.id)}
          data-ocid={`admin.delete_social_link.${index + 1}`}
          className="px-4 py-1.5 rounded-lg text-xs font-display font-semibold transition-smooth hover:opacity-80"
          style={{
            background: "oklch(0.30 0.15 15 / 0.15)",
            border: "1px solid oklch(0.55 0.22 15 / 0.4)",
            color: "oklch(0.65 0.22 15)",
          }}
        >
          Delete Link
        </button>
      </div>
    </div>
  );
}

function SocialLinksSection({
  links,
  onUpdate,
  onAdd,
  onRemove,
}: {
  links: SocialLink[];
  onUpdate: (id: string, patch: Partial<SocialLink>) => void;
  onAdd: () => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      <SectionHeading
        icon="🔗"
        title="Social Links"
        description="Links shown in the site footer. Add your social media profiles or contact channels."
      />
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onAdd}
          data-ocid="admin.add_social_link_button"
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-display font-bold transition-smooth hover:opacity-80"
          style={{
            background: "oklch(0.65 0.22 60 / 0.12)",
            border: "1px solid oklch(0.65 0.22 60 / 0.4)",
            color: "oklch(0.75 0.22 55)",
          }}
        >
          + Add Link
        </button>
      </div>
      {links.length === 0 ? (
        <div
          data-ocid="admin.social_links_empty_state"
          className="py-10 text-center rounded-xl"
          style={{ border: "1px dashed oklch(0.28 0 0)" }}
        >
          <p className="text-muted-foreground text-sm font-display">
            No social links yet.
          </p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            Add your social media and contact links.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {links.map((link, i) => (
            <SocialLinkRow
              key={link.id}
              link={link}
              index={i}
              onUpdate={onUpdate}
              onRemove={onRemove}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Content Builder sub-section nav ─────────────────────────────────────────
const CB_SECTIONS = [
  { id: "blocks", label: "Content Blocks", icon: "📦" },
  { id: "announcement", label: "Announcement", icon: "📢" },
  { id: "seo", label: "SEO Settings", icon: "🔍" },
  { id: "social", label: "Social Links", icon: "🔗" },
] as const;

type CBSectionId = (typeof CB_SECTIONS)[number]["id"];

// ─── ContentBuilderTab (exported) ────────────────────────────────────────────
export default function ContentBuilderTab() {
  const { siteConfig, updateSiteConfig, isSaving } = useSiteConfigContext();
  const [activeSection, setActiveSection] = useState<CBSectionId>("blocks");

  const defaultAnnouncement: SiteConfig["announcement"] = {
    enabled: false,
    message: "",
    bgColor: "#b8860b",
  };
  const defaultSeo: SiteConfig["seo"] = {
    pageTitle: "",
    metaDescription: "",
    keywords: "",
  };

  const [customContent, setCustomContent] = useState<CustomContentBlock[]>(
    () => siteConfig?.customContent ?? [],
  );
  const [announcement, setAnnouncement] = useState<SiteConfig["announcement"]>(
    () => siteConfig?.announcement ?? defaultAnnouncement,
  );
  const [seo, setSeo] = useState<SiteConfig["seo"]>(
    () => siteConfig?.seo ?? defaultSeo,
  );
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(
    () => siteConfig?.socialLinks ?? [],
  );

  // Previous config snapshot for undo
  const prevConfigRef = useRef<SiteConfig | null>(null);
  const [canUndo, setCanUndo] = useState(false);

  // Sync when siteConfig loads from backend
  useEffect(() => {
    if (siteConfig) {
      setCustomContent(siteConfig.customContent ?? []);
      setAnnouncement(siteConfig.announcement ?? defaultAnnouncement);
      setSeo(siteConfig.seo ?? defaultSeo);
      setSocialLinks(siteConfig.socialLinks ?? []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteConfig]);

  async function handleSave() {
    if (!siteConfig) return;
    // Snapshot current saved config before overwriting
    prevConfigRef.current = siteConfig as SiteConfig;
    setCanUndo(true);
    try {
      await updateSiteConfig({
        ...siteConfig,
        customContent,
        announcement,
        seo,
        socialLinks,
      });
      toast.success("Content Builder saved — site updated live", {
        style: {
          background: "oklch(0.14 0.04 60 / 0.97)",
          border: "1px solid oklch(0.65 0.22 60 / 0.5)",
          color: "oklch(0.75 0.22 55)",
        },
        duration: 4000,
      });
    } catch {
      toast.error("Failed to save. Please try again.");
    }
  }

  function handleUndo() {
    const prev = prevConfigRef.current;
    if (!prev) return;
    setCustomContent(prev.customContent ?? []);
    setAnnouncement(prev.announcement ?? defaultAnnouncement);
    setSeo(prev.seo ?? defaultSeo);
    setSocialLinks(prev.socialLinks ?? []);
    setCanUndo(false);
    toast("Changes reverted to last saved version", { duration: 3000 });
  }

  // Custom content handlers
  function addBlock() {
    const newBlock: CustomContentBlock = {
      id: Date.now().toString(),
      blockType: "paragraph",
      title: "New Block",
      content: "",
      url: undefined,
      targetSection: "standalone",
      order: BigInt(customContent.length),
    };
    setCustomContent((prev) => [...prev, newBlock]);
  }
  function updateBlock(id: string, patch: Partial<CustomContentBlock>) {
    setCustomContent((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...patch } : b)),
    );
  }
  function removeBlock(id: string) {
    setCustomContent((prev) => prev.filter((b) => b.id !== id));
  }

  // Social link handlers
  function addSocialLink() {
    setSocialLinks((prev) => [
      ...prev,
      { id: Date.now().toString(), platform: "", url: "", linkLabel: "" },
    ]);
  }
  function updateSocialLink(id: string, patch: Partial<SocialLink>) {
    setSocialLinks((prev) =>
      prev.map((l) => (l.id === id ? { ...l, ...patch } : l)),
    );
  }
  function removeSocialLink(id: string) {
    setSocialLinks((prev) => prev.filter((l) => l.id !== id));
  }

  return (
    <div className="flex flex-col lg:flex-row gap-0 flex-1 overflow-hidden">
      {/* Sidebar nav */}
      <nav
        className="lg:w-52 flex-shrink-0 flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-y-auto px-4 lg:px-3 py-3 lg:py-4"
        style={{
          borderBottom: "1px solid oklch(0.18 0 0)",
          borderRight: "none",
        }}
        aria-label="Content builder sections"
      >
        {CB_SECTIONS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setActiveSection(s.id)}
            data-ocid={`admin.content_builder_nav.${s.id}`}
            className="flex items-center gap-2.5 whitespace-nowrap lg:whitespace-normal px-3 py-2.5 rounded-lg text-xs font-display font-semibold transition-smooth text-left"
            style={{
              background:
                activeSection === s.id
                  ? "oklch(0.65 0.22 60 / 0.12)"
                  : "transparent",
              border:
                activeSection === s.id
                  ? "1px solid oklch(0.65 0.22 60 / 0.3)"
                  : "1px solid transparent",
              color:
                activeSection === s.id
                  ? "oklch(0.75 0.22 55)"
                  : "oklch(0.60 0 0)",
            }}
          >
            <span className="text-base">{s.icon}</span>
            <span className="hidden sm:block">{s.label}</span>
          </button>
        ))}
      </nav>

      {/* Panel content */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-6"
          >
            {activeSection === "blocks" && (
              <>
                <CustomContentSection
                  blocks={customContent}
                  onUpdate={updateBlock}
                  onAdd={addBlock}
                  onRemove={removeBlock}
                />
                <SaveRow
                  onSave={handleSave}
                  onUndo={handleUndo}
                  saving={isSaving}
                  canUndo={canUndo}
                />
              </>
            )}
            {activeSection === "announcement" && (
              <>
                <AnnouncementSection
                  announcement={announcement}
                  onUpdate={setAnnouncement}
                />
                <SaveRow
                  onSave={handleSave}
                  onUndo={handleUndo}
                  saving={isSaving}
                  canUndo={canUndo}
                />
              </>
            )}
            {activeSection === "seo" && (
              <>
                <SeoSection seo={seo} onUpdate={setSeo} />
                <SaveRow
                  onSave={handleSave}
                  onUndo={handleUndo}
                  saving={isSaving}
                  canUndo={canUndo}
                />
              </>
            )}
            {activeSection === "social" && (
              <>
                <SocialLinksSection
                  links={socialLinks}
                  onUpdate={updateSocialLink}
                  onAdd={addSocialLink}
                  onRemove={removeSocialLink}
                />
                <SaveRow
                  onSave={handleSave}
                  onUndo={handleUndo}
                  saving={isSaving}
                  canUndo={canUndo}
                />
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
