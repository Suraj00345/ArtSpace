const bcrypt = require("bcrypt");
const UserModel = require("../Models/User");
const jwt = require("jsonwebtoken");
const generateUsername = require("../Util/generateUsername");

//signup validation
const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    //check if the user is already present in the db or not
    const username = await generateUsername(name);
    const user = await UserModel.findOne({ email });
    if (user) {
      return res.status(409).json({
        message: "User is already exist,you can login",
        success: false,
      });
    }
    const userModel = new UserModel({ name, email, password, username });
    const saltRounds = 10; // 10 is the salt round
    //check password is matched or not
    userModel.password = await bcrypt.hash(password, saltRounds);
    //save userModel in Mongodb
    await userModel.save();
    res.status(201).json({
      message: "Signup successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

//login validation
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    const errMsg = "Authentication Failed, invalid credentials";
    if (!user) {
      return res.status(403).json({
        message: errMsg,
        success: false,
      });
    }
    const isPassEqual = await bcrypt.compare(password, user.password);
    if (!isPassEqual) {
      return res.status(403).json({
        message: errMsg,
        success: false,
      });
    }

    const jwtToken = jwt.sign(
      { email: user.email, _id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(200).json({
      message: "Login successfully",
      success: true,
      jwtToken,
      email,
      name: user.name,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

module.exports = {
  signup,
  login,
};
