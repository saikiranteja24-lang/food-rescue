import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/replate';

    // Normalize URI if user provided URI starting with "//"
    if (mongoUri.startsWith('//')) {
      mongoUri = `mongodb+srv:${mongoUri}`;
    }

    // Ensure database name is included if not specified
    if (mongoUri.includes('mongodb.net/') && !mongoUri.includes('mongodb.net/replate') && mongoUri.endsWith('/')) {
      mongoUri = `${mongoUri}replate?retryWrites=true&w=majority`;
    }

    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.warn(`⚠️ Note: Running in fallback mode. Ensure MongoDB cluster IP whitelist allows your current IP.`);
    return null;
  }
};
