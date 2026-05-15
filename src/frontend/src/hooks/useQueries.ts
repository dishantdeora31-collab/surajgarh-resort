// Barrel re-export — all hooks available from a single import path
export {
  useVenueBookedDates,
  usePublicRoomStatus,
} from "./useBookings";

export {
  useActiveAnnouncements,
  useAllAnnouncements,
} from "./useAnnouncements";

export { usePhotosByCategory } from "./usePhotos";

export {
  useAllSiteContent,
  useSiteContent,
  useContentMap,
} from "./useSiteContent";

export { useOrders, useSubmitOrder } from "./useOrders";
export {
  useAllInquiries,
  useSubmitInquiry,
  useDeleteInquiry,
} from "./useInquiries";

export {
  useVenueBookings,
  useAllRoomBookings,
  useAddVenueBooking,
  useUpdateVenueBooking,
  useDeleteVenueBooking,
  useAddRoomBooking,
  useDeleteRoomBooking,
} from "./useAdminBookings";

export {
  useUpdateSiteContent,
  useVerifyAdminPassword,
} from "./useAdminContent";

export { useAddPhoto, useDeletePhoto } from "./useAdminPhotos";

export {
  useAddAnnouncement,
  useUpdateAnnouncement,
  useDeleteAnnouncement,
} from "./useAdminAnnouncements";
