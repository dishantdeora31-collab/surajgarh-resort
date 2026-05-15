import List "mo:core/List";
import RoomBookingsLib "../lib/room-bookings";
import Types "../types/room-bookings";
import Common "../types/common";

mixin (
  bookings : List.List<Types.RoomBooking>,
  state : { var nextRoomBookingId : Nat },
) {
  public func addRoomBooking(
    checkInDate : Text,
    checkOutDate : Text,
    numberOfRooms : Nat,
    customerName : Text,
    phoneNumber : Text,
    aadhaarNumber : Text,
    totalAmount : Nat,
    paidAmount : Nat,
    remainingAmount : Nat,
    notes : Text,
    bookingStatus : Common.BookingStatus,
  ) : async Nat {
    RoomBookingsLib.add(bookings, state, checkInDate, checkOutDate, numberOfRooms, customerName, phoneNumber, aadhaarNumber, totalAmount, paidAmount, remainingAmount, notes, bookingStatus);
  };

  public func updateRoomBooking(
    id : Nat,
    checkInDate : Text,
    checkOutDate : Text,
    numberOfRooms : Nat,
    customerName : Text,
    phoneNumber : Text,
    aadhaarNumber : Text,
    totalAmount : Nat,
    paidAmount : Nat,
    remainingAmount : Nat,
    notes : Text,
    bookingStatus : Common.BookingStatus,
  ) : async Bool {
    RoomBookingsLib.update(bookings, id, checkInDate, checkOutDate, numberOfRooms, customerName, phoneNumber, aadhaarNumber, totalAmount, paidAmount, remainingAmount, notes, bookingStatus);
  };

  public func deleteRoomBooking(id : Nat) : async Bool {
    RoomBookingsLib.remove(bookings, id);
  };

  public query func getAllRoomBookings() : async [Types.RoomBooking] {
    RoomBookingsLib.getAll(bookings);
  };

  public query func getRoomAvailability(date : Text) : async Types.RoomAvailability {
    RoomBookingsLib.getAvailability(bookings, date);
  };

  public query func getPublicRoomStatus(date : Text) : async Types.PublicRoomStatus {
    RoomBookingsLib.getPublicStatus(bookings, date);
  };
};
