// models/User.js

import mongoose, { Schema } from 'mongoose';
import { genSalt, hash, compare } from 'bcrypt';
import { type } from 'os';

mongoose.connect(process.env.MONGODB_URI)

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  admin: {
    type: Boolean,
    required: true,
    default: false
  },
  imageId: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false,
    default: 'none'
  }
},{
    timestamps: true
});

// Hash the password before saving
UserSchema.pre('save', async function(next) {
  try {
    const salt = await genSalt(10);
    const hashedPassword = await hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function(password) {
  try {
    return await compare(password, this.password);
  } catch (error) {
    throw new Error(error);
  }
};

const User = mongoose.models.User || mongoose.model("User", UserSchema)

export default User;
