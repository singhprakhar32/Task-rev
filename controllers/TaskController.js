import { validationResult } from "express-validator";
import taskSchema from "../models/taskSchema.js";

export const createTask = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    const { name, description, status } = req.body;
    const userId = req.user;
    const newTask = new taskSchema({ name, description, status, userId });
    await newTask.save();
    res
      .status(200)
      .json({
        success: true,
        task: newTask,
        message: "Task created successfully",
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};
export const updateTask = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const { name, description, status } = req.body;

    const updatedTask = await taskSchema.findOneAndUpdate(
      { _id: taskId, userId: req.user },
      { name, description, status, updatedAt: Date.now() },
      { new: true }
    );

    if (!updatedTask) {
      return res
        .status(404)
        .json({ success: false, error: "Task not found or unauthorized" });
    }

    res
      .status(200)
      .json({
        success: true,
        task: updatedTask,
        message: "Task updated successfully",
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};
export const readTask = async (req, res) => {
  try {
    const userId = req.user
    const task = await taskSchema.find({ userId});

    if (!task) {
      return res
        .status(404)
        .json({ success: false, error: "Task not found or unauthorized" });
    }

    res.status(200).json({ success: true, task });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};
export const deleteTask = async (req, res) => {
    try {
      const taskId = req.params.taskId;
  
      const deletedTask = await taskSchema.findOneAndDelete({ _id: taskId, userId: req.user });
  
      if (!deletedTask) {
        return res.status(404).json({ success: false, error: 'Task not found or unauthorized' });
      }
  
      res.status(200).json({ success: true, message: 'Task deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};
  