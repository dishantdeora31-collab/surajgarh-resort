import List "mo:core/List";
import VenueBookingsLib "../lib/venue-bookings";
import Types "../types/venue-bookings";
import Common "../types/common";

mixin (
  bookings : List.List<Types.VenueBooking>,
  state : { var nextBookingId : Nat },
) {
  public func addVenueBooking(
    venueId : Common.VenueId,
    date : Text,
    customerName : Text,
    phoneNumber : Text,
    aadhaarNumber : Text,
    totalAmount : Nat,
    paidAmount : Nat,
    remainingAmount : Nat,
    notes : Text,
    bookingStatus : Common.BookingStatus,
  ) : async Nat {
    VenueBookingsLib.add(bookings, state, venueId, date, customerName, phoneNumber, aadhaarNumber, totalAmount, paidAmount, remainingAmount, notes, bookingStatus);
  };

  public func updateVenueBooking(
    id : Nat,
    customerName : Text,
    phoneNumber : Text,
    aadhaarNumber : Text,
    totalAmount : Nat,
    paidAmount : Nat,
    remainingAmount : Nat,
    notes : Text,
    bookingStatus : Common.BookingStatus,
  ) : async Bool {
    VenueBookingsLib.update(bookings, id, customerName, phoneNumber, aadhaarNumber, totalAmount, paidAmount, remainingAmount, notes, bookingStatus);
  };

  public func deleteVenueBooking(id : Nat) : async Bool {
    VenueBookingsLib.remove(bookings, id);
  };

  public query func getVenueBookings(venueId : Common.VenueId) : async [Types.VenueBooking] {
    VenueBookingsLib.getByVenue(bookings, venueId);
  };

  public query func getVenueBookedDates(venueId : Common.VenueId) : async [Types.PublicBookedDate] {
    VenueBookingsLib.getPublicDates(bookings, venueId);
  };
};
