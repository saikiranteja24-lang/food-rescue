import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from './models/User.js';
import { Donation } from './models/Donation.js';

dotenv.config();

let mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/replate';
if (mongoUri.startsWith('//')) {
  mongoUri = `mongodb+srv:${mongoUri}`;
}
if (mongoUri.includes('mongodb.net/') && !mongoUri.includes('mongodb.net/replate') && mongoUri.endsWith('/')) {
  mongoUri = `${mongoUri}replate?retryWrites=true&w=majority`;
}

const seedDatabase = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB for sample data seeding...');

    // Clear existing sample data if desired
    await User.deleteMany({ email: { $in: ['chef.marcus@apexhotel.com', 'elena@beaconhope.org', 'sarah@greenmarket.com'] } });

    // Create Sample Donor User
    const donor1 = await User.create({
      name: 'Chef Marcus Vance',
      email: 'chef.marcus@apexhotel.com',
      password: 'password123',
      role: 'donor',
      organizationName: 'Apex Grand Hotel & Convention Center',
      organizationType: 'Hotel & Catering',
      phone: '+1 (555) 234-8901',
      address: {
        street: '500 Grand Boulevard, Banquet Hall Dock 3',
        city: 'Metropolis',
        state: 'NY',
        zipCode: '10001',
      },
      stats: {
        donationsCount: 14,
        mealsRescued: 480,
        co2OffsetKg: 1200,
      },
    });

    const donor2 = await User.create({
      name: 'Sarah Jenkins',
      email: 'sarah@greenmarket.com',
      password: 'password123',
      role: 'donor',
      organizationName: 'GreenMarket Artisan Bakery',
      organizationType: 'Bakery',
      phone: '+1 (555) 876-5432',
      address: {
        street: '142 S. Market Street',
        city: 'Metropolis',
        state: 'NY',
        zipCode: '10002',
      },
      stats: {
        donationsCount: 8,
        mealsRescued: 220,
        co2OffsetKg: 550,
      },
    });

    // Create Sample Recipient Shelter User
    const recipient = await User.create({
      name: 'Elena Rostova',
      email: 'elena@beaconhope.org',
      password: 'password123',
      role: 'recipient',
      organizationName: 'Beacon Hope Community Shelter',
      organizationType: 'Shelter',
      phone: '+1 (555) 432-1098',
      address: {
        street: '78 Hope Way',
        city: 'Metropolis',
        state: 'NY',
        zipCode: '10003',
      },
      stats: {
        claimsCount: 22,
        mealsRescued: 740,
        co2OffsetKg: 1850,
      },
    });

    console.log('✅ Demo users created:');
    console.log('   - Food Donor: chef.marcus@apexhotel.com / password123');
    console.log('   - Shelter Recipient: elena@beaconhope.org / password123');

    // Create sample donations with realistic future expiry and preparation times
    const now = Date.now();
    const donationsData = [
      {
        donor: donor1._id,
        title: 'Fresh Vegetable Biryani & Paneer Makhani',
        description: 'Prepared for evening tech conference dinner. Packed hot in sealed insulated food-grade cambro trays. Kept strictly above 65°C.',
        category: 'Cooked Meals',
        foodType: 'Veg',
        quantity: 65,
        quantityUnit: 'servings',
        expiryTime: new Date(now + 4.5 * 60 * 60 * 1000),
        preparedTime: new Date(now - 1.5 * 60 * 60 * 1000),
        storageCondition: 'Hot Insulated (>60°C)',
        dietaryInfo: ['Vegetarian', 'Gluten-Free', 'Halal'],
        pickupLocation: {
          street: '500 Grand Boulevard, Banquet Hall Loading Dock 3',
          city: 'Metropolis',
          state: 'NY',
          zipCode: '10001',
          instructions: 'Ring bell at Service Dock 3. Ask for banquet captain or Marcus.',
        },
        contactPhone: '+1 (555) 234-8901',
        contactPerson: 'Chef Marcus Vance',
        status: 'available',
        imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=900&q=80',
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=900&q=80',
      },
      {
        donor: donor2._id,
        title: 'Artisan Sourdough Loaves & Croissants',
        description: 'Fresh morning bake surplus. Assortment of country sourdough batards, multigrain loaves, and butter croissants in clean paper packaging.',
        category: 'Bakery & Bread',
        foodType: 'Veg',
        quantity: 40,
        quantityUnit: 'boxes',
        expiryTime: new Date(now + 24 * 60 * 60 * 1000),
        preparedTime: new Date(now - 4 * 60 * 60 * 1000),
        storageCondition: 'Room Temperature',
        dietaryInfo: ['Vegetarian'],
        pickupLocation: {
          street: '142 S. Market Street',
          city: 'Metropolis',
          state: 'NY',
          zipCode: '10002',
          instructions: 'Pick up at front counter or alley door.',
        },
        contactPhone: '+1 (555) 876-5432',
        contactPerson: 'Sarah Jenkins',
        status: 'available',
        imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=80',
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=80',
      },
      {
        donor: donor1._id,
        title: 'Roasted Lemon Herb Chicken & Steamed Vegetables',
        description: 'Unserved buffet trays from catering luncheon. Immediately chilled to 3°C following FDA rapid cooling procedures. Vacuum packed.',
        category: 'Cooked Meals',
        foodType: 'Non-Veg',
        quantity: 50,
        quantityUnit: 'servings',
        expiryTime: new Date(now + 6 * 60 * 60 * 1000),
        preparedTime: new Date(now - 2 * 60 * 60 * 1000),
        storageCondition: 'Refrigerated (0-4°C)',
        dietaryInfo: ['Contains Poultry', 'Gluten-Free', 'Dairy-Free'],
        pickupLocation: {
          street: '500 Grand Boulevard, Banquet Hall Dock 3',
          city: 'Metropolis',
          state: 'NY',
          zipCode: '10001',
          instructions: 'Ask for Chef Marcus at kitchen dispatch.',
        },
        contactPhone: '+1 (555) 234-8901',
        contactPerson: 'Chef Marcus Vance',
        status: 'available',
        imageUrl: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=900&q=80',
        image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=900&q=80',
      },
      {
        donor: donor1._id,
        title: 'vegan meal',
        description: 'Fresh vegan bowls with quinoa, roasted vegetables, chickpeas, and tahini dressing. Sealed in compostable packaging.',
        category: 'Cooked Meals',
        foodType: 'Vegan',
        quantity: 15,
        quantityUnit: 'packets',
        expiryTime: new Date(now + 5 * 60 * 60 * 1000),
        preparedTime: new Date(now - 0.1 * 60 * 60 * 1000),
        storageCondition: 'Room Temperature',
        dietaryInfo: ['Vegetarian', 'Vegan'],
        pickupLocation: {
          street: '500 Grand Boulevard, Banquet Hall Dock 3',
          city: 'Metropolis',
          state: 'NY',
          zipCode: '10001',
          instructions: 'Ready at back kitchen exit.',
        },
        contactPhone: '+1 (555) 234-8901',
        contactPerson: 'Chef Marcus Vance',
        status: 'available',
        imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80',
      },
      {
        donor: donor1._id,
        title: 'egg curry',
        description: 'Bengali-style egg curry in rich tomato-onion gravy with aromatic spices. Served with steamed basmati rice on the side.',
        category: 'Cooked Meals',
        foodType: 'Contains Egg',
        quantity: 10,
        quantityUnit: 'boxes',
        expiryTime: new Date(now + 8 * 60 * 60 * 1000),
        preparedTime: new Date(now - 20 * 60 * 60 * 1000),
        storageCondition: 'Room Temperature',
        dietaryInfo: ['Vegetarian'],
        pickupLocation: {
          street: '500 Grand Boulevard, Banquet Hall Dock 3',
          city: 'Metropolis',
          state: 'NY',
          zipCode: '10001',
          instructions: 'Stored in hot holding station.',
        },
        contactPhone: '+1 (555) 234-8901',
        contactPerson: 'Chef Marcus Vance',
        status: 'available',
        imageUrl: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=900&q=80',
        image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=900&q=80',
      },
      {
        donor: donor2._id,
        title: 'Fresh Organic Fruit Basket',
        description: 'Unsold morning market surplus. Assorted seasonal fruits including apples, oranges, bananas, grapes, and pears. All inspected and blemish-free.',
        category: 'Fresh Produce',
        foodType: 'Vegan',
        quantity: 25,
        quantityUnit: 'kg',
        expiryTime: new Date(now + 48 * 60 * 60 * 1000),
        preparedTime: new Date(now - 2 * 60 * 60 * 1000),
        storageCondition: 'Room Temperature',
        dietaryInfo: ['Vegetarian', 'Vegan', 'Gluten-Free'],
        pickupLocation: {
          street: '142 S. Market Street',
          city: 'Metropolis',
          state: 'NY',
          zipCode: '10002',
          instructions: 'Stored at produce section rear. Ask for Sarah.',
        },
        contactPhone: '+1 (555) 876-5432',
        contactPerson: 'Sarah Jenkins',
        status: 'available',
        imageUrl: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=900&q=80',
        image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=900&q=80',
      },
      {
        donor: donor1._id,
        title: 'Gourmet Cheese Platter & Crackers',
        description: 'Cocktail reception surplus. Assorted imported cheeses (brie, cheddar, gouda), artisan crackers, and fresh grapes. Sealed in catering trays.',
        category: 'Dairy & Refrigerated',
        foodType: 'Veg',
        quantity: 20,
        quantityUnit: 'trays',
        expiryTime: new Date(now + 12 * 60 * 60 * 1000),
        preparedTime: new Date(now - 3 * 60 * 60 * 1000),
        storageCondition: 'Refrigerated (0-4°C)',
        dietaryInfo: ['Vegetarian', 'Contains Poultry'],
        pickupLocation: {
          street: '500 Grand Boulevard, Banquet Hall Dock 3',
          city: 'Metropolis',
          state: 'NY',
          zipCode: '10001',
          instructions: 'Pick up from cold storage room B2.',
        },
        contactPhone: '+1 (555) 234-8901',
        contactPerson: 'Chef Marcus Vance',
        status: 'available',
        imageUrl: 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&w=900&q=80',
        image: 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&w=900&q=80',
      },
      {
        donor: donor2._id,
        title: 'Canned Beans & Pantry Staples',
        description: 'Overstocked inventory from community food drive. Unopened canned black beans, chickpeas, lentils, and brown rice. All within 6+ months of best-by date.',
        category: 'Packaged Goods',
        foodType: 'Vegan',
        quantity: 80,
        quantityUnit: 'packets',
        expiryTime: new Date(now + 180 * 24 * 60 * 60 * 1000),
        preparedTime: new Date(now - 5 * 24 * 60 * 60 * 1000),
        storageCondition: 'Room Temperature',
        dietaryInfo: ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free'],
        pickupLocation: {
          street: '142 S. Market Street',
          city: 'Metropolis',
          state: 'NY',
          zipCode: '10002',
          instructions: 'Boxed and ready at rear loading area.',
        },
        contactPhone: '+1 (555) 876-5432',
        contactPerson: 'Sarah Jenkins',
        status: 'available',
        imageUrl: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=900&q=80',
        image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=900&q=80',
      },
      {
        donor: donor1._id,
        title: 'Wedding Reception Buffet Surplus',
        description: 'Full dinner service surplus from 200-person wedding reception. Mixed menu: grilled salmon, garlic herb potatoes, seasonal roasted veggies, caesar salad. All temperature-controlled.',
        category: 'Buffet Surplus',
        foodType: 'Non-Veg',
        quantity: 55,
        quantityUnit: 'servings',
        expiryTime: new Date(now + 3.5 * 60 * 60 * 1000),
        preparedTime: new Date(now - 1.2 * 60 * 60 * 1000),
        storageCondition: 'Refrigerated (0-4°C)',
        dietaryInfo: ['Contains Seafood', 'Gluten-Free'],
        pickupLocation: {
          street: '500 Grand Boulevard, Banquet Hall Dock 3',
          city: 'Metropolis',
          state: 'NY',
          zipCode: '10001',
          instructions: 'Full catering racks available. Bring enough cooler space.',
        },
        contactPhone: '+1 (555) 234-8901',
        contactPerson: 'Chef Marcus Vance',
        status: 'available',
        imageUrl: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=900&q=80',
        image: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=900&q=80',
      },
      {
        donor: donor2._id,
        title: 'Chocolate Chip Cookie Trays',
        description: 'Bakery overproduction. Freshly baked gourmet chocolate chip cookies, oatmeal raisin, and double chocolate brownies. Sealed in bakery boxes.',
        category: 'Bakery & Bread',
        foodType: 'Veg',
        quantity: 60,
        quantityUnit: 'portions',
        expiryTime: new Date(now + 36 * 60 * 60 * 1000),
        preparedTime: new Date(now - 2 * 60 * 60 * 1000),
        storageCondition: 'Room Temperature',
        dietaryInfo: ['Vegetarian', 'Dairy-Free'],
        pickupLocation: {
          street: '142 S. Market Street',
          city: 'Metropolis',
          state: 'NY',
          zipCode: '10002',
          instructions: 'Assorted trays ready at counter.',
        },
        contactPhone: '+1 (555) 876-5432',
        contactPerson: 'Sarah Jenkins',
        status: 'available',
        imageUrl: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=900&q=80',
        image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=900&q=80',
      },
      {
        donor: donor1._id,
        title: 'Assorted Vegetable Crates',
        description: 'Farm-to-table event surplus. Fresh organic carrots, broccoli, cauliflower, bell peppers, zucchini, and leafy greens. Unwashed, original packaging.',
        category: 'Fresh Produce',
        foodType: 'Vegan',
        quantity: 35,
        quantityUnit: 'kg',
        expiryTime: new Date(now + 60 * 60 * 60 * 1000),
        preparedTime: new Date(now - 4 * 60 * 60 * 1000),
        storageCondition: 'Refrigerated (0-4°C)',
        dietaryInfo: ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free'],
        pickupLocation: {
          street: '500 Grand Boulevard, Banquet Hall Dock 3',
          city: 'Metropolis',
          state: 'NY',
          zipCode: '10001',
          instructions: 'Stored in walk-in cooler. Take entire crates.',
        },
        contactPhone: '+1 (555) 234-8901',
        contactPerson: 'Chef Marcus Vance',
        status: 'available',
        imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=900&q=80',
        image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=900&q=80',
      },
      {
        donor: donor1._id,
        title: 'Assorted Deli Wraps & Gourmet Pasta Salad',
        description: 'Catered box lunch surplus. Vegetarian avocado wraps and mediterranean rotini pasta salad with olive oil and sundried tomatoes.',
        category: 'Buffet Surplus',
        foodType: 'Veg',
        quantity: 35,
        quantityUnit: 'servings',
        expiryTime: new Date(now + 3 * 60 * 60 * 1000),
        preparedTime: new Date(now - 1 * 60 * 60 * 1000),
        storageCondition: 'Refrigerated (0-4°C)',
        dietaryInfo: ['Vegetarian'],
        pickupLocation: {
          street: '500 Grand Boulevard, Banquet Hall Dock 3',
          city: 'Metropolis',
          state: 'NY',
          zipCode: '10001',
          instructions: 'Loading bay #3.',
        },
        contactPhone: '+1 (555) 234-8901',
        contactPerson: 'Chef Marcus Vance',
        status: 'claimed',
        claimedBy: recipient._id,
        claimNotes: 'Beacon Hope Shelter van arriving at 2:15 PM with cooler bins.',
        imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=900&q=80',
        image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=900&q=80',
      },
    ];

    for (const d of donationsData) {
      await Donation.create(d);
    }

    console.log('✅ Sample surplus food donations seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  }
};

seedDatabase();
