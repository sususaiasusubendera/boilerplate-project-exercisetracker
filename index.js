const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");

// connect database
mongoose.connect(process.env.DB_URL);

// schemas
// userSchema
const userSchema = new mongoose.Schema({
  username: String
});

const User = mongoose.model("User", userSchema);

// exerciseSchema
const exerciseSchema = new mongoose.Schema({
  user_id: { type: String, required: true},
  description: String,
  duration: Number,
  date: Date
});

const Exercise = mongoose.model("Exercise", exerciseSchema);

// middleware
app.use(cors());
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

// tests
// test 2
app.post("/api/users", (req, res) => {
  console.log(req.body);
  res.json({ greeting: "hello" });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
