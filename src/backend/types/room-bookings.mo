import Common "common";

module {
  public let totalRooms : Nat = 60;

  public type RoomBooking = {
    id : Nat;
    checkInDate : Text; // YYYY-MM-DD
    checkOutDate : Text; // YYYY-MM-DD
    numberOfRooms : Nat;
    customerName : Text;
    phoneNumber : Text;
    aadhaarNumber : Text;
    totalAmount : Nat;
    paidAmount : Nat;
    remainingAmount : Nat;
    notes : Text;
    status : Common.BookingStatus;
    createdAt : Common.Timestamp;
  };

  public type RoomAvailability = {
    date : Text;
    bookedCount : Nat;
    availableCount : Nat;
  };

  // Public-safe: only shows availability, no customer details
  public type PublicRoomStatus = {
    date : Text;
    isFullyBooked : Bool;
    availableCount : Nat;
  };
};
