import mongoose from "mongoose";
import User from "../models/user.model.js";
import Task from "../models/task.model.js";

export const createtask = async (req, res) => {
  try {
    const { title, description, priority, deadline, assignedTo } = req.body;

    if (!title || !deadline || !assignedTo) {
      return res
        .status(400)
        .json({ message: "title, deadline, assignedTo required" });
    }

    if (!mongoose.Types.ObjectId.isValid(assignedTo)) {
      return res
        .status(400)
        .json({ message: "assignedTo must be a valid MongoDB ID" });
    }

    const user = await User.findById(assignedTo);

    if (!user) {
      return res.status(404).json({ message: "Assigned user not found" });
    }

    const task = await Task.create({
      title,
      description,
      priority: priority || "medium",
      deadline,
      assignedTo,
      createdBy: req.user._id,
    });

    return res.status(201).json({ message: "Task created", task });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user._id })
      .sort({ deadline: 1 })
      .populate("createdBy", "name email role");

    return res.status(200).json({
      message: "My tasks fetched",
      total: tasks.length,
      tasks,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatus = ["todo", "in-progress", "done"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // ✅ user can update ONLY their tasks
    if (task.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can't update this task" });
    }

    task.status = status;
    await task.save();

    return res.status(200).json({
      message: "Task status updated",
      task,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getManagerTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ createdBy: req.user._id })
      .sort({ createdAt: -1 })
      .populate("assignedTo", "name email role");

    return res.status(200).json({
      message: "Manager tasks fetched",
      total: tasks.length,
      tasks,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
