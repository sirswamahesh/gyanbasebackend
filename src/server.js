require("dotenv").config({});
const express = require("express");
const connectDB = require("./lib/dbConfig");
const authRoutes = require("./routes/auth.route");
const courseRoutes = require("./routes/course.route");
const lectureRoutes = require("./routes/lecture.route");
const levelsRoutes = require("./routes/level.route");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const app = express();

app.set("trust proxy", 1);
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the LMS API" });
});

app.use("/api/auth", authRoutes);
app.use("/api/course", courseRoutes);
app.use("/api/lecture", lectureRoutes);
app.use("/api/level", levelsRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.listen(process.env.PORT, () => {
  try {
    // database connection
    connectDB();
    console.log(`Server running on port ${process.env.PORT}`);
  } catch (error) {
    console.log(error);
  }
});
