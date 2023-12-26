import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import userSchema from "../models/userSchema.js";
import bcrypt from "bcrypt";
export const userRegistration = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { name, email, password } = req.body;
    console.log(name,email,password);
    const existingUser = await userSchema.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email is already registered" });
    }
    const newUser = new userSchema({ name, email, password });
    await newUser.save();
    const token = jwt.sign({ userId: newUser._id }, process.env.SECRET_KEY, { expiresIn: '1h' });

    // Remove password from the response
    const userResponse = newUser.toObject();
    delete userResponse.password;

    // Send the token as part of the response
    res.status(200).json({ user: userResponse, token });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const userLogin = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await userSchema.findOne({ email });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ success: false, error: 'Invalid email or password' });
      }
      const token = jwt.sign({ userId: user._id, userEmail: user.email }, process.env.SECRET_KEY, { expiresIn: '1h' });
      res.status(200).json({ success: true, token, message: 'User login successful' });
    } catch (err) {
      console.error(err);
      res.status(400).json({ success: false, error: err.message });
    }
  };
  