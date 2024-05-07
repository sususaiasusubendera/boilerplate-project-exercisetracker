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
  username: String,
});

const User = mongoose.model("User", userSchema);

// exerciseSchema
const exerciseSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  description: String,
  duration: Number,
  date: Date,
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
app.post("/api/users", async (req, res) => {
  console.log(req.body);
  const userObj = new User({
    username: req.body.username,
  });

  try {
    const user = await userObj.save();
    console.log(user);
    res.json(user); // test 3
  } catch (err) {
    console.log(err);
  }
});

// test 7
app.post("/api/users/:_id/exercises", async (req, res) => {
  const id = req.params._id;
  const { description, duration, date } = req.body;

  try {
    const user = await User.findById(id);
    console.log(user.id);
    if (!user) {
      res.send("No user");
    } else {
      const exerciseObj = new Exercise({
        _id: user._id,
        description,
        duration,
        date: date ? new Date(date) : new Date(), // test 7: empty date --> now date
      });
      const exercise = await exerciseObj.save();
      console.log(exercise);
      // test 8 (?)
      res.json({
        _id: user._id,
        username: user.username,
        description: exercise.description,
        duration: exercise.duration,
        date: new Date(exercise.date).toDateString(), // test 7
      });
    }
  } catch (err) {
    console.log(err);
    res.send("Error saving");
  }
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
