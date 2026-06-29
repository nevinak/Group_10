import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'super-secret-chat-key', {
    expiresIn: '7d',
  });
};

export const signup = async (req, res) => {
  const { fullName, email, password, confirmPassword } = req.body;

  if (!fullName || !email || !password || !confirmPassword) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ success: false, message: 'Passwords do not match' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const newUser = await User.create({ fullName, email, password, profilePic: req.body.profilePic || '' });

    const token = generateToken(newUser._id);
    res.cookie('jwt', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      success: true,
      message: 'Account created',
      user: {
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic || '',
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);
    res.cookie('jwt', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: 'Logged in',
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePic: user.profilePic || '',
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const logout = (_req, res) => {
  res.clearCookie('jwt', { httpOnly: true, sameSite: 'lax', secure: false });
  return res.status(200).json({ success: true, message: 'Logged out' });
};

export const me = async (req, res) => {
  return res.status(200).json({ success: true, user: req.user });
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } }).select('-password');
    return res.status(200).json({ success: true, users });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProfilePicture = async (req, res) => {
  try {
    const { profilePic } = req.body;

    if (!profilePic) {
      return res.status(400).json({ success: false, message: 'Profile picture is required' });
    }

    const updatedUser = await User.findByIdAndUpdate(req.user._id, { profilePic }, { new: true }).select('-password');

    return res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
