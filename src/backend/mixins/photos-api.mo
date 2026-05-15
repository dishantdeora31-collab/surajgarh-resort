import List "mo:core/List";
import PhotosLib "../lib/photos";
import Types "../types/photos";

mixin (
  photos : List.List<Types.Photo>,
  state : { var nextPhotoId : Nat },
) {
  public func addPhoto(
    category : Types.PhotoCategory,
    url : Text,
    caption : Text,
    mediaType : Text,
    thumbnailUrl : ?Text,
  ) : async Nat {
    PhotosLib.add(photos, state, category, url, caption, mediaType, thumbnailUrl);
  };

  public func deletePhoto(id : Nat) : async Bool {
    PhotosLib.remove(photos, id);
  };

  public query func getPhotosByCategory(category : Types.PhotoCategory) : async [Types.Photo] {
    PhotosLib.getByCategory(photos, category);
  };

  public func reorderPhoto(id : Nat, newOrder : Nat) : async Bool {
    PhotosLib.reorder(photos, id, newOrder);
  };

  public func reorderGalleryMedia(orderedIds : [Nat]) : async Bool {
    PhotosLib.reorderGallery(photos, orderedIds);
  };
};
