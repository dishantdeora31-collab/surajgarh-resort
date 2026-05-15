import Map "mo:core/Map";
import SiteContentLib "../lib/site-content";
import Types "../types/site-content";

mixin (content : Map.Map<Text, Types.ContentRecord>) {
  public query func getSiteContent(key : Text) : async ?Types.ContentRecord {
    SiteContentLib.get(content, key);
  };

  public func updateSiteContent(key : Text, value : Text) : async () {
    SiteContentLib.set(content, key, value);
  };

  public query func getAllContentKeys() : async [Text] {
    SiteContentLib.getAllKeys(content);
  };

  public query func getAllSiteContent() : async [Types.ContentRecord] {
    SiteContentLib.getAll(content);
  };
};
