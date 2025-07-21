const generateToken = require("../lib/utils");
const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters.",
      });
    }

    const user = await User.findOne({ email });

    if (user)
      return res.status(400).json({
        messages: "Email already exists.",
      });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });
    if (newUser) {
      // generate jwt token here
      generateToken(newUser._id, res);
      await newUser.save();
      res.status(200).json({
        data: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          profilePicture: newUser.profilePicture,
        },
        message: "User registed successfully!",
      });
    } else {
      res.status(400).json({
        message: "Invalid user data",
      });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user)
      return res.status(400).json({
        messages: "Invalid credentials",
      });

    const isPassword = await bcrypt.compare(password, user.password);

    if (!isPassword) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const { password: _, ...userData } = user._doc;
    // generate jwt token here
    generateToken(user._id, res);
    res.status(200).json({
      data: { ...userData },
      message: "User Login successfully!",
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
const getAllUsers = async (req, res) => {
  try {
    console.log();
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }
    const users = await User.find({});
    res.status(200).json({ data: users });
  } catch (error) {
    console.error("Error getting users:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const file = req.file;
    const userId = req.user._id;
    if (!file) {
      return res.status(400).json({
        message: "Profile picture is required",
      });
    }
    const updateUser = await User.findByIdAndUpdate(
      userId,
      {
        profilePicture: file.location,
      },
      { new: true }
    );

    const { password, ...user } = updateUser._doc;
    console.log(user)
    res.status(200).json({
      message: "User updated successfully.",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = {
  signup,
  login,
  logout,
  checkAuth,
  getAllUsers,
  updateProfile,
};
