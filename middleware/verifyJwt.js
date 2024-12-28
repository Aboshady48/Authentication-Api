const jwt = require("jsonwebtoken");
const verifyJwt = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization; // Bearer token

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ massage: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1]; //["Bearer" , "token"]

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    //decoded for hashing the token
    if (err) return res.status(403).json({ massage: "Forbidden" });
    req.user = decoded.UserInfo.id;
    next();
  });
};


module.exports = verifyJwt;
