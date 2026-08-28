import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

// @desc  Register a new user (admin creates security/host accounts)
// @route POST /api/auth/register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, phone, department } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ name, email, password, role, phone, department });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Login
// @route POST /api/auth/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    }
    res.status(401).json({ message: "Invalid email or password" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Get logged-in user profile
// @route GET /api/auth/me
export const getMe = async (req, res) => {
  res.json(req.user);
};
