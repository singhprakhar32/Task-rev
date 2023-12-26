import express from 'express';
import verifyAuthToken from '../middileware/JwtVerify.js';
import { validationTaskMiddleware } from '../middileware/TaskValidation.js';
import { createTask ,readTask,updateTask,deleteTask} from "../controllers/TaskController.js";
const TaskRouter = express.Router();

// Apply the middleware to routes that require authentication
TaskRouter.post('/create-task', verifyAuthToken,validationTaskMiddleware, createTask);
TaskRouter.get('/get', verifyAuthToken, readTask);
TaskRouter.put('/update/:taskId', verifyAuthToken, updateTask);
TaskRouter.delete('/delete/:taskId', verifyAuthToken, deleteTask);

export default TaskRouter;
