import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { User } from '../models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbJsonPath = path.join(__dirname, '../data/db.json');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'gajanan_pure_spices_secret_key_2026_secure', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

export const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Engine 1: If MongoDB is connected, use Mongoose model
    if (mongoose.connection.readyState === 1) {
      const user = await User.findOne({ email: cleanEmail }).select('+password');

      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      const token = generateToken(user._id);

      return res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          token
        }
      });
    }

    // Engine 2: Fallback to JSON database file when MongoDB server is not running
    if (fs.existsSync(dbJsonPath)) {
      const rawData = fs.readFileSync(dbJsonPath, 'utf-8');
      const db = JSON.parse(rawData);
      const user = db.users?.find((u) => u.email.toLowerCase() === cleanEmail);

      if (user) {
        const isMatch = user.plainPassword
          ? user.plainPassword === password
          : await bcrypt.compare(password, user.password).catch(() => false);

        if (isMatch) {
          const token = generateToken(user._id);
          return res.status(200).json({
            success: true,
            message: 'Login successful (Local Database)',
            data: {
              _id: user._id,
              name: user.name,
              email: user.email,
              role: user.role,
              token
            }
          });
        }
      }
    }

    // Default Fallback Admin credentials
    if (cleanEmail === 'admin@gajananservices.com' && password === 'admin123') {
      const token = generateToken('usr-admin-default');
      return res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          _id: 'usr-admin-default',
          name: 'Admin Gajanan',
          email: 'admin@gajananservices.com',
          role: 'superadmin',
          token
        }
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminProfile = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: req.user || {
        _id: 'usr-admin-default',
        name: 'Admin Gajanan',
        email: 'admin@gajananservices.com',
        role: 'superadmin'
      }
    });
  } catch (error) {
    next(error);
  }
};
