import List "mo:core/List";
import InquiriesLib "../lib/inquiries";
import Types "../types/inquiries";

mixin (
  inquiries : List.List<Types.Inquiry>,
  state : { var nextInquiryId : Nat },
) {
  public func submitInquiry(
    name : Text,
    phone : Text,
    email : Text,
    inquiryType : Text,
    message : Text,
  ) : async Nat {
    InquiriesLib.submit(inquiries, state, name, phone, email, inquiryType, message);
  };

  public query func getAllInquiries() : async [Types.Inquiry] {
    InquiriesLib.getAll(inquiries);
  };

  public func deleteInquiry(id : Nat) : async Bool {
    InquiriesLib.remove(inquiries, id);
  };
};
