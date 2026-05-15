import Common "common";

module {
  public type PhotoCategory = Text;
  // Valid values: "homepageBanner" | "surajGarh" | "saritaGreen" | "hariOm"
  //               | "banquetHall1" | "banquetHall2" | "rooms" | "gallery"

  public type Photo = {
    id : Nat;
    category : PhotoCategory;
    url : Text;
    caption : Text;
    order : Nat;
    uploadedAt : Common.Timestamp;
    mediaType : Text; // "image" | "video"
    thumbnailUrl : ?Text; // optional thumbnail for videos
  };
};
