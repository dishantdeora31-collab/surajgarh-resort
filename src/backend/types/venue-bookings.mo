import Common "common";

module {
  public type VenueBooking = {
    id : Nat;
    venueId : Common.VenueId;
    date : Text; // YYYY-MM-DD
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

  // Public-safe type — no customer details
  public type PublicBookedDate = {
    date : Text;
    status : Common.BookingStatus;
  };
};
