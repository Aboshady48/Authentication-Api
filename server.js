require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");
const cookiParser = require("cookie-parser");
const corsOptions = require("./config/corsOptons");
const connectDb = require("./config/dbConnect");
const e = require("express");

connectDb();
app.use(cors(corsOptions));

app.use(cookiParser());

app.use(express.json());

app.use("/", express.static(path.join(__dirname, "public")));
//Routs
app.use("/", require("./routes/root"));
app.use("/auth", require("./routes/authRoutes"));

app.use("/users", require("./routes/UsersRout"));

//route error
app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ massage: "404 page not found :( " });
  } else {
    res.type("txt").send("404 page not found :( ");
  }
});
//database connection
mongoose.connection.once("open", () => {
  console.log("Database Connected to MongoDb");
  app.listen(PORT, (req, res) => {
    console.log("server run sucssfully at url : http://localhost:5000");
  });
});
mongoose.connection.on("error", (err) => {
  console.log(`the Database has error on the server.js : ${err}`);
});
