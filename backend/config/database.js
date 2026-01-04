/**
 * Database connection configuration
 * Handles MongoDB connection with retry logic
 */
import mongoose from 'mongoose';

let isConnected = false;

/**
 * Connect to MongoDB database
 */
export const connectDB = async () => {
  try {
    // Prevent multiple connections in development
    if (isConnected) {
      return;
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI);

    isConnected = true;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    mongoose.connection.on('error', (error) => {
      console.error('❌ MongoDB connection error:', error);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected');
      isConnected = false;
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('📦 MongoDB connection closed through app termination');
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    // Retry logic
    setTimeout(connectDB, 5000);
  }
};

export default connectDB;