import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [60, 'Name cannot exceed 60 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,
      validate: {
        validator: function(v) { return /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(v); },
        message: 'Password must contain at least one letter and one number',
      },
    },
    role: {
      type: String,
      enum: ['donor', 'recipient', 'organization', 'admin'],
      default: 'donor',
    },
    organizationName: {
      type: String,
      trim: true,
      default: '',
    },
    organizationType: {
      type: String,
      enum: ['Restaurant', 'Hotel & Catering', 'Supermarket', 'Bakery', 'NGO / Food Bank', 'Shelter', 'Individual / Community', 'Other'],
      default: 'Individual / Community',
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    whatsappPhone: {
      type: String,
      trim: true,
      default: '',
    },
    whatsappNotifications: {
      type: Boolean,
      default: true,
    },
    address: {
      street: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      zipCode: { type: String, default: '' },
    },
    avatar: {
      type: String,
      default: '',
    },
    isVerified: {
      type: Boolean,
      default: true,
    },
    stats: {
      donationsCount: { type: Number, default: 0 },
      claimsCount: { type: Number, default: 0 },
      mealsRescued: { type: Number, default: 0 },
      co2OffsetKg: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

// Encrypt password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare entered password with hashed password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export const User = mongoose.model('User', userSchema);
