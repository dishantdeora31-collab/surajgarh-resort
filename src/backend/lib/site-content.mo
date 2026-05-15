import Map "mo:core/Map";
import Types "../types/site-content";
import Time "mo:core/Time";

module {
  public type ContentRecord = Types.ContentRecord;

  public func initDefaults(
    content : Map.Map<Text, ContentRecord>,
  ) {
    for (key in Types.defaultKeys.values()) {
      if (content.get(key) == null) {
        content.add(key, { key; value = ""; updatedAt = Time.now() });
      };
    };
  };

  public func get(
    content : Map.Map<Text, ContentRecord>,
    key : Text,
  ) : ?ContentRecord {
    content.get(key);
  };

  public func set(
    content : Map.Map<Text, ContentRecord>,
    key : Text,
    value : Text,
  ) {
    content.add(key, { key; value; updatedAt = Time.now() });
  };

  public func getAllKeys(
    content : Map.Map<Text, ContentRecord>,
  ) : [Text] {
    content.keys().toArray();
  };

  public func getAll(
    content : Map.Map<Text, ContentRecord>,
  ) : [ContentRecord] {
    content.values().toArray();
  };
};
