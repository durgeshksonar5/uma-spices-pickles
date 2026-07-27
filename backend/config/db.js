import mongoose from 'mongoose';

export let isMongoConnected = false;

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/gajanan_spices';
    const conn = await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 2000 });
    isMongoConnected = true;
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    isMongoConnected = false;
    console.log(`[Database Notice] MongoDB local service not detected (${error.message}).`);
    console.log(`[Database Notice] Backend server will operate seamlessly using JSON database persistence.`);
  }
};
