// Import required modules
import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import db from './config/dbConfig.js';
import UserRoute from './router/UserRouter.js';
import TaskRouter from './router/TaskRouter.js';
dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});
app.use("/api", UserRoute);
app.use("/api/tasks", TaskRouter);
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
