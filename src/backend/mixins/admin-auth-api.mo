
mixin (adminAuth : { var passwordHash : Text }) {
  public query func verifyAdminPassword(password : Text) : async Bool {
    adminAuth.passwordHash == password;
  };
};
