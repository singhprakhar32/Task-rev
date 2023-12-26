import express from 'express';
import { userRegistration,userLogin } from '../controllers/UserController.js';
import validationMiddleware from '../middileware/userValidation.js';
const UserRoute = express.Router();
UserRoute.post("/register", validationMiddleware, userRegistration);
UserRoute.post("/login", userLogin);

export default UserRoute;