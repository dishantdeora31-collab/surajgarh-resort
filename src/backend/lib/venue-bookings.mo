import Types "../types/venue-bookings";
import List "mo:core/List";
import Time "mo:core/Time";

module {
  public func add(
    items : List.List<Types.VenueBooking>,
    state : { var nextBookingId : Nat },
    venueId : Text,
    date : Text,
    customerName : Text,
    phoneNumber : Text,
    aadhaarNumber : Text,
    totalAmount : Nat,
    paidAmount : Nat,
    remainingAmount : Nat,
    notes : Text,
    status : Text,
  ) : Nat {
    let id = state.nextBookingId;
    state.nextBookingId += 1;
    items.add({ id; venueId; date; customerName; phoneNumber; aadhaarNumber; totalAmount; paidAmount; remainingAmount; notes; status; createdAt = Time.now() });
    id
  };

  public func update(
    items : List.List<Types.VenueBooking>,
    id : Nat,
    customerName : Text,
    phoneNumber : Text,
    aadhaarNumber : Text,
    totalAmount : Nat,
    paidAmount : Nat,
    remainingAmount : Nat,
    notes : Text,
    status : Text,
  ) : Bool {
    var found = false;
    items.mapInPlace(func(b) {
      if (b.id == id) {
        found := true;
        { b with customerName; phoneNumber; aadhaarNumber; totalAmount; paidAmount; remainingAmount; notes; status }
      } else b
    });
    found
  };

  public func remove(items : List.List<Types.VenueBooking>, id : Nat) : Bool {
    let before = items.size();
    items.retain(func(b) { b.id != id });
    items.size() < before
  };

  public func getByVenue(items : List.List<Types.VenueBooking>, venueId : Text) : [Types.VenueBooking] {
    items.filter(func(b) { b.venueId == venueId }).toArray()
  };

  public func getPublicDates(items : List.List<Types.VenueBooking>, venueId : Text) : [Types.PublicBookedDate] {
    items
      .filter(func(b) { b.venueId == venueId })
      .map<Types.VenueBooking, Types.PublicBookedDate>(func(b) { { date = b.date; status = "booked" } })
      .toArray()
  };
}
