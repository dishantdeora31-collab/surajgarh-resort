import type {
  Announcement,
  BookingStatus,
  ContentRecord,
  Inquiry,
  Photo,
  RoomBooking,
  VenueBooking,
} from "@/backend";
import {
  useAddAnnouncement,
  useDeleteAnnouncement,
  useUpdateAnnouncement,
} from "@/hooks/useAdminAnnouncements";
import {
  useAddRoomBooking,
  useAddVenueBooking,
  useAllRoomBookings,
  useDeleteRoomBooking,
  useDeleteVenueBooking,
  useUpdateVenueBooking,
  useVenueBookings,
} from "@/hooks/useAdminBookings";
import { useUpdateSiteContent } from "@/hooks/useAdminContent";
import {
  useAddPhoto,
  useDeletePhoto,
  useReorderGalleryMedia,
} from "@/hooks/useAdminPhotos";
import { useAllAnnouncements } from "@/hooks/useAnnouncements";
import { useAllInquiries, useDeleteInquiry } from "@/hooks/useInquiries";
import { usePhotosByCategory } from "@/hooks/usePhotos";
import { useAllSiteContent } from "@/hooks/useSiteContent";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ExternalBlob } from "../backend";

const ADMIN_PASSWORD = "surajgarh77";

// ─── Gold theme tokens ────────────────────────────────────────────────────────
const G = {
  gold: "oklch(0.72 0.16 80)",
  goldDim: "oklch(0.65 0.14 80 / 0.8)",
  goldGlow: "oklch(0.72 0.16 80 / 0.3)",
  goldBg: "oklch(0.72 0.16 80 / 0.10)",
  goldBorder: "oklch(0.72 0.16 80 / 0.35)",
  green: "oklch(0.50 0.14 155)",
  greenBg: "oklch(0.50 0.14 155 / 0.15)",
  greenBorder: "oklch(0.50 0.14 155 / 0.5)",
  blue: "oklch(0.55 0.18 240)",
  blueBg: "oklch(0.55 0.18 240 / 0.15)",
  blueBorder: "oklch(0.55 0.18 240 / 0.5)",
  red: "oklch(0.55 0.22 25)",
  redBg: "oklch(0.55 0.22 25 / 0.15)",
  redBorder: "oklch(0.55 0.22 25 / 0.5)",
  surface: "oklch(0.10 0.005 80 / 0.98)",
  card: "oklch(0.13 0.008 80)",
  cardBorder: "oklch(0.22 0.02 80)",
  muted: "oklch(0.55 0.04 80)",
};

// ─── Shared styled helpers ────────────────────────────────────────────────────
function AdminInput({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  const id = label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={id}
        className="text-xs font-display font-semibold tracking-[0.12em] uppercase"
        style={{ color: G.muted }}
      >
        {label}
        {required && <span style={{ color: G.gold }}> *</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 rounded-lg text-sm font-body text-foreground placeholder:text-muted-foreground/40 outline-none transition-colors"
        style={{
          background: "oklch(0.09 0 0)",
          border: `1px solid ${G.cardBorder}`,
        }}
      />
    </div>
  );
}

function AdminTextarea({
  label,
  value,
  onChange,
  rows = 3,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  const id = label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={id}
        className="text-xs font-display font-semibold tracking-[0.12em] uppercase"
        style={{ color: G.muted }}
      >
        {label}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="w-full px-3 py-2 rounded-lg text-sm font-body text-foreground placeholder:text-muted-foreground/40 outline-none transition-colors resize-none"
        style={{
          background: "oklch(0.09 0 0)",
          border: `1px solid ${G.cardBorder}`,
        }}
      />
    </div>
  );
}

function GoldButton({
  children,
  onClick,
  disabled,
  small,
  variant = "primary",
  type = "button",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  small?: boolean;
  variant?: "primary" | "ghost" | "danger";
  type?: "button" | "submit";
}) {
  const base = small ? "px-3 py-1.5 text-xs" : "px-5 py-2.5 text-sm";
  const styles = {
    primary: {
      background: `linear-gradient(135deg, ${G.gold}, oklch(0.62 0.13 80))`,
      color: "oklch(0.08 0 0)",
      border: "none",
    },
    ghost: {
      background: G.goldBg,
      color: G.gold,
      border: `1px solid ${G.goldBorder}`,
    },
    danger: {
      background: G.redBg,
      color: G.red,
      border: `1px solid ${G.redBorder}`,
    },
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} rounded-lg font-display font-bold tracking-wide transition-all hover:opacity-90 hover:scale-[1.02] active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed`}
      style={styles[variant]}
    >
      {children}
    </button>
  );
}

function StatusBadge({ status }: { status: string }) {
  const isBlue = status === "advance";
  const isRed = status === "full";
  const isGreen = status === "available";
  const style = isBlue
    ? {
        background: G.blueBg,
        color: G.blue,
        border: `1px solid ${G.blueBorder}`,
      }
    : isRed
      ? {
          background: G.redBg,
          color: G.red,
          border: `1px solid ${G.redBorder}`,
        }
      : isGreen
        ? {
            background: G.greenBg,
            color: G.green,
            border: `1px solid ${G.greenBorder}`,
          }
        : {
            background: G.goldBg,
            color: G.gold,
            border: `1px solid ${G.goldBorder}`,
          };
  const label = isBlue
    ? "Advance / Enquiry"
    : isRed
      ? "Full Payment"
      : isGreen
        ? "Available"
        : status;
  return (
    <span
      className="px-2 py-0.5 rounded-full text-xs font-display font-bold"
      style={style}
    >
      {label}
    </span>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3
      className="font-display font-bold text-lg mb-1"
      style={{ color: G.gold }}
    >
      {children}
    </h3>
  );
}

// ─── Password Gate ────────────────────────────────────────────────────────────
function PasswordGate({
  onSuccess,
  onClose,
}: { onSuccess: () => void; onClose: () => void }) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const [shaking, setShaking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) {
      onSuccess();
    } else {
      setError("Incorrect password. Try again.");
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
      setPw("");
      inputRef.current?.focus();
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      data-ocid="admin.password_gate"
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ background: `${G.surface}` }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${G.gold}, transparent)`,
        }}
      />
      <motion.form
        onSubmit={handleSubmit}
        animate={shaking ? { x: [-6, 6, -6, 6, 0] } : { x: 0 }}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-sm mx-6 p-8 rounded-2xl flex flex-col gap-6"
        style={{
          background: G.card,
          border: `1px solid ${G.goldBorder}`,
          boxShadow: `0 0 60px ${G.goldGlow}`,
        }}
      >
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
            style={{
              background: G.goldBg,
              border: `1px solid ${G.goldBorder}`,
            }}
          >
            🏰
          </div>
          <div className="text-center">
            <h2
              className="font-display font-bold text-xl tracking-wide"
              style={{ color: G.gold }}
            >
              Admin Access
            </h2>
            <p
              className="text-xs font-display tracking-[0.2em] uppercase mt-1"
              style={{ color: G.muted }}
            >
              SURAJGARH RESORT
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <input
            ref={inputRef}
            type="password"
            value={pw}
            onChange={(e) => {
              setPw(e.target.value);
              setError("");
            }}
            placeholder="Enter admin password"
            data-ocid="admin.password_input"
            aria-label="Admin password"
            className="w-full px-4 py-3 rounded-lg text-sm font-display text-foreground placeholder:text-muted-foreground/50 outline-none transition-colors"
            style={{
              background: "oklch(0.09 0 0)",
              border: `1px solid ${error ? G.red : G.cardBorder}`,
            }}
          />
          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                data-ocid="admin.password_error"
                className="text-xs font-display tracking-wide"
                style={{ color: G.red }}
              >
                ✕ {error}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            data-ocid="admin.password_cancel_button"
            className="flex-1 py-2.5 rounded-lg text-sm font-display font-semibold text-muted-foreground text-center transition-colors hover:text-foreground"
            style={{ border: `1px solid ${G.cardBorder}` }}
          >
            Cancel
          </button>
          <button
            type="submit"
            data-ocid="admin.password_submit_button"
            className="flex-1 py-2.5 rounded-lg text-sm font-display font-bold tracking-widest uppercase transition-all hover:scale-[1.02] active:scale-95"
            style={{
              background: `linear-gradient(135deg, ${G.gold}, oklch(0.62 0.13 80))`,
              color: "oklch(0.08 0 0)",
              boxShadow: `0 0 16px ${G.goldGlow}`,
            }}
          >
            Unlock
          </button>
        </div>
      </motion.form>
    </motion.div>
  );
}

