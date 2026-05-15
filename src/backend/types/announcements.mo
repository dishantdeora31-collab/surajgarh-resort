import Common "common";

module {
  public type Announcement = {
    id : Nat;
    title : Text;
    body : Text;
    publishDate : Text; // YYYY-MM-DD
    isActive : Bool;
    createdAt : Common.Timestamp;
  };
};
