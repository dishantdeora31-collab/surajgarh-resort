import List "mo:core/List";
import CdOrdersLib "../lib/cd-orders";
import Types "../types/cd-orders";

mixin (
  orders : List.List<Types.CdOrder>,
  state : { var nextCdOrderId : Nat },
) {
  public func submitOrder(name : Text, mobile : Text) : async Nat {
    CdOrdersLib.submit(orders, state, name, mobile);
  };

  public query func getOrders() : async [Types.CdOrder] {
    CdOrdersLib.getAll(orders);
  };
};
