const Course = require("../models/course.model");
const levelModel = require("../models/level.model");

const addLevel = async (req, res) => {
  try {
    if (!req.user.role === "admin") {
      return res.status(403).json({ message: "Access denied" });
    }
    const { courseId } = req.params;
    const { title, description } = req.body;
    const course = await Course.findById(courseId);
    const level = new levelModel({
      title,
      description,
    });
    await level.save();
    course.levels.push(level._id);
    await course.save();
    res.status(200).json({ message: "Level added successfully", level });
  } catch (error) {
    console.error("Error adding Level:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getLevelById = async (req, res) => {
  try {
    const level = await levelModel
      .findOne({ _id: req.params.levelId })
      .populate({
        path: "lectures",
        model: "Lecture",
      })
      .exec();
    res.status(200).json({
      level,
      message: "Level fetched successfully!",
    });
  } catch (error) {
    console.log("Error in level controller", error.message);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

module.exports = { addLevel, getLevelById };
