import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
const Salt = 10
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8, // Enforce strong passwords
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


userSchema.virtual('passwordConfirmation').set(function(passwordConfirmation) {
  if (passwordConfirmation !== this.password) {
    throw new Error('Passwords do not match');
  }
});


userSchema.pre('save', async function(next) {
  try {
    this.password = await bcrypt.hash(this.password, Salt); 
    next();
  } catch (err) {
    next(err);
  }
});

export default mongoose.models.User || mongoose.model('User', userSchema);
