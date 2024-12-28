const User = require("../models/User");
const getAllUsers = async (req, res) => {
  const users = await User.find().select("-password").lean();
  if (!users.length) {
    return res.status(400).json({ massage: "No User Found" });
  }
  res.json(users);
};

module.exports = {
    getAllUsers
}