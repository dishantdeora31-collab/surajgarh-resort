import Types "../types/room-bookings";
import List "mo:core/List";
import Time "mo:core/Time";

module {
  public func add(
    items : List.List<Types.RoomBooking>,
    state : { var nextRoomBookingId : Nat },
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
    status : Text,
  ) : Nat {
    let id = state.nextRoomBookingId;
    state.nextRoomBookingId += 1;
    items.add({ id; checkInDate; checkOutDate; numberOfRooms; customerName; phoneNumber; aadhaarNumber; totalAmount; paidAmount; remainingAmount; notes; status; createdAt = Time.now() });
    id
  };

  public func update(
    items : List.List<Types.RoomBooking>,
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
    status : Text,
  ) : Bool {
    var found = false;
    items.mapInPlace(func(b) {
      if (b.id == id) {
        found := true;
        { b with checkInDate; checkOutDate; numberOfRooms; customerName; phoneNumber; aadhaarNumber; totalAmount; paidAmount; remainingAmount; notes; status }
      } else b
    });
    found
  };

  public func remove(items : List.List<Types.RoomBooking>, id : Nat) : Bool {
    let before = items.size();
    items.retain(func(b) { b.id != id });
    items.size() < before
  };

  public func getAll(items : List.List<Types.RoomBooking>) : [Types.RoomBooking] {
    items.toArray()
  };

  public func getAvailability(items : List.List<Types.RoomBooking>, date : Text) : Types.RoomAvailability {
    var booked : Nat = 0;
    for (b in items.values()) {
      if (b.checkInDate <= date and date <= b.checkOutDate) {
        booked += b.numberOfRooms;
      };
    };
    let available = if (booked >= Types.totalRooms) 0 else Types.totalRooms - booked;
    { date; bookedCount = booked; availableCount = available }
  };

  public func getPublicStatus(items : List.List<Types.RoomBooking>, date : Text) : Types.PublicRoomStatus {
    let avail = getAvailability(items, date);
    { date; isFullyBooked = avail.availableCount == 0; availableCount = avail.availableCount }
  };
}
