import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { Donation } from '../models/Donation.js';
import { sendWhatsAppNotification } from '../services/whatsappService.js';

// Helper to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user (Donor / Recipient / NGO)
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      role,
      organizationName,
      organizationType,
      phone,
      address,
    } = req.body;

      // Trim email and validate password requirements
      const trimmedEmail = email.trim();
      if (!name || !trimmedEmail || !password) {
        return res.status(400).json({
          success: false,
          message: 'Please fill in all required fields',
        });
      }
      if (password.length < 8) {
        return res.status(400).json({
          success: false,
          message: 'Password must be at least 8 characters',
        });
      }
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
      if (!passwordRegex.test(password)) {
        return res.status(400).json({
          success: false,
          message: 'Password must contain at least one letter and one number',
        });
      }

    // Check if user exists
      const userExists = await User.findOne({ email: trimmedEmail.toLowerCase() });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists',
      });
    }

    // Create user
      const user = await User.create({
        name,
        email: trimmedEmail.toLowerCase(),
        password,
        role: role || 'donor',
      organizationName: organizationName || '',
      organizationType: organizationType || 'Individual / Community',
      phone: phone || '',
      whatsappPhone: phone || '',
      whatsappNotifications: true,
      address: address || {},
    });

    const token = generateToken(user._id);

    // Dispatch WhatsApp registration notification
    const whatsappNotification = await sendWhatsAppNotification({
      phone: user.whatsappPhone || user.phone,
      name: user.name,
      role: user.role,
      organizationName: user.organizationName,
      type: 'register',
    });

    res.status(201).json({
      success: true,
      message: 'Account registered successfully',
      token,
      whatsappNotification,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        organizationName: user.organizationName,
        organizationType: user.organizationType,
        phone: user.phone,
        whatsappPhone: user.whatsappPhone || user.phone,
        whatsappNotifications: user.whatsappNotifications,
        address: user.address,
        stats: user.stats,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password',
      });
    }

    // Find user by email, include password field
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const token = generateToken(user._id);

    // Dispatch WhatsApp login / security alert notification
    const whatsappNotification = await sendWhatsAppNotification({
      phone: user.whatsappPhone || user.phone,
      name: user.name,
      role: user.role,
      organizationName: user.organizationName,
      type: 'login',
    });

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      token,
      whatsappNotification,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        organizationName: user.organizationName,
        organizationType: user.organizationType,
        phone: user.phone,
        whatsappPhone: user.whatsappPhone || user.phone,
        whatsappNotifications: user.whatsappNotifications,
        address: user.address,
        stats: user.stats,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile with active stats
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Compute live stats from donations
    const donationsCount = await Donation.countDocuments({ donor: user._id });
    const claimsCount = await Donation.countDocuments({ claimedBy: user._id });
    
    // Calculate total meals and CO2
    const userDonations = await Donation.find({ donor: user._id });
    let totalMealsRescued = 0;
    userDonations.forEach((d) => {
      totalMealsRescued += d.quantity || 0;
    });

    const co2Saved = Math.round(totalMealsRescued * 2.5 * 10) / 10; // ~2.5kg CO2 saved per meal rescued

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        organizationName: user.organizationName,
        organizationType: user.organizationType,
        phone: user.phone,
        address: user.address,
        isVerified: user.isVerified,
        stats: {
          donationsCount,
          claimsCount,
          mealsRescued: totalMealsRescued,
          co2OffsetKg: co2Saved,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateUserProfile = async (req, res, next) => {
  try {
    const { name, organizationName, organizationType, phone, address } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (name) user.name = name;
    if (organizationName !== undefined) user.organizationName = organizationName;
    if (organizationType) user.organizationType = organizationType;
    if (phone !== undefined) {
      user.phone = phone;
      if (!user.whatsappPhone) user.whatsappPhone = phone;
    }
    if (req.body.whatsappPhone !== undefined) user.whatsappPhone = req.body.whatsappPhone;
    if (req.body.whatsappNotifications !== undefined) user.whatsappNotifications = req.body.whatsappNotifications;
    if (address) user.address = { ...user.address, ...address };

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        organizationName: user.organizationName,
        organizationType: user.organizationType,
        phone: user.phone,
        whatsappPhone: user.whatsappPhone || user.phone,
        whatsappNotifications: user.whatsappNotifications,
        address: user.address,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Trigger a test WhatsApp notification to receiver
// @route   POST /api/auth/send-whatsapp-test
// @access  Private
export const sendWhatsAppTest = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const phone = req.body.phone || user.whatsappPhone || user.phone;
    const type = req.body.type || 'login';

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid phone number to receive WhatsApp alerts',
      });
    }

    const notification = await sendWhatsAppNotification({
      phone,
      name: user.name,
      role: user.role,
      organizationName: user.organizationName,
      type,
    });

    res.status(200).json({
      success: true,
      message: 'WhatsApp notification generated successfully',
      notification,
    });
  } catch (error) {
    next(error);
  }
};
