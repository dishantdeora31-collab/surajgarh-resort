import Types "../types/inquiries";
import List "mo:core/List";
import Time "mo:core/Time";

module {
  public func submit(
    items : List.List<Types.Inquiry>,
    state : { var nextInquiryId : Nat },
    name : Text,
    phone : Text,
    email : Text,
    inquiryType : Text,
    message : Text,
  ) : Nat {
    let id = state.nextInquiryId;
    state.nextInquiryId += 1;
    items.add({ id; name; phone; email; inquiryType; message; submittedAt = Time.now() });
    id
  };

  public func getAll(items : List.List<Types.Inquiry>) : [Types.Inquiry] {
    items.toArray()
  };

  public func remove(items : List.List<Types.Inquiry>, id : Nat) : Bool {
    let before = items.size();
    items.retain(func(i) { i.id != id });
    items.size() < before
  };
}
