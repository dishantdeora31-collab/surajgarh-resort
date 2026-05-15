import Common "common";

module {
  public type Inquiry = {
    id : Nat;
    name : Text;
    phone : Text;
    email : Text;
    inquiryType : Text;
    message : Text;
    submittedAt : Common.Timestamp;
  };
};