// ─── Tab 1: Orders ────────────────────────────────────────────────────────────
function InquiriesTab() {
  const { data: inquiries = [], isLoading } = useAllInquiries();
  const deleteInquiry = useDeleteInquiry();
  const sorted = [...inquiries].sort(
    (a, b) => Number(b.submittedAt) - Number(a.submittedAt),
  );

  function formatDate(ns: bigint) {
    return new Date(Number(ns / 1_000_000n)).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  async function handleDelete(inquiry: Inquiry) {
    if (!confirm(`Delete enquiry from ${inquiry.name}?`)) return;
    try {
      await deleteInquiry.mutateAsync(inquiry.id);
      toast.success("Enquiry deleted");
    } catch {
      toast.error("Failed to delete enquiry.");
    }
  }

  return (
    <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6">
      <div className="flex items-center justify-between mb-5">
        <SectionTitle>Customer Enquiries</SectionTitle>
        <span
          className="px-3 py-1 rounded-full text-xs font-display font-bold"
          style={{
            background: G.goldBg,
            color: G.gold,
            border: `1px solid ${G.goldBorder}`,
          }}
        >
          {sorted.length} enquir{sorted.length !== 1 ? "ies" : "y"}
        </span>
      </div>
      {isLoading && <LoadingSpinner />}
      {!isLoading && sorted.length === 0 && (
        <EmptyState
          icon="💬"
          msg="No enquiries yet. Customer submissions will appear here."
        />
      )}
      {!isLoading && sorted.length > 0 && (
        <div
          className="overflow-x-auto rounded-xl"
          style={{ border: `1px solid ${G.cardBorder}` }}
        >
          <table className="w-full min-w-[700px]">
            <thead>
              <tr
                style={{
                  background: G.card,
                  borderBottom: `1px solid ${G.cardBorder}`,
                }}
              >
                {["Name", "Phone", "Email", "Type", "Message", "Date", ""].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-display font-bold tracking-[0.15em] uppercase"
                      style={{ color: G.goldDim }}
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {sorted.map((inquiry: Inquiry, i) => (
                <tr
                  key={Number(inquiry.id)}
                  data-ocid={`admin.inquiry.item.${i + 1}`}
                  className="border-b last:border-b-0 transition-colors hover:bg-[oklch(0.14_0_0)]"
                  style={{ borderColor: G.cardBorder }}
                >
                  <td className="px-4 py-3 text-sm font-display font-semibold text-foreground">
                    {inquiry.name}
                  </td>
                  <td className="px-4 py-3 text-sm font-body text-foreground">
                    {inquiry.phone}
                  </td>
                  <td
                    className="px-4 py-3 text-sm font-body"
                    style={{ color: G.muted }}
                  >
                    {inquiry.email || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="px-2 py-0.5 rounded-full text-xs font-display font-bold"
                      style={{
                        background: G.goldBg,
                        color: G.gold,
                        border: `1px solid ${G.goldBorder}`,
                      }}
                    >
                      {inquiry.inquiryType}
                    </span>
                  </td>
                  <td
                    className="px-4 py-3 text-sm font-body max-w-xs truncate"
                    style={{ color: G.muted }}
                    title={inquiry.message}
                  >
                    {inquiry.message}
                  </td>
                  <td
                    className="px-4 py-3 text-xs font-body whitespace-nowrap"
                    style={{ color: G.muted }}
                  >
                    {formatDate(inquiry.submittedAt)}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => handleDelete(inquiry)}
                      data-ocid={`admin.inquiry.delete_button.${i + 1}`}
                      className="px-2 py-1 rounded-lg text-xs font-display font-bold transition-colors hover:opacity-90"
                      style={{
                        background: G.redBg,
                        color: G.red,
                        border: `1px solid ${G.redBorder}`,
                      }}
                      aria-label="Delete enquiry"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Venue Booking Form ───────────────────────────────────────────────────────
type VenueBookingFormData = {
  date: string;
  customerName: string;
  phoneNumber: string;
  aadhaarNumber: string;
  totalAmount: string;
  paidAmount: string;
  remainingAmount: string;
  notes: string;
  bookingStatus: BookingStatus;
};

const EMPTY_VENUE_FORM: VenueBookingFormData = {
  date: "",
  customerName: "",
  phoneNumber: "",
  aadhaarNumber: "",
  totalAmount: "",
  paidAmount: "",
  remainingAmount: "",
  notes: "",
  bookingStatus: "advance",
};

function VenueBookingModal({
  venueId,
  editBooking,
  onClose,
}: {
  venueId: string;
  editBooking?: VenueBooking | null;
  onClose: () => void;
}) {
  const addMutation = useAddVenueBooking();
  const updateMutation = useUpdateVenueBooking();
  const [form, setForm] = useState<VenueBookingFormData>(() =>
    editBooking
      ? {
          date: editBooking.date,
          customerName: editBooking.customerName,
          phoneNumber: editBooking.phoneNumber,
          aadhaarNumber: editBooking.aadhaarNumber,
          totalAmount: String(editBooking.totalAmount),
          paidAmount: String(editBooking.paidAmount),
          remainingAmount: String(editBooking.remainingAmount),
          notes: editBooking.notes,
          bookingStatus: editBooking.status,
        }
      : EMPTY_VENUE_FORM,
  );

  function set(k: keyof VenueBookingFormData, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.date || !form.customerName || !form.phoneNumber) {
      toast.error("Date, Customer Name and Phone are required.");
      return;
    }
    try {
      if (editBooking) {
        await updateMutation.mutateAsync({
          id: editBooking.id,
          venueId,
          customerName: form.customerName,
          phoneNumber: form.phoneNumber,
          aadhaarNumber: form.aadhaarNumber,
          totalAmount: BigInt(form.totalAmount || "0"),
          paidAmount: BigInt(form.paidAmount || "0"),
          remainingAmount: BigInt(form.remainingAmount || "0"),
          notes: form.notes,
          bookingStatus: form.bookingStatus,
        });
        toast.success("Booking updated");
      } else {
        await addMutation.mutateAsync({
          venueId,
          date: form.date,
          customerName: form.customerName,
          phoneNumber: form.phoneNumber,
          aadhaarNumber: form.aadhaarNumber,
          totalAmount: BigInt(form.totalAmount || "0"),
          paidAmount: BigInt(form.paidAmount || "0"),
          remainingAmount: BigInt(form.remainingAmount || "0"),
          notes: form.notes,
          bookingStatus: form.bookingStatus,
        });
        toast.success("Booking added");
      }
      onClose();
    } catch {
      toast.error("Failed to save booking.");
    }
  }

  const saving = addMutation.isPending || updateMutation.isPending;

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
      style={{ background: "oklch(0 0 0 / 0.7)" }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        data-ocid="admin.booking_dialog"
        className="w-full max-w-lg rounded-2xl overflow-hidden"
        style={{ background: G.card, border: `1px solid ${G.goldBorder}` }}
      >
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: `1px solid ${G.cardBorder}` }}
        >
          <h3
            className="font-display font-bold text-base"
            style={{ color: G.gold }}
          >
            {editBooking ? "Edit Booking" : "New Booking"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            data-ocid="admin.booking_close_button"
            className="text-muted-foreground hover:text-foreground w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
            style={{ border: `1px solid ${G.cardBorder}` }}
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <form
          onSubmit={handleSubmit}
          className="px-6 py-5 flex flex-col gap-4 max-h-[70vh] overflow-y-auto"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AdminInput
              label="Date"
              value={form.date}
              onChange={(v) => set("date", v)}
              type="date"
              required
            />
            <div className="flex flex-col gap-1">
              <label
                htmlFor="admin-venue-status"
                className="text-xs font-display font-semibold tracking-[0.12em] uppercase"
                style={{ color: G.muted }}
              >
                Status
              </label>
              <select
                id="admin-venue-status"
                value={form.bookingStatus}
                onChange={(e) => set("bookingStatus", e.target.value)}
                data-ocid="admin.booking_status_select"
                className="w-full px-3 py-2 rounded-lg text-sm font-body text-foreground outline-none transition-colors"
                style={{
                  background: "oklch(0.09 0 0)",
                  border: `1px solid ${G.cardBorder}`,
                }}
              >
                <option value="advance">🔵 Advance / Enquiry</option>
                <option value="full">🔴 Full Payment / Closed</option>
              </select>
            </div>
          </div>
          <AdminInput
            label="Customer Name"
            value={form.customerName}
            onChange={(v) => set("customerName", v)}
            required
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AdminInput
              label="Phone Number"
              value={form.phoneNumber}
              onChange={(v) => set("phoneNumber", v)}
              type="tel"
              required
            />
            <AdminInput
              label="Aadhaar Number"
              value={form.aadhaarNumber}
              onChange={(v) => set("aadhaarNumber", v)}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <AdminInput
              label="Total Amount (₹)"
              value={form.totalAmount}
              onChange={(v) => set("totalAmount", v)}
              type="number"
            />
            <AdminInput
              label="Paid Amount (₹)"
              value={form.paidAmount}
              onChange={(v) => set("paidAmount", v)}
              type="number"
            />
            <AdminInput
              label="Remaining (₹)"
              value={form.remainingAmount}
              onChange={(v) => set("remainingAmount", v)}
              type="number"
            />
          </div>
          <AdminTextarea
            label="Notes"
            value={form.notes}
            onChange={(v) => set("notes", v)}
            rows={2}
          />
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              data-ocid="admin.booking_cancel_button"
              className="flex-1 py-2.5 rounded-lg text-sm font-display font-semibold text-muted-foreground text-center transition-colors hover:text-foreground"
              style={{ border: `1px solid ${G.cardBorder}` }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              data-ocid="admin.booking_submit_button"
              className="flex-1 py-2.5 rounded-lg text-sm font-display font-bold tracking-wide transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
              style={{
                background: `linear-gradient(135deg, ${G.gold}, oklch(0.62 0.13 80))`,
                color: "oklch(0.08 0 0)",
              }}
            >
              {saving ? "Saving..." : editBooking ? "Update" : "Add Booking"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// ─── Venue Calendar ───────────────────────────────────────────────────────────
function VenueCalendar({ venueId }: { venueId: string }) {
  const { data: bookings = [], isLoading } = useVenueBookings(venueId);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());
  const [showModal, setShowModal] = useState(false);
  const [editBooking, setEditBooking] = useState<VenueBooking | null>(null);
  const [_selectedDate, setSelectedDate] = useState<string | null>(null);
  const deleteMutation = useDeleteVenueBooking();

  const bookingMap = new Map<string, VenueBooking>();
  for (const b of bookings) bookingMap.set(b.date, b);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const monthNames = [
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

  function prevMonth() {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else setMonth((m) => m - 1);
  }
  function nextMonth() {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else setMonth((m) => m + 1);
  }

  function handleDayClick(day: number) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    setSelectedDate(dateStr);
    setEditBooking(bookingMap.get(dateStr) ?? null);
    setShowModal(true);
  }

  async function handleDelete(b: VenueBooking) {
    if (!confirm(`Delete booking for ${b.customerName} on ${b.date}?`)) return;
    try {
      await deleteMutation.mutateAsync({ id: b.id, venueId });
      toast.success("Booking deleted");
    } catch {
      toast.error("Failed to delete");
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Calendar header */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={prevMonth}
          aria-label="Previous month"
          className="w-9 h-9 rounded-lg flex items-center justify-center font-display font-bold transition-colors hover:text-foreground"
          style={{
            background: G.goldBg,
            border: `1px solid ${G.goldBorder}`,
            color: G.gold,
          }}
        >
          ‹
        </button>
        <div className="text-center">
          <p
            className="font-display font-bold text-lg"
            style={{ color: G.gold }}
          >
            {monthNames[month]} {year}
          </p>
        </div>
        <button
          type="button"
          onClick={nextMonth}
          aria-label="Next month"
          className="w-9 h-9 rounded-lg flex items-center justify-center font-display font-bold transition-colors hover:text-foreground"
          style={{
            background: G.goldBg,
            border: `1px solid ${G.goldBorder}`,
            color: G.gold,
          }}
        >
          ›
        </button>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs font-display">
        <span className="flex items-center gap-1.5">
          <span
            className="w-3 h-3 rounded-full inline-block"
            style={{ background: G.blue }}
          />
          Advance / Enquiry
        </span>
        <span className="flex items-center gap-1.5">
          <span
            className="w-3 h-3 rounded-full inline-block"
            style={{ background: G.red }}
          />
          Full Payment
        </span>
        <span className="flex items-center gap-1.5">
          <span
            className="w-3 h-3 rounded-full inline-block"
            style={{ background: "oklch(0.30 0 0)" }}
          />
          Available
        </span>
      </div>

      {/* Grid */}
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div
          className="rounded-xl overflow-hidden"
          style={{ border: `1px solid ${G.cardBorder}` }}
        >
          <div className="grid grid-cols-7">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div
                key={d}
                className="py-2 text-center text-xs font-display font-bold tracking-widest uppercase"
                style={{ background: G.card, color: G.goldDim }}
              >
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {Array.from({ length: firstDay }, (_, i) => i).map((dayNum) => (
              <div
                key={`empty-day-before-${dayNum}`}
                className="p-2 min-h-[52px]"
                style={{ background: "oklch(0.10 0 0)" }}
              />
            ))}
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
              const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const b = bookingMap.get(dateStr);
              const isBlue = b?.status === "advance";
              const isRed = b?.status === "full";
              const today = new Date().toISOString().slice(0, 10);
              const isToday = dateStr === today;
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleDayClick(day)}
                  className="p-2 min-h-[52px] flex flex-col items-center gap-1 transition-colors hover:bg-[oklch(0.18_0_0)] relative"
                  style={{
                    background: isBlue
                      ? "oklch(0.14 0.05 240)"
                      : isRed
                        ? "oklch(0.14 0.05 25)"
                        : "oklch(0.11 0 0)",
                    borderLeft: "1px solid oklch(0.16 0 0)",
                    borderTop: "1px solid oklch(0.16 0 0)",
                  }}
                  aria-label={`${dateStr}${b ? ` - ${b.customerName}` : ""}`}
                >
                  <span
                    className="text-xs font-display font-bold"
                    style={{
                      color: isToday
                        ? G.gold
                        : isBlue
                          ? G.blue
                          : isRed
                            ? G.red
                            : "oklch(0.70 0 0)",
                    }}
                  >
                    {day}
                  </span>
                  {b && (
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: isBlue ? G.blue : G.red }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Bookings list */}
      {bookings.length > 0 && (
        <div className="flex flex-col gap-3">
          <p
            className="text-xs font-display font-bold tracking-[0.15em] uppercase"
            style={{ color: G.goldDim }}
          >
            All Bookings
          </p>
          {[...bookings]
            .sort((a, b) => a.date.localeCompare(b.date))
            .map((booking, i) => (
              <BookingRow
                key={Number(booking.id)}
                booking={booking}
                index={i}
                onEdit={() => {
                  setEditBooking(booking);
                  setShowModal(true);
                }}
                onDelete={() => handleDelete(booking)}
              />
            ))}
        </div>
      )}

      <AnimatePresence>
        {showModal && (
          <VenueBookingModal
            venueId={venueId}
            editBooking={editBooking}
            onClose={() => {
              setShowModal(false);
              setEditBooking(null);
              setSelectedDate(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function BookingRow({
  booking,
  index,
  onEdit,
  onDelete,
}: {
  booking: VenueBooking;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      data-ocid={`admin.venue_booking.item.${index + 1}`}
      className="p-4 rounded-xl flex flex-col sm:flex-row sm:items-center gap-3"
      style={{ background: G.card, border: `1px solid ${G.cardBorder}` }}
    >
      <div className="flex-1 flex flex-col gap-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-display font-bold text-sm text-foreground truncate">
            {booking.customerName}
          </span>
          <StatusBadge status={booking.status} />
        </div>
        <div
          className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs"
          style={{ color: G.muted }}
        >
          <span>📅 {booking.date}</span>
          <span>📞 {booking.phoneNumber}</span>
          {booking.totalAmount > 0n && (
            <span>
              💰 ₹{Number(booking.totalAmount).toLocaleString("en-IN")} total
            </span>
          )}
          {booking.paidAmount > 0n && (
            <span style={{ color: G.green }}>
              ✓ ₹{Number(booking.paidAmount).toLocaleString("en-IN")} paid
            </span>
          )}
          {booking.remainingAmount > 0n && (
            <span style={{ color: G.red }}>
              ⚠ ₹{Number(booking.remainingAmount).toLocaleString("en-IN")} due
            </span>
          )}
        </div>
        {booking.notes && (
          <p className="text-xs" style={{ color: G.muted }}>
            {booking.notes}
          </p>
        )}
      </div>
      <div className="flex gap-2 flex-shrink-0">
        <GoldButton small variant="ghost" onClick={onEdit}>
          Edit
        </GoldButton>
        <GoldButton small variant="danger" onClick={onDelete}>
          Delete
        </GoldButton>
      </div>
    </div>
  );
}

// ─── Tab 2: Venues ────────────────────────────────────────────────────────────
const VENUES = [
  { id: "surajgarh-garden", label: "Suraj Garh Garden" },
  { id: "sarita-green", label: "Sarita Green" },
  { id: "hari-om-garden", label: "Hari Om Garden" },
  { id: "banquet-hall-1", label: "Banquet Hall 1" },
  { id: "banquet-hall-2", label: "Banquet Hall 2" },
];

function VenuesTab() {
  const [activeVenue, setActiveVenue] = useState(VENUES[0].id);
  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Venue sub-tabs */}
      <div
        className="flex-shrink-0 flex gap-1 overflow-x-auto px-6 sm:px-8 py-3"
        style={{ borderBottom: "1px solid oklch(0.16 0 0)" }}
      >
        {VENUES.map((v) => (
          <button
            key={v.id}
            type="button"
            onClick={() => setActiveVenue(v.id)}
            data-ocid={`admin.venue_tab.${v.id}`}
            className="whitespace-nowrap px-4 py-2 rounded-lg text-xs font-display font-bold tracking-wide transition-all"
            style={{
              background: activeVenue === v.id ? G.goldBg : "transparent",
              border: `1px solid ${activeVenue === v.id ? G.goldBorder : "transparent"}`,
              color: activeVenue === v.id ? G.gold : G.muted,
            }}
          >
            {v.label}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6">
        <SectionTitle>
          {VENUES.find((v) => v.id === activeVenue)?.label}
        </SectionTitle>
        <p className="text-xs mb-6" style={{ color: G.muted }}>
          Click any date to add or edit a booking. Blue = advance payment, Red =
          full payment.
        </p>
        <VenueCalendar venueId={activeVenue} />
      </div>
    </div>
  );
}

// ─── Tab 3: Rooms ─────────────────────────────────────────────────────────────
const TOTAL_ROOMS = 60;

type RoomFormData = {
  checkInDate: string;
  checkOutDate: string;
  numberOfRooms: string;
  customerName: string;
  phoneNumber: string;
  aadhaarNumber: string;
  totalAmount: string;
  paidAmount: string;
  remainingAmount: string;
  notes: string;
  bookingStatus: BookingStatus;
};

const EMPTY_ROOM_FORM: RoomFormData = {
  checkInDate: "",
  checkOutDate: "",
  numberOfRooms: "1",
  customerName: "",
  phoneNumber: "",
  aadhaarNumber: "",
  totalAmount: "",
  paidAmount: "",
  remainingAmount: "",
  notes: "",
  bookingStatus: "advance",
};

function RoomsTab() {
  const { data: roomBookings = [], isLoading } = useAllRoomBookings();
  const addMutation = useAddRoomBooking();
  const deleteMutation = useDeleteRoomBooking();
  const [form, setForm] = useState<RoomFormData>(EMPTY_ROOM_FORM);
  const [showForm, setShowForm] = useState(false);

  function setF(k: keyof RoomFormData, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  // Calculate rooms booked today
  const today = new Date().toISOString().slice(0, 10);
  const bookedToday = roomBookings
    .filter((b) => b.checkInDate <= today && b.checkOutDate > today)
    .reduce((sum, b) => sum + Number(b.numberOfRooms), 0);
  const availableToday = Math.max(0, TOTAL_ROOMS - bookedToday);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (
      !form.checkInDate ||
      !form.checkOutDate ||
      !form.customerName ||
      !form.phoneNumber
    ) {
      toast.error("Check-in, check-out, name and phone are required.");
      return;
    }
    const numRooms = Number.parseInt(form.numberOfRooms || "1");
    if (numRooms < 1 || numRooms > TOTAL_ROOMS) {
      toast.error(`Number of rooms must be between 1 and ${TOTAL_ROOMS}.`);
      return;
    }
    try {
      await addMutation.mutateAsync({
        checkInDate: form.checkInDate,
        checkOutDate: form.checkOutDate,
        numberOfRooms: BigInt(numRooms),
        customerName: form.customerName,
        phoneNumber: form.phoneNumber,
        aadhaarNumber: form.aadhaarNumber,
        totalAmount: BigInt(form.totalAmount || "0"),
        paidAmount: BigInt(form.paidAmount || "0"),
        remainingAmount: BigInt(form.remainingAmount || "0"),
        notes: form.notes,
        bookingStatus: form.bookingStatus,
      });
      toast.success("Room booking added");
      setForm(EMPTY_ROOM_FORM);
      setShowForm(false);
    } catch {
      toast.error("Failed to add room booking.");
    }
  }

  async function handleDeleteRoom(b: RoomBooking) {
    if (!confirm(`Delete room booking for ${b.customerName}?`)) return;
    try {
      await deleteMutation.mutateAsync(b.id);
      toast.success("Booking deleted");
    } catch {
      toast.error("Failed to delete");
    }
  }

  return (
    <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6">
      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Rooms", value: TOTAL_ROOMS, color: G.gold },
          { label: "Booked Today", value: bookedToday, color: G.red },
          { label: "Available Today", value: availableToday, color: G.green },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            className="p-4 rounded-xl text-center"
            style={{ background: G.card, border: `1px solid ${G.cardBorder}` }}
          >
            <p className="text-2xl font-display font-bold" style={{ color }}>
              {value}
            </p>
            <p className="text-xs font-display mt-1" style={{ color: G.muted }}>
              {label}
            </p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-4">
        <SectionTitle>Room Bookings</SectionTitle>
        <GoldButton onClick={() => setShowForm((v) => !v)}>
          {showForm ? "Cancel" : "+ Add Booking"}
        </GoldButton>
      </div>

      {/* Add form */}
      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            onSubmit={handleSubmit}
            data-ocid="admin.room_booking_form"
            className="overflow-hidden mb-6"
          >
            <div
              className="p-5 rounded-xl flex flex-col gap-4"
              style={{
                background: G.card,
                border: `1px solid ${G.goldBorder}`,
              }}
            >
              <p
                className="text-xs font-display font-bold tracking-[0.15em] uppercase"
                style={{ color: G.goldDim }}
              >
                New Room Booking
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <AdminInput
                  label="Check-in Date"
                  value={form.checkInDate}
                  onChange={(v) => setF("checkInDate", v)}
                  type="date"
                  required
                />
                <AdminInput
                  label="Check-out Date"
                  value={form.checkOutDate}
                  onChange={(v) => setF("checkOutDate", v)}
                  type="date"
                  required
                />
                <AdminInput
                  label={`No. of Rooms (max ${TOTAL_ROOMS})`}
                  value={form.numberOfRooms}
                  onChange={(v) => setF("numberOfRooms", v)}
                  type="number"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <AdminInput
                  label="Customer Name"
                  value={form.customerName}
                  onChange={(v) => setF("customerName", v)}
                  required
                />
                <AdminInput
                  label="Phone Number"
                  value={form.phoneNumber}
                  onChange={(v) => setF("phoneNumber", v)}
                  type="tel"
                  required
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <AdminInput
                  label="Aadhaar Number"
                  value={form.aadhaarNumber}
                  onChange={(v) => setF("aadhaarNumber", v)}
                />
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="admin-room-status"
                    className="text-xs font-display font-semibold tracking-[0.12em] uppercase"
                    style={{ color: G.muted }}
                  >
                    Status
                  </label>
                  <select
                    id="admin-room-status"
                    value={form.bookingStatus}
                    onChange={(e) => setF("bookingStatus", e.target.value)}
                    data-ocid="admin.room_status_select"
                    className="w-full px-3 py-2 rounded-lg text-sm font-body text-foreground outline-none transition-colors"
                    style={{
                      background: "oklch(0.09 0 0)",
                      border: `1px solid ${G.cardBorder}`,
                    }}
                  >
                    <option value="advance">🔵 Advance / Partial</option>
                    <option value="full">🔴 Full Payment</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <AdminInput
                  label="Total Amount (₹)"
                  value={form.totalAmount}
                  onChange={(v) => setF("totalAmount", v)}
                  type="number"
                />
                <AdminInput
                  label="Paid Amount (₹)"
                  value={form.paidAmount}
                  onChange={(v) => setF("paidAmount", v)}
                  type="number"
                />
                <AdminInput
                  label="Remaining (₹)"
                  value={form.remainingAmount}
                  onChange={(v) => setF("remainingAmount", v)}
                  type="number"
                />
              </div>
              <AdminTextarea
                label="Notes"
                value={form.notes}
                onChange={(v) => setF("notes", v)}
                rows={2}
              />
              <div className="flex justify-end gap-3 pt-1">
                <GoldButton variant="ghost" onClick={() => setShowForm(false)}>
                  Cancel
                </GoldButton>
                <GoldButton type="submit" disabled={addMutation.isPending}>
                  {addMutation.isPending ? "Saving..." : "Add Booking"}
                </GoldButton>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {isLoading && <LoadingSpinner />}
      {!isLoading && roomBookings.length === 0 && (
        <EmptyState icon="🛏" msg="No room bookings yet." />
      )}
      {!isLoading && roomBookings.length > 0 && (
        <div className="flex flex-col gap-3">
          {[...roomBookings]
            .sort((a, b) => b.checkInDate.localeCompare(a.checkInDate))
            .map((b: RoomBooking, i) => (
              <div
                key={Number(b.id)}
                data-ocid={`admin.room_booking.item.${i + 1}`}
                className="p-4 rounded-xl flex flex-col sm:flex-row sm:items-start gap-3"
                style={{
                  background: G.card,
                  border: `1px solid ${G.cardBorder}`,
                }}
              >
                <div className="flex-1 flex flex-col gap-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-display font-bold text-sm text-foreground">
                      {b.customerName}
                    </span>
                    <StatusBadge status={b.status} />
                    <span
                      className="px-2 py-0.5 rounded-full text-xs font-display font-bold"
                      style={{
                        background: G.goldBg,
                        color: G.gold,
                        border: `1px solid ${G.goldBorder}`,
                      }}
                    >
                      {Number(b.numberOfRooms)} room
                      {Number(b.numberOfRooms) > 1 ? "s" : ""}
                    </span>
                  </div>
                  <div
                    className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs"
                    style={{ color: G.muted }}
                  >
                    <span>
                      🗓 {b.checkInDate} → {b.checkOutDate}
                    </span>
                    <span>📞 {b.phoneNumber}</span>
                    {b.totalAmount > 0n && (
                      <span>
                        💰 ₹{Number(b.totalAmount).toLocaleString("en-IN")}
                      </span>
                    )}
                    {b.paidAmount > 0n && (
                      <span style={{ color: G.green }}>
                        ✓ ₹{Number(b.paidAmount).toLocaleString("en-IN")} paid
                      </span>
                    )}
                    {b.remainingAmount > 0n && (
                      <span style={{ color: G.red }}>
                        ⚠ ₹{Number(b.remainingAmount).toLocaleString("en-IN")}{" "}
                        due
                      </span>
                    )}
                  </div>
                  {b.notes && (
                    <p className="text-xs" style={{ color: G.muted }}>
                      {b.notes}
                    </p>
                  )}
                </div>
                <GoldButton
                  small
                  variant="danger"
                  onClick={() => handleDeleteRoom(b)}
                >
                  Delete
                </GoldButton>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

// ─── Tab 4: Photos ────────────────────────────────────────────────────────────
const PHOTO_CATEGORIES = [
  { id: "homepage-banner", label: "Homepage Banner" },
  { id: "surajgarh-garden", label: "Suraj Garh Garden" },
  { id: "sarita-green", label: "Sarita Green" },
  { id: "hari-om-garden", label: "Hari Om Garden" },
  { id: "banquet-hall-1", label: "Banquet Hall 1" },
  { id: "banquet-hall-2", label: "Banquet Hall 2" },
  { id: "rooms", label: "Rooms" },
  { id: "gallery", label: "Gallery" },
];

function PhotoCategoryView({ category }: { category: string }) {
  const { data: photos = [], isLoading } = usePhotosByCategory(category);
  const addPhoto = useAddPhoto();
  const deletePhoto = useDeletePhoto();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedFile) {
      toast.error("Please select an image file.");
      return;
    }
    setIsUploading(true);
    setUploadProgress(0);
    try {
      const uint8Array = new Uint8Array(await selectedFile.arrayBuffer());
      const externalBlob = ExternalBlob.fromBytes(uint8Array);
      externalBlob.withUploadProgress((pct: number) => setUploadProgress(pct));
      const fileUrl = externalBlob.getDirectURL();
      await addPhoto.mutateAsync({
        category,
        url: fileUrl,
        caption: caption.trim(),
        mediaType: "image",
        thumbnailUrl: null,
      });
      toast.success("Photo uploaded successfully");
      setSelectedFile(null);
      setPreviewUrl(null);
      setCaption("");
      setUploadProgress(0);
    } catch {
      toast.error("Failed to upload photo.");
    } finally {
      setIsUploading(false);
    }
  }

  async function handleDelete(photo: Photo) {
    if (!confirm("Delete this photo?")) return;
    try {
      await deletePhoto.mutateAsync({ id: photo.id, category });
      toast.success("Photo deleted");
    } catch {
      toast.error("Failed to delete photo.");
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Upload form */}
      <form
        onSubmit={handleAdd}
        data-ocid="admin.photo_add_form"
        className="p-4 rounded-xl flex flex-col gap-4"
        style={{ background: G.card, border: `1px solid ${G.goldBorder}` }}
      >
        <p
          className="text-xs font-display font-bold tracking-[0.15em] uppercase"
          style={{ color: G.goldDim }}
        >
          Add Photo
        </p>

        {/* File drop zone */}
        <label className="block">
          <span
            className="text-xs font-display font-semibold tracking-[0.12em] uppercase mb-2 block"
            style={{ color: G.muted }}
          >
            Select Image
          </span>
          <button
            type="button"
            className="w-full border-2 border-dashed rounded-lg p-5 text-center cursor-pointer transition-colors"
            style={{
              borderColor: previewUrl
                ? G.goldBorder
                : "oklch(0.35 0.04 80 / 0.5)",
              background: previewUrl ? G.goldBg : "transparent",
            }}
            onClick={() =>
              document.getElementById(`photo-file-input-${category}`)?.click()
            }
          >
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Preview"
                className="max-h-40 mx-auto rounded object-cover"
              />
            ) : (
              <div style={{ color: G.muted }}>
                <div className="text-3xl mb-1">📁</div>
                <p className="text-sm">Click to select an image</p>
                <p
                  className="text-xs mt-1"
                  style={{ color: "oklch(0.45 0.04 80)" }}
                >
                  Supports JPG, PNG, GIF, WebP
                </p>
              </div>
            )}
          </button>
          <input
            id={`photo-file-input-${category}`}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        {isUploading && (
          <div className="space-y-1">
            <div
              className="flex justify-between text-xs"
              style={{ color: G.muted }}
            >
              <span>Uploading...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div
              className="w-full rounded-full h-2"
              style={{ background: "oklch(0.18 0 0)" }}
            >
              <div
                className="h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%`, background: G.gold }}
              />
            </div>
          </div>
        )}

        <AdminInput
          label="Caption (optional)"
          value={caption}
          onChange={setCaption}
        />
        <div className="flex justify-end">
          <GoldButton type="submit" disabled={!selectedFile || isUploading}>
            {isUploading ? `Uploading ${uploadProgress}%...` : "Upload Photo"}
          </GoldButton>
        </div>
      </form>

      {/* Grid */}
      {isLoading ? (
        <LoadingSpinner />
      ) : photos.length === 0 ? (
        <EmptyState icon="🖼" msg="No photos in this category yet." />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {photos.map((photo: Photo, i) => (
            <div
              key={Number(photo.id)}
              data-ocid={`admin.photo.item.${i + 1}`}
              className="relative group rounded-xl overflow-hidden aspect-square"
              style={{ border: `1px solid ${G.cardBorder}` }}
            >
              <img
                src={photo.url}
                alt={photo.caption || "Photo"}
                className="w-full h-full object-cover"
              />
              <div
                className="absolute inset-0 flex flex-col justify-between p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: "oklch(0 0 0 / 0.6)" }}
              >
                {photo.caption && (
                  <p className="text-xs text-white truncate">{photo.caption}</p>
                )}
                <button
                  type="button"
                  onClick={() => handleDelete(photo)}
                  data-ocid={`admin.photo.delete_button.${i + 1}`}
                  className="self-end px-2 py-1 rounded-lg text-xs font-display font-bold transition-colors hover:opacity-90"
                  style={{
                    background: G.redBg,
                    color: G.red,
                    border: `1px solid ${G.redBorder}`,
                  }}
                  aria-label="Delete photo"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PhotosTab() {
  const [activeCategory, setActiveCategory] = useState(PHOTO_CATEGORIES[0].id);
  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div
        className="flex-shrink-0 flex gap-1 overflow-x-auto px-6 sm:px-8 py-3"
        style={{ borderBottom: "1px solid oklch(0.16 0 0)" }}
      >
        {PHOTO_CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setActiveCategory(c.id)}
            data-ocid={`admin.photo_category_tab.${c.id}`}
            className="whitespace-nowrap px-3 py-2 rounded-lg text-xs font-display font-bold tracking-wide transition-all"
            style={{
              background: activeCategory === c.id ? G.goldBg : "transparent",
              border: `1px solid ${activeCategory === c.id ? G.goldBorder : "transparent"}`,
              color: activeCategory === c.id ? G.gold : G.muted,
            }}
          >
            {c.label}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6">
        <SectionTitle>
          {PHOTO_CATEGORIES.find((c) => c.id === activeCategory)?.label}
        </SectionTitle>
        <p className="text-xs mb-6" style={{ color: G.muted }}>
          Upload photos for this section directly from your device.
        </p>
        <PhotoCategoryView category={activeCategory} />
      </div>
    </div>
  );
}

// ─── Tab 5: Content ───────────────────────────────────────────────────────────
const CONTENT_KEYS: { key: string; label: string; multiline?: boolean }[] = [
  { key: "homepageTitle", label: "Homepage Title" },
  { key: "homepageSubtitle", label: "Homepage Subtitle" },
  { key: "aboutSection", label: "About Section", multiline: true },
  {
    key: "surajGarhDescription",
    label: "Suraj Garh Description",
    multiline: true,
  },
  {
    key: "saritaGreenDescription",
    label: "Sarita Green Description",
    multiline: true,
  },
  {
    key: "hariOmDescription",
    label: "Hari Om Garden Description",
    multiline: true,
  },
  {
    key: "banquetHall1Description",
    label: "Banquet Hall 1 Description",
    multiline: true,
  },
  {
    key: "banquetHall2Description",
    label: "Banquet Hall 2 Description",
    multiline: true,
  },
  { key: "roomsDescription", label: "Rooms Description", multiline: true },
  { key: "galleryDescription", label: "Gallery Description", multiline: true },
  { key: "contactInfo", label: "Contact Info", multiline: true },
  { key: "contactAddress", label: "Contact Address", multiline: true },
  { key: "contactPhone", label: "Contact Phone" },
  { key: "contactEmail", label: "Contact Email" },
  { key: "offers", label: "Offers / Packages", multiline: true },
];

function ContentFieldRow({
  contentKey,
  label,
  multiline,
  currentValue,
}: {
  contentKey: string;
  label: string;
  multiline?: boolean;
  currentValue: string;
}) {
  const [value, setValue] = useState(currentValue);
  const updateContent = useUpdateSiteContent();

  useEffect(() => {
    setValue(currentValue);
  }, [currentValue]);

  async function handleSave() {
    try {
      await updateContent.mutateAsync({ key: contentKey, value });
      toast.success(`"${label}" saved`);
    } catch {
      toast.error(`Failed to save "${label}"`);
    }
  }

  return (
    <div
      className="p-4 rounded-xl flex flex-col gap-3"
      style={{ background: G.card, border: `1px solid ${G.cardBorder}` }}
    >
      {multiline ? (
        <AdminTextarea
          label={label}
          value={value}
          onChange={setValue}
          rows={3}
        />
      ) : (
        <AdminInput label={label} value={value} onChange={setValue} />
      )}
      <div className="flex justify-end">
        <GoldButton
          small
          onClick={handleSave}
          disabled={updateContent.isPending}
        >
          {updateContent.isPending ? "Saving..." : "Save"}
        </GoldButton>
      </div>
    </div>
  );
}

function ContentTab() {
  const { data: records = [], isLoading } = useAllSiteContent();
  const contentMap = new Map<string, string>();
  for (const r of records as ContentRecord[]) contentMap.set(r.key, r.value);

  return (
    <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6">
      <SectionTitle>Site Content Editor</SectionTitle>
      <p className="text-xs mb-6" style={{ color: G.muted }}>
        Edit website text. Each field has its own Save button — changes go live
        immediately.
      </p>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="flex flex-col gap-4 max-w-2xl">
          {CONTENT_KEYS.map(({ key, label, multiline }) => (
            <ContentFieldRow
              key={key}
              contentKey={key}
              label={label}
              multiline={multiline}
              currentValue={contentMap.get(key) ?? ""}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Tab 6: Announcements ────────────────────────────────────────────────────
type AnnouncementFormData = {
  title: string;
  body: string;
  publishDate: string;
  isActive: boolean;
};
const EMPTY_ANN_FORM: AnnouncementFormData = {
  title: "",
  body: "",
  publishDate: new Date().toISOString().slice(0, 10),
  isActive: true,
};

function AnnouncementsTab() {
  const { data: announcements = [], isLoading } = useAllAnnouncements();
  const addMutation = useAddAnnouncement();
  const updateMutation = useUpdateAnnouncement();
  const deleteMutation = useDeleteAnnouncement();
  const [form, setForm] = useState<AnnouncementFormData>(EMPTY_ANN_FORM);
  const [editId, setEditId] = useState<bigint | null>(null);
  const [showForm, setShowForm] = useState(false);

  function setF(k: keyof AnnouncementFormData, v: string | boolean) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function startEdit(a: Announcement) {
    setEditId(a.id);
    setForm({
      title: a.title,
      body: a.body,
      publishDate: a.publishDate,
      isActive: a.isActive,
    });
    setShowForm(true);
  }

  function cancelEdit() {
    setEditId(null);
    setForm(EMPTY_ANN_FORM);
    setShowForm(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.body.trim()) {
      toast.error("Title and body are required.");
      return;
    }
    try {
      if (editId !== null) {
        await updateMutation.mutateAsync({ id: editId, ...form });
        toast.success("Announcement updated");
      } else {
        await addMutation.mutateAsync(form);
        toast.success("Announcement added");
      }
      cancelEdit();
    } catch {
      toast.error("Failed to save announcement.");
    }
  }

  async function handleDelete(id: bigint, title: string) {
    if (!confirm(`Delete "${title}"?`)) return;
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Announcement deleted");
    } catch {
      toast.error("Failed to delete.");
    }
  }

  async function toggleActive(a: Announcement) {
    try {
      await updateMutation.mutateAsync({
        id: a.id,
        title: a.title,
        body: a.body,
        publishDate: a.publishDate,
        isActive: !a.isActive,
      });
      toast.success(a.isActive ? "Hidden from site" : "Now visible on site");
    } catch {
      toast.error("Failed to update.");
    }
  }

  const saving = addMutation.isPending || updateMutation.isPending;

  return (
    <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6">
      <div className="flex items-center justify-between mb-5">
        <SectionTitle>Announcements</SectionTitle>
        {!showForm && (
          <GoldButton onClick={() => setShowForm(true)}>
            + New Announcement
          </GoldButton>
        )}
      </div>

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            onSubmit={handleSubmit}
            data-ocid="admin.announcement_form"
            className="overflow-hidden mb-6"
          >
            <div
              className="p-5 rounded-xl flex flex-col gap-4"
              style={{
                background: G.card,
                border: `1px solid ${G.goldBorder}`,
              }}
            >
              <p
                className="text-xs font-display font-bold tracking-[0.15em] uppercase"
                style={{ color: G.goldDim }}
              >
                {editId ? "Edit Announcement" : "New Announcement"}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <AdminInput
                  label="Title"
                  value={form.title}
                  onChange={(v) => setF("title", v)}
                  required
                />
                <AdminInput
                  label="Publish Date"
                  value={form.publishDate}
                  onChange={(v) => setF("publishDate", v)}
                  type="date"
                />
              </div>
              <AdminTextarea
                label="Body"
                value={form.body}
                onChange={(v) => setF("body", v)}
                rows={4}
              />
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setF("isActive", !form.isActive)}
                  data-ocid="admin.announcement_active_toggle"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-display font-bold transition-all"
                  style={
                    form.isActive
                      ? {
                          background: G.greenBg,
                          color: G.green,
                          border: `1px solid ${G.greenBorder}`,
                        }
                      : {
                          background: G.goldBg,
                          color: G.muted,
                          border: `1px solid ${G.cardBorder}`,
                        }
                  }
                >
                  {form.isActive
                    ? "✓ Active (visible on site)"
                    : "Hidden (not visible)"}
                </button>
              </div>
              <div className="flex gap-3 justify-end pt-1">
                <GoldButton variant="ghost" onClick={cancelEdit}>
                  Cancel
                </GoldButton>
                <GoldButton type="submit" disabled={saving}>
                  {saving ? "Saving..." : editId ? "Update" : "Publish"}
                </GoldButton>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {isLoading && <LoadingSpinner />}
      {!isLoading && announcements.length === 0 && (
        <EmptyState icon="📣" msg="No announcements yet." />
      )}
      {!isLoading && announcements.length > 0 && (
        <div className="flex flex-col gap-3">
          {[...announcements]
            .sort((a, b) => b.publishDate.localeCompare(a.publishDate))
            .map((ann: Announcement, i) => (
              <div
                key={Number(ann.id)}
                data-ocid={`admin.announcement.item.${i + 1}`}
                className="p-4 rounded-xl flex flex-col gap-2"
                style={{
                  background: G.card,
                  border: `1px solid ${ann.isActive ? G.greenBorder : G.cardBorder}`,
                }}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-display font-bold text-sm text-foreground">
                        {ann.title}
                      </span>
                      <span
                        className="px-2 py-0.5 rounded-full text-xs font-display font-bold"
                        style={
                          ann.isActive
                            ? {
                                background: G.greenBg,
                                color: G.green,
                                border: `1px solid ${G.greenBorder}`,
                              }
                            : {
                                background: G.goldBg,
                                color: G.muted,
                                border: `1px solid ${G.cardBorder}`,
                              }
                        }
                      >
                        {ann.isActive ? "Active" : "Hidden"}
                      </span>
                    </div>
                    <p className="text-xs mt-1" style={{ color: G.muted }}>
                      {ann.publishDate}
                    </p>
                    <p className="text-sm mt-2 text-foreground/80 line-clamp-2">
                      {ann.body}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1.5 flex-shrink-0">
                    <GoldButton
                      small
                      variant="ghost"
                      onClick={() => toggleActive(ann)}
                    >
                      {ann.isActive ? "Hide" : "Show"}
                    </GoldButton>
                    <GoldButton
                      small
                      variant="ghost"
                      onClick={() => startEdit(ann)}
                    >
                      Edit
                    </GoldButton>
                    <GoldButton
                      small
                      variant="danger"
                      onClick={() => handleDelete(ann.id, ann.title)}
                    >
                      Delete
                    </GoldButton>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

// ─── Shared utility components ────────────────────────────────────────────────
function LoadingSpinner() {
  return (
    <div
      data-ocid="admin.loading_state"
      className="flex flex-col items-center justify-center gap-4 py-16"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
        className="w-10 h-10 rounded-full"
        style={{ border: "2px solid oklch(0.22 0 0)", borderTopColor: G.gold }}
      />
      <p className="text-sm font-display" style={{ color: G.muted }}>
        Loading...
      </p>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function _ErrorMsg({ msg }: { msg: string }) {
  return (
    <div
      data-ocid="admin.error_state"
      className="flex items-center justify-center py-16"
    >
      <p className="text-sm font-display" style={{ color: G.red }}>
        {msg}
      </p>
    </div>
  );
}

function EmptyState({ icon, msg }: { icon: string; msg: string }) {
  return (
    <div
      data-ocid="admin.empty_state"
      className="flex flex-col items-center justify-center gap-3 py-20 text-center"
    >
      <span className="text-4xl opacity-40">{icon}</span>
      <p className="text-sm font-display" style={{ color: G.muted }}>
        {msg}
      </p>
    </div>
  );
}

// ─── Gallery Manager Tab ─────────────────────────────────────────────────────
function GalleryManagerTab() {
  const { data: photos = [], isLoading } = usePhotosByCategory("gallery");
  const addPhoto = useAddPhoto();
  const deletePhoto = useDeletePhoto();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _reorder = useReorderGalleryMedia();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedFile) {
      toast.error("Please select a file.");
      return;
    }
    setIsUploading(true);
    setUploadProgress(0);
    try {
      const uint8Array = new Uint8Array(await selectedFile.arrayBuffer());
      const externalBlob = ExternalBlob.fromBytes(uint8Array);
      externalBlob.withUploadProgress((pct: number) => setUploadProgress(pct));
      const fileUrl = externalBlob.getDirectURL();
      const detectedMediaType = selectedFile.type.startsWith("video/")
        ? "video"
        : "image";
      await addPhoto.mutateAsync({
        category: "gallery",
        url: fileUrl,
        caption: caption.trim(),
        mediaType: detectedMediaType,
        thumbnailUrl: null,
      });
      toast.success("Media uploaded successfully!");
      setSelectedFile(null);
      setPreviewUrl(null);
      setCaption("");
      setUploadProgress(0);
    } catch {
      toast.error("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  }

  async function handleDelete(photo: Photo) {
    if (!confirm("Remove this item from the gallery?")) return;
    try {
      await deletePhoto.mutateAsync({ id: photo.id, category: "gallery" });
      toast.success("Media removed from gallery");
    } catch {
      toast.error("Failed to delete media.");
    }
  }

  return (
    <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6">
      <SectionTitle>Gallery Media Manager</SectionTitle>
      <p className="text-xs mb-6" style={{ color: G.muted }}>
        Upload images and videos directly from your device. Media appears live
        on the public site.
      </p>

      {/* Upload form */}
      <form
        onSubmit={handleAdd}
        data-ocid="admin.gallery_add_form"
        className="p-5 rounded-xl flex flex-col gap-4 mb-8"
        style={{ background: G.card, border: `1px solid ${G.goldBorder}` }}
      >
        <p
          className="text-xs font-display font-bold tracking-[0.15em] uppercase"
          style={{ color: G.goldDim }}
        >
          Add Media
        </p>

        {/* File drop zone */}
        <label className="block">
          <span
            className="text-xs font-display font-semibold tracking-[0.12em] uppercase mb-2 block"
            style={{ color: G.muted }}
          >
            Select Photo or Video
          </span>
          <button
            type="button"
            className="w-full border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors"
            style={{
              borderColor: previewUrl
                ? G.goldBorder
                : "oklch(0.35 0.04 80 / 0.5)",
              background: previewUrl ? G.goldBg : "transparent",
            }}
            onClick={() =>
              document.getElementById("gallery-file-input")?.click()
            }
          >
            {previewUrl ? (
              selectedFile?.type.startsWith("video/") ? (
                <video
                  src={previewUrl}
                  className="max-h-48 mx-auto rounded"
                  controls
                >
                  <track kind="captions" />
                </video>
              ) : (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-h-48 mx-auto rounded object-cover"
                />
              )
            ) : (
              <div style={{ color: G.muted }}>
                <div className="text-4xl mb-2">📁</div>
                <p className="text-sm">Click to select an image or video</p>
                <p
                  className="text-xs mt-1"
                  style={{ color: "oklch(0.45 0.04 80)" }}
                >
                  Supports JPG, PNG, GIF, WebP, MP4, WebM
                </p>
              </div>
            )}
          </button>
          <input
            id="gallery-file-input"
            type="file"
            accept="image/*,video/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        {isUploading && (
          <div className="space-y-1">
            <div
              className="flex justify-between text-xs"
              style={{ color: G.muted }}
            >
              <span>Uploading...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div
              className="w-full rounded-full h-2"
              style={{ background: "oklch(0.18 0 0)" }}
            >
              <div
                className="h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%`, background: G.gold }}
              />
            </div>
          </div>
        )}

        <AdminInput
          label="Caption (optional)"
          value={caption}
          onChange={setCaption}
          placeholder="Add a short caption..."
        />

        <div className="flex justify-end">
          <GoldButton type="submit" disabled={!selectedFile || isUploading}>
            {isUploading
              ? `Uploading ${uploadProgress}%...`
              : "Upload to Gallery"}
          </GoldButton>
        </div>
      </form>

      {/* Gallery grid */}
      {isLoading ? (
        <LoadingSpinner />
      ) : photos.length === 0 ? (
        <EmptyState
          icon="🖼"
          msg="No media in the gallery yet. Upload images or videos above."
        />
      ) : (
        <>
          <p
            className="text-xs font-display font-bold tracking-[0.15em] uppercase mb-4"
            style={{ color: G.goldDim }}
          >
            {photos.length} item{photos.length !== 1 ? "s" : ""} in gallery
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {photos.map((photo: Photo, i) => (
              <div
                key={Number(photo.id)}
                data-ocid={`admin.gallery.item.${i + 1}`}
                className="relative group rounded-xl overflow-hidden aspect-square"
                style={{ border: `1px solid ${G.cardBorder}` }}
              >
                <img
                  src={(photo.thumbnailUrl as string | undefined) || photo.url}
                  alt={photo.caption || "Gallery media"}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display =
                      "none";
                  }}
                />
                {/* Media type badge */}
                <span
                  className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-display font-bold"
                  style={{
                    background:
                      photo.mediaType === "video" ? G.blueBg : G.goldBg,
                    color: photo.mediaType === "video" ? G.blue : G.gold,
                    border: `1px solid ${
                      photo.mediaType === "video" ? G.blueBorder : G.goldBorder
                    }`,
                  }}
                >
                  {photo.mediaType === "video" ? "🎬" : "🖼"}
                </span>
                {/* Hover overlay */}
                <div
                  className="absolute inset-0 flex flex-col justify-between p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: "oklch(0 0 0 / 0.65)" }}
                >
                  {photo.caption && (
                    <p className="text-xs text-white truncate mt-6">
                      {photo.caption}
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDelete(photo)}
                    data-ocid={`admin.gallery.delete_button.${i + 1}`}
                    className="self-end px-2 py-1 rounded-lg text-xs font-display font-bold transition-colors hover:opacity-90"
                    style={{
                      background: G.redBg,
                      color: G.red,
                      border: `1px solid ${G.redBorder}`,
                    }}
                    aria-label="Delete media"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Main AdminPanel ──────────────────────────────────────────────────────────
const TABS = [
  { id: "inquiries", label: "💬 Enquiries" },
  { id: "venues", label: "🏛 Venues" },
  { id: "rooms", label: "🛏 Rooms" },
  { id: "photos", label: "🖼 Photos" },
  { id: "gallery", label: "🖼️ Gallery Manager" },
  { id: "content", label: "✏️ Content" },
  { id: "announcements", label: "📣 Announcements" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function AdminPanel({ onClose }: { onClose: () => void }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("inquiries");

  if (!authenticated) {
    return (
      <AnimatePresence>
        <PasswordGate
          onSuccess={() => setAuthenticated(true)}
          onClose={onClose}
        />
      </AnimatePresence>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      data-ocid="admin.panel"
      className="fixed inset-0 z-[9999] flex flex-col"
      style={{ background: G.surface }}
    >
      {/* Top shimmer */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${G.gold}, transparent)`,
        }}
      />
      <div
        className="absolute top-0 right-0 w-[500px] h-[400px] blur-[160px] opacity-[0.04] pointer-events-none"
        style={{ background: G.gold }}
      />

      {/* Header */}
      <div
        className="relative flex-shrink-0 flex items-center justify-between px-6 sm:px-8 py-4"
        style={{ borderBottom: "1px solid oklch(0.18 0 0)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0"
            style={{
              background: G.goldBg,
              border: `1px solid ${G.goldBorder}`,
            }}
          >
            🏰
          </div>
          <div>
            <h1
              className="font-display font-bold text-xl tracking-wide"
              style={{ color: G.gold }}
            >
              Admin Panel
            </h1>
            <p
              className="text-xs font-display tracking-[0.2em] uppercase"
              style={{ color: G.muted }}
            >
              SURAJGARH RESORT
            </p>
          </div>
        </div>
        <button
          type="button"
          data-ocid="admin.close_button"
          onClick={onClose}
          aria-label="Close admin panel"
          className="flex items-center justify-center w-9 h-9 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
          style={{ border: "1px solid oklch(0.24 0 0)" }}
        >
          ✕
        </button>
      </div>

      {/* Tab bar */}
      <div
        className="flex-shrink-0 flex gap-1 overflow-x-auto px-6 sm:px-8 pt-3 pb-0"
        style={{ borderBottom: "1px solid oklch(0.16 0 0)" }}
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            data-ocid={`admin.tab.${tab.id}`}
            className="whitespace-nowrap px-5 py-2.5 text-sm font-display font-bold tracking-wide rounded-t-lg transition-all"
            style={{
              background:
                activeTab === tab.id
                  ? "oklch(0.14 0.02 80 / 0.8)"
                  : "transparent",
              borderTop:
                activeTab === tab.id
                  ? `1px solid ${G.goldBorder}`
                  : "1px solid transparent",
              borderLeft:
                activeTab === tab.id
                  ? "1px solid oklch(0.72 0.16 80 / 0.2)"
                  : "1px solid transparent",
              borderRight:
                activeTab === tab.id
                  ? "1px solid oklch(0.72 0.16 80 / 0.2)"
                  : "1px solid transparent",
              borderBottom:
                activeTab === tab.id
                  ? "1px solid oklch(0.14 0.02 80 / 0.8)"
                  : "1px solid transparent",
              color: activeTab === tab.id ? G.gold : G.muted,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="flex-1 overflow-hidden flex flex-col"
          >
            {activeTab === "inquiries" && <InquiriesTab />}
            {activeTab === "venues" && <VenuesTab />}
            {activeTab === "rooms" && <RoomsTab />}
            {activeTab === "photos" && <PhotosTab />}
            {activeTab === "gallery" && <GalleryManagerTab />}
            {activeTab === "content" && <ContentTab />}
            {activeTab === "announcements" && <AnnouncementsTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
