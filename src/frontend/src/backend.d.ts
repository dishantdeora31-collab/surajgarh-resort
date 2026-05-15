import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface RoomAvailability {
    date: string;
    bookedCount: bigint;
    availableCount: bigint;
}
export type Timestamp = bigint;
export interface ContentRecord {
    key: string;
    value: string;
    updatedAt: Timestamp;
}
export interface RoomBooking {
    id: bigint;
    customerName: string;
    status: BookingStatus;
    remainingAmount: bigint;
    createdAt: Timestamp;
    numberOfRooms: bigint;
    checkInDate: string;
    totalAmount: bigint;
    notes: string;
    checkOutDate: string;
    aadhaarNumber: string;
    phoneNumber: string;
    paidAmount: bigint;
}
export interface PublicRoomStatus {
    date: string;
    availableCount: bigint;
    isFullyBooked: boolean;
}
export interface PublicBookedDate {
    status: BookingStatus;
    date: string;
}
export type BookingStatus = string;
export type PhotoCategory = string;
export type VenueId = string;
export interface VenueBooking {
    id: bigint;
    customerName: string;
    status: BookingStatus;
    remainingAmount: bigint;
    venueId: VenueId;
    date: string;
    createdAt: Timestamp;
    totalAmount: bigint;
    notes: string;
    aadhaarNumber: string;
    phoneNumber: string;
    paidAmount: bigint;
}
export interface Announcement {
    id: bigint;
    title: string;
    publishDate: string;
    body: string;
    createdAt: Timestamp;
    isActive: boolean;
}
export interface Inquiry {
    id: bigint;
    inquiryType: string;
    name: string;
    submittedAt: Timestamp;
    email: string;
    message: string;
    phone: string;
}
export interface Photo {
    id: bigint;
    url: string;
    thumbnailUrl?: string;
    order: bigint;
    caption: string;
    mediaType: string;
    category: PhotoCategory;
    uploadedAt: Timestamp;
}
export interface backendInterface {
    addAnnouncement(title: string, body: string, publishDate: string, isActive: boolean): Promise<bigint>;
    addPhoto(category: PhotoCategory, url: string, caption: string, mediaType: string, thumbnailUrl: string | null): Promise<bigint>;
    addRoomBooking(checkInDate: string, checkOutDate: string, numberOfRooms: bigint, customerName: string, phoneNumber: string, aadhaarNumber: string, totalAmount: bigint, paidAmount: bigint, remainingAmount: bigint, notes: string, bookingStatus: BookingStatus): Promise<bigint>;
    addVenueBooking(venueId: VenueId, date: string, customerName: string, phoneNumber: string, aadhaarNumber: string, totalAmount: bigint, paidAmount: bigint, remainingAmount: bigint, notes: string, bookingStatus: BookingStatus): Promise<bigint>;
    deleteAnnouncement(id: bigint): Promise<boolean>;
    deleteInquiry(id: bigint): Promise<boolean>;
    deletePhoto(id: bigint): Promise<boolean>;
    deleteRoomBooking(id: bigint): Promise<boolean>;
    deleteVenueBooking(id: bigint): Promise<boolean>;
    getActiveAnnouncements(): Promise<Array<Announcement>>;
    getAllAnnouncements(): Promise<Array<Announcement>>;
    getAllContentKeys(): Promise<Array<string>>;
    getAllInquiries(): Promise<Array<Inquiry>>;
    getAllRoomBookings(): Promise<Array<RoomBooking>>;
    getAllSiteContent(): Promise<Array<ContentRecord>>;
    getPhotosByCategory(category: PhotoCategory): Promise<Array<Photo>>;
    getPublicRoomStatus(date: string): Promise<PublicRoomStatus>;
    getRoomAvailability(date: string): Promise<RoomAvailability>;
    getSiteContent(key: string): Promise<ContentRecord | null>;
    getVenueBookedDates(venueId: VenueId): Promise<Array<PublicBookedDate>>;
    getVenueBookings(venueId: VenueId): Promise<Array<VenueBooking>>;
    reorderGalleryMedia(orderedIds: Array<bigint>): Promise<boolean>;
    reorderPhoto(id: bigint, newOrder: bigint): Promise<boolean>;
    submitInquiry(name: string, phone: string, email: string, inquiryType: string, message: string): Promise<bigint>;
    updateAnnouncement(id: bigint, title: string, body: string, publishDate: string, isActive: boolean): Promise<boolean>;
    updateRoomBooking(id: bigint, checkInDate: string, checkOutDate: string, numberOfRooms: bigint, customerName: string, phoneNumber: string, aadhaarNumber: string, totalAmount: bigint, paidAmount: bigint, remainingAmount: bigint, notes: string, bookingStatus: BookingStatus): Promise<boolean>;
    updateSiteContent(key: string, value: string): Promise<void>;
    updateVenueBooking(id: bigint, customerName: string, phoneNumber: string, aadhaarNumber: string, totalAmount: bigint, paidAmount: bigint, remainingAmount: bigint, notes: string, bookingStatus: BookingStatus): Promise<boolean>;
    verifyAdminPassword(password: string): Promise<boolean>;
}
