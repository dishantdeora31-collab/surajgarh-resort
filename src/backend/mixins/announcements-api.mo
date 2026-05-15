import List "mo:core/List";
import AnnouncementsLib "../lib/announcements";
import Types "../types/announcements";

mixin (
  announcements : List.List<Types.Announcement>,
  state : { var nextAnnouncementId : Nat },
) {
  public func addAnnouncement(
    title : Text,
    body : Text,
    publishDate : Text,
    isActive : Bool,
  ) : async Nat {
    AnnouncementsLib.add(announcements, state, title, body, publishDate, isActive);
  };

  public func updateAnnouncement(
    id : Nat,
    title : Text,
    body : Text,
    publishDate : Text,
    isActive : Bool,
  ) : async Bool {
    AnnouncementsLib.update(announcements, id, title, body, publishDate, isActive);
  };

  public func deleteAnnouncement(id : Nat) : async Bool {
    AnnouncementsLib.remove(announcements, id);
  };

  public query func getActiveAnnouncements() : async [Types.Announcement] {
    AnnouncementsLib.getActive(announcements);
  };

  public query func getAllAnnouncements() : async [Types.Announcement] {
    AnnouncementsLib.getAll(announcements);
  };
};
