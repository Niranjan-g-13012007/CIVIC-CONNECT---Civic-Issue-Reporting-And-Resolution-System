require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const issueRoutes = require("./routes/issueRoutes");
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));
app.use("/api", issueRoutes);
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));
const publicUserSchema = new mongoose.Schema({
  full_name: String,
  dob: String,
  gender: String,
  occupation: String,
  password: String,
  phone: String,
  email: String,
  address: String,
  city: String,
  district: String,
  pincode: String,
  state: String,
  date_created: { type: Date, default: Date.now },
});
const PublicUser = mongoose.model("PublicUser", publicUserSchema);
app.get("/", (req, res) => {
  res.send("<h2>🚀 Civic Connect Server is Running...</h2>");
});
app.post("/register", async (req, res) => {
  try {
    const {
      full_name, dob, gender, occupation, password,
      phone, email, address, city, district, pincode, state
    } = req.body;
    const existingUser = await PublicUser.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already registered!" });
    }
    const newUser = new PublicUser({
      full_name, dob, gender, occupation, password,
      phone, email, address, city, district, pincode, state
    });
    await newUser.save();
    res.status(200).json({ message: "Registration successful!" });
  } catch (error) {
    console.error("❌ Registration Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
app.post("/public-login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await PublicUser.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found!" });
        }
        if (user.password !== password) {
            return res.status(400).json({ message: "Incorrect password!" });
        }
        res.status(200).json({ 
            message: "Login successful!", 
            name: user.full_name || user.email 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on: http://localhost:${PORT}`);
  console.log("📡 Press CTRL + C to stop the server");
});