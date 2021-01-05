require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const users = require("./routes/api/users");
const plaid = require("./routes/api/plaid");

const path = require("path");

const app = express();

// Bodyparser middleware
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(express.json());

// DB Config
const db = process.env.MONGO_URI;

// Connect to MongoDB
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB successfully connected"))
  .catch((err) => console.log(err));

// Passport middleware
app.use(passport.initialize());
// Passport config
require("./config/passport")(passport);

// Routes
app.use("/api/users", users);
app.use("/api/plaid", plaid);

app.use(express.static("client/build"));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
});

const port = process.env.PORT || 5000; // process.env.port is Heroku's port if you choose to deploy the app there
app.listen(port, () => console.log(`Server up and running on port ${port} !`));
