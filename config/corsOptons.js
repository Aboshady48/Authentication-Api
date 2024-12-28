const allowedOrgins = require("./allowedOrgins");
const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrgins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not Allowed By Cors"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

module.exports = corsOptions;