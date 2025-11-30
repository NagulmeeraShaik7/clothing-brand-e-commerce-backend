import User from "../models/auth.model.js";

class AuthRepository {
  async createUser(data) {
    const user = new User(data);
    return user.save();
  }

  async findByEmail(email) {
    return User.findOne({ email });
  }

  async findById(id) {
    return User.findById(id).select("-password");
  }
}

export default AuthRepository;
