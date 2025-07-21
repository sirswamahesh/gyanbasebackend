const Course = require("../models/course.model");
const Lecture = require("../models/lecture.model");
const levelModel = require("../models/level.model");

const addLecture = async (req, res) => {
  try {
    if (!req.user.role === "admin") {
      return res.status(403).json({ message: "Access denied" });
    }
    const { levelId } = req.params;
    const { title, description } = req.body;
    const level = await levelModel.findById(levelId);
    const lecture = new Lecture({
      title,
      description,
    });
    await lecture.save();
    level.lectures.push(lecture._id);
    await level.save();
    res.status(200).json({ message: "Lecture added successfully", lecture });
  } catch (error) {
    console.error("Error adding lecture:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getLectureById = async (req, res) => {
  try {
    if (!req.user.role === "admin") {
      return res.status(403).json({ message: "Access denied" });
    }
    const { lectureId } = req.params;
    const lecture = await Lecture.findById(lectureId);
    res.status(200).json({ message: "Lecture fetched successfully", lecture });
  } catch (error) {
    console.error("Error fetching lecture:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateLecture = async (req, res) => {
  try {
    if (!req.user.role === "admin") {
      return res.status(403).json({ message: "Access denied" });
    }
    const { title, description, isPreviewFree } = req.body;
    const { lectureId } = req.params;
    const file = req.file;
    const lecture = await Lecture.findByIdAndUpdate(
      lectureId,
      {
        title,
        description,
        isPreviewFree,
        videoUrl: file && file.location,
      },
      { new: true }
    );
    res.status(200).json({ message: "Lecture updated successfully" });
  } catch (error) {
    console.error("Error updating lecture:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
const deleteLecture = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { lectureId } = req.params;

    const lecture = await Lecture.findByIdAndDelete(lectureId);
    if (!lecture) {
      return res.status(404).json({ message: "Lecture not found" });
    }

    await Course.updateOne(
      { lectures: lectureId },
      { $pull: { lectures: lectureId } }
    );

    res.status(200).json({ message: "Lecture deleted successfully" });
  } catch (error) {
    console.error("Error deleting lecture:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { addLecture, updateLecture, deleteLecture, getLectureById };
