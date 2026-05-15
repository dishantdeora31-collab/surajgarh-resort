import List "mo:core/List";
import Map "mo:core/Map";
import VenueBookingsApi "mixins/venue-bookings-api";
import RoomBookingsApi "mixins/room-bookings-api";
import PhotosApi "mixins/photos-api";
import SiteContentApi "mixins/site-content-api";
import AnnouncementsApi "mixins/announcements-api";
import InquiriesApi "mixins/inquiries-api";
import AdminAuthApi "mixins/admin-auth-api";
import VenueBookingTypes "types/venue-bookings";
import RoomBookingTypes "types/room-bookings";
import PhotoTypes "types/photos";
import SiteContentTypes "types/site-content";
import AnnouncementTypes "types/announcements";
import InquiryTypes "types/inquiries";
import MixinObjectStorage "mo:caffeineai-object-storage/Mixin";





actor {
  // Venue bookings state
  let venueBookings = List.empty<VenueBookingTypes.VenueBooking>();
  let venueState = { var nextBookingId : Nat = 0 };

  // Room bookings state
  let roomBookings = List.empty<RoomBookingTypes.RoomBooking>();
  let roomState = { var nextRoomBookingId : Nat = 0 };

  // Photos state
  let photos = List.empty<PhotoTypes.Photo>();
  let photoState = { var nextPhotoId : Nat = 0 };

  // Site content state (key-value map)
  let siteContent = Map.empty<Text, SiteContentTypes.ContentRecord>();

  // Announcements state
  let announcements = List.empty<AnnouncementTypes.Announcement>();
  let announcementState = { var nextAnnouncementId : Nat = 0 };

  // Customer inquiries state
  let inquiries = List.empty<InquiryTypes.Inquiry>();
  let inquiryState = { var nextInquiryId : Nat = 0 };

  // Admin auth state
  let adminAuth = { var passwordHash : Text = "surajgarh77" };

  include VenueBookingsApi(venueBookings, venueState);
  include RoomBookingsApi(roomBookings, roomState);
  include PhotosApi(photos, photoState);
  include SiteContentApi(siteContent);
  include AnnouncementsApi(announcements, announcementState);
  include InquiriesApi(inquiries, inquiryState);
  include AdminAuthApi(adminAuth);
  include MixinObjectStorage();
};

