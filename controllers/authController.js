const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
//Register middleware
const register = async (req, res) => {
  const { first_name, last_name, email, password } = req.body;

  if (!first_name || !last_name || !email || !password) {
    return res.status(400).json({ massage: "All fields are required" });
  }

  const foundUser = await User.findOne({ email: email }).exec();

  if (foundUser) {
    return res.status(401).json({ massage: "User Already exists" });
  }

  //hash the password
  const hashPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    first_name,
    last_name,
    email,
    password: hashPassword,
  });

  const accessToken = jwt.sign(
    {
      UserInfo: {
        id: user._id,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );

  const RefreshToken = jwt.sign(
    {
      UserInfo: {
        id: user._id,
      },
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  res.cookie("jwt", RefreshToken, {
    httpOnly: true, //accses only by web server
    secure: true, //https
    sameSite: "None", //cross site cookie
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({
    accessToken,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
  });
};

//login middleware
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ massage: "All fields are required" });
  }

  const foundUser = await User.findOne({ email: email }).exec();

  if (!foundUser) {
    return res.status(401).json({ massage: "User Dose not Exist" });
  }

  //compare the password to the registered passwrd
  const matchPass = await bcrypt.compare(password, foundUser.password);

  if (!matchPass) return res.status(401).json({ massage: "Wrong Password" });

  const accessToken = jwt.sign(
    {
      UserInfo: {
        id: foundUser._id,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );

  const RefreshToken = jwt.sign(
    {
      UserInfo: {
        id: foundUser._id,
      },
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  res.cookie("jwt", RefreshToken, {
    httpOnly: true, //accses only by web server
    secure: true, //https
    sameSite: "None", //cross site cookie
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({
    accessToken,
    last_name: foundUser.last_name,
  });
};

const refresh = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) res.status(401).json({ massage: "Unauthorized" });
  const refreashToken = cookies.jwt;

  jwt.verify(
    refreashToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) return res.status(403).json({ massage: "Forbidden" });
      const foundUser = await User.findById(decoded.UserInfo.id).exec();
      if (!foundUser) return res.status(403).json({ massage: "Forbidden" });
      const accessToken = jwt.sign(
        {
          UserInfo: {
            id: foundUser._id,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );
      res.json({ accessToken });
    }
  );
};

const logout = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //No Content
  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "None",
    secure: true,
  });
  res.json({ massage: "Cookie Cleared" });
};

module.exports = {
  register,
  login,
  refresh,
  logout,
};
