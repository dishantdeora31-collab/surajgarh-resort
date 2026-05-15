import Types "../types/announcements";
import List "mo:core/List";
import Time "mo:core/Time";

module {
  public func add(
    items : List.List<Types.Announcement>,
    state : { var nextAnnouncementId : Nat },
    title : Text,
    body : Text,
    publishDate : Text,
    isActive : Bool,
  ) : Nat {
    let id = state.nextAnnouncementId;
    state.nextAnnouncementId += 1;
    items.add({ id; title; body; publishDate; isActive; createdAt = Time.now() });
    id
  };

  public func update(
    items : List.List<Types.Announcement>,
    id : Nat,
    title : Text,
    body : Text,
    publishDate : Text,
    isActive : Bool,
  ) : Bool {
    var found = false;
    items.mapInPlace(func(a) {
      if (a.id == id) {
        found := true;
        { a with title; body; publishDate; isActive }
      } else a
    });
    found
  };

  public func remove(items : List.List<Types.Announcement>, id : Nat) : Bool {
    let before = items.size();
    items.retain(func(a) { a.id != id });
    items.size() < before
  };

  public func getActive(items : List.List<Types.Announcement>) : [Types.Announcement] {
    items.filter(func(a) { a.isActive }).toArray()
  };

  public func getAll(items : List.List<Types.Announcement>) : [Types.Announcement] {
    items.toArray()
  };
}
