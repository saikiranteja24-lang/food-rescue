import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema(
  {
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please add a food title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please describe the food items'],
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Food category is required'],
      enum: [
        'Cooked Meals',
        'Bakery & Bread',
        'Fresh Produce',
        'Packaged Goods',
        'Dairy & Refrigerated',
        'Beverages',
        'Buffet Surplus',
        'Other',
      ],
      default: 'Cooked Meals',
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1'],
    },
    quantityUnit: {
      type: String,
      enum: ['servings', 'kg', 'boxes', 'portions', 'packets', 'trays'],
      default: 'servings',
    },
    expiryTime: {
      type: Date,
      required: [true, 'Please provide approximate expiry/safe consumption time'],
    },
    preparedTime: {
      type: Date,
      default: Date.now,
      required: [true, 'Food preparation time is required'],
    },
    foodType: {
      type: String,
      enum: ['Veg', 'Non-Veg', 'Vegan', 'Contains Egg'],
      default: 'Veg',
      required: true,
    },
    dietaryInfo: [
      {
        type: String,
        enum: [
          'Vegetarian',
          'Vegan',
          'Halal',
          'Kosher',
          'Gluten-Free',
          'Dairy-Free',
          'Nut-Free',
          'Contains Meat',
          'Contains Poultry',
          'Contains Seafood',
        ],
      },
    ],
    storageCondition: {
      type: String,
      enum: ['Room Temperature', 'Refrigerated (0-4°C)', 'Frozen (-18°C)', 'Hot Insulated (>60°C)'],
      default: 'Room Temperature',
    },
    pickupLocation: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, default: '' },
      zipCode: { type: String, default: '' },
      instructions: { type: String, default: '' },
    },
    contactPhone: {
      type: String,
      required: [true, 'Contact phone number is required'],
    },
    contactPerson: {
      type: String,
      default: '',
    },
    imageUrl: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default: '',
    },

    // ── Rescue Workflow Status ──
    status: {
      type: String,
      enum: ['available', 'claimed', 'pickup_scheduled', 'picked_up', 'delivered', 'completed', 'cancelled'],
      default: 'available',
    },
    claimedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    claimNotes: {
      type: String,
      default: '',
    },
    claimedAt: {
      type: Date,
    },

    // ── Pickup Scheduling ──
    pickupScheduledAt: {
      type: Date,
    },
    estimatedPickupTime: {
      type: Date,
    },
    volunteerName: {
      type: String,
      default: '',
    },
    volunteerPhone: {
      type: String,
      default: '',
    },

    // ── Completion Timestamps ──
    pickedUpAt: {
      type: Date,
    },
    deliveredAt: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
    cancelledAt: {
      type: Date,
    },
    cancelReason: {
      type: String,
      default: '',
    },

    // ── Rescue Timeline (audit log) ──
    rescueTimeline: [
      {
        status: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        actor: { type: String, default: 'System' },
        actorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        note: { type: String, default: '' },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for checking if donation is expired
donationSchema.virtual('isExpired').get(function () {
  return new Date() > this.expiryTime;
});

// Virtual to check if donation needs immediate redistribution (expiry within 4 hours and still available)
donationSchema.virtual('needsRedistribution').get(function () {
  const now = new Date();
  const diffHours = (this.expiryTime - now) / (1000 * 60 * 60);
  return this.status === 'available' && diffHours <= 4 && diffHours > 0;
});

export const Donation = mongoose.model('Donation', donationSchema);
