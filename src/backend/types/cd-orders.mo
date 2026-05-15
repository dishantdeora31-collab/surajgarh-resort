import Common "common";

module {
  public let cdPrice : Nat = 4500;

  public type CdOrder = {
    id : Nat;
    name : Text;
    mobile : Text;
    submittedAt : Common.Timestamp;
    price : Nat;
  };
};
