import Types "../types/photos";
import List "mo:core/List";
import Time "mo:core/Time";

module {
  public func add(
    items : List.List<Types.Photo>,
    state : { var nextPhotoId : Nat },
    category : Types.PhotoCategory,
    url : Text,
    caption : Text,
    mediaType : Text,
    thumbnailUrl : ?Text,
  ) : Nat {
    let id = state.nextPhotoId;
    state.nextPhotoId += 1;
    let order = items.size();
    items.add({ id; category; url; caption; order; uploadedAt = Time.now(); mediaType; thumbnailUrl });
    id
  };

  public func remove(items : List.List<Types.Photo>, id : Nat) : Bool {
    let before = items.size();
    items.retain(func(p) { p.id != id });
    items.size() < before
  };

  public func getByCategory(items : List.List<Types.Photo>, category : Types.PhotoCategory) : [Types.Photo] {
    items.filter(func(p) { p.category == category }).toArray()
  };

  public func reorder(items : List.List<Types.Photo>, id : Nat, newOrder : Nat) : Bool {
    var found = false;
    items.mapInPlace(func(p) {
      if (p.id == id) {
        found := true;
        { p with order = newOrder }
      } else p
    });
    found
  };

  public func reorderGallery(items : List.List<Types.Photo>, orderedIds : [Nat]) : Bool {
    var idx = 0;
    for (targetId in orderedIds.vals()) {
      items.mapInPlace(func(p) {
        if (p.id == targetId) { { p with order = idx } } else p
      });
      idx += 1;
    };
    true
  };
}
