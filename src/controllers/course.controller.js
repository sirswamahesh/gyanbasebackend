const Course = require("../models/course.model");
const allCourse = async (req, res) => {
  try {
    const courses = await Course.find({})
      .populate({
        path: "lectures",
        model: "Lecture",
      })
      .exec();

    res.status(200).json({
      courses,
      message: "All courses fetched successfully!",
    });
  } catch (error) {
    console.log("Error in allCourse controller", error.message);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const getCourseById = async (req, res) => {
  try {
    const course = await Course.findOne({ _id: req.params.courseId })
      .populate({
        path: "levels",
        model: "Level",
        populate: {
          path: "lectures",
          model: "Lecture",
          select: "title", // only fetch title
        },
      })
      .exec();
    res.status(200).json({
      course,
      message: "Courses fetched successfully!",
    });
  } catch (error) {
    console.log("Error in allCourse controller", error.message);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const addCourse = async (req, res) => {
  const {
    courseTitle,
    subTitle,
    description,
    category,
    courseLevel,
    coursePrice,
  } = req.body;
  const file = req.file;

  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    if (!courseTitle) {
      return res.status(400).json({
        message: "Course title is required",
      });
    }
    if (!category) {
      return res.status(400).json({
        message: "Category is required",
      });
    }
    const newCourse = new Course({
      courseTitle,
      subTitle,
      description,
      category,
      courseLevel,
      coursePrice,
      courseThumbnail: file.location,
      creator: req.user._id,
    });

    await newCourse.save();
    res.status(200).json({
      data: newCourse,
      message: "Course added successfully!",
    });
  } catch (error) {
    console.log("Error in addCourse controller", error.message);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
const updateCourse = async (req, res) => {
  try {
    const data = req.body;
    const file = req.file;
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }
    const { courseId } = req.params;
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    if (data.courseTitle) course.courseTitle = data.courseTitle;
    if (data.subTitle) course.subTitle = data.subTitle;
    if (data.description) course.description = data.description;
    if (data.category) course.category = data.category;
    if (data.courseLevel) course.courseLevel = data.courseLevel;
    if (data.coursePrice) course.coursePrice = data.coursePrice;
    if (file) {
      course.courseThumbnail = file.location;
    }

    await course.save();
    res
      .status(200)
      .json({ data: course, message: "Course updated successfully!" });
  } catch (error) {
    console.error("Error updating course:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteCourse = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }
    const { courseId } = req.params;
    const hello = await Course.findByIdAndDelete({ _id: courseId });
    console.log(hello);
    res.status(200).json({ message: "Course deleted successfully!" });
  } catch (error) {
    console.error("Error deleting course:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  addCourse,
  allCourse,
  updateCourse,
  deleteCourse,
  getCourseById,
};
