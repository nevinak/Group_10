import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './models/user.model.js';

dotenv.config();

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const users = [
      { fullName: 'Alice Johnson', email: 'alice@example.com', password: 'password123' },
      { fullName: 'Bob Smith', email: 'bob@example.com', password: 'password123' },
      { fullName: 'Charlie Brown', email: 'charlie@example.com', password: 'password123' },
    ];

    for (const userData of users) {
      const existing = await User.findOne({ email: userData.email });
      if (!existing) {
        await User.create(userData);
        console.log(`Created user: ${userData.email}`);
      } else {
        console.log(`User already exists: ${userData.email}`);
      }
    }

    await mongoose.disconnect();
    console.log('User seeding completed');
  } catch (error) {
    console.error('Seeding failed:', error.message);
    process.exit(1);
  }
};

seedUsers();
