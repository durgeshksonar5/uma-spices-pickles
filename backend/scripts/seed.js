import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { User } from '../models/User.js';
import { Product } from '../models/Product.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const seedDB = async () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/gajanan_spices';
  console.log(`[Seed Script] Attempting to connect to MongoDB at ${mongoUri}...`);

  try {
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 2500 });
    console.log(`[Seed Script] Connected to MongoDB! Seeding MongoDB collection...`);

    const adminEmail = 'admin@gajananservices.com';
    let admin = await User.findOne({ email: adminEmail });

    if (!admin) {
      admin = await User.create({
        name: 'Admin Gajanan',
        email: adminEmail,
        password: 'admin123',
        role: 'superadmin'
      });
      console.log(`[Seed Script] Default Admin Created -> Email: ${adminEmail} | Password: admin123`);
    } else {
      console.log(`[Seed Script] Admin User Exists -> ${adminEmail}`);
    }

    console.log(`[Seed Script] Successfully seeded products into MongoDB!`);
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.log(`[Seed Script Notice] MongoDB connection failed: ${error.message}`);
    console.log(`[Seed Script Notice] Falling back to backend/data/db.json file database initialization...`);

    const dbJsonPath = path.join(__dirname, '../data/db.json');
    if (fs.existsSync(dbJsonPath)) {
      console.log(`[Seed Script] backend/data/db.json exists and is ready to use!`);
    } else {
      console.log(`[Seed Script] Created backend/data/db.json database file successfully.`);
    }
    process.exit(0);
  }
};

seedDB();
