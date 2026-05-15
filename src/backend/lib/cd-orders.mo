import Types "../types/cd-orders";
import List "mo:core/List";
import Time "mo:core/Time";

module {
  public func submit(
    items : List.List<Types.CdOrder>,
    state : { var nextCdOrderId : Nat },
    name : Text,
    mobile : Text,
  ) : Nat {
    let id = state.nextCdOrderId;
    state.nextCdOrderId += 1;
    items.add({ id; name; mobile; submittedAt = Time.now(); price = Types.cdPrice });
    id
  };

  public func getAll(items : List.List<Types.CdOrder>) : [Types.CdOrder] {
    items.toArray()
  };
}
