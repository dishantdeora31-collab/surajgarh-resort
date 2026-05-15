import Common "common";

module {
  public type ContentRecord = {
    key : Text;
    value : Text;
    updatedAt : Common.Timestamp;
  };

  // Default content keys for the resort site
  public let defaultKeys : [Text] = [
    "homepageTitle",
    "homepageSubtitle",
    "aboutSection",
    "surajGarhDescription",
    "saritaGreenDescription",
    "hariOmDescription",
    "banquetHall1Description",
    "banquetHall2Description",
    "roomsDescription",
    "galleryDescription",
    "contactInfo",
    "contactAddress",
    "contactPhone",
    "contactEmail",
    "offers",
  ];
};
