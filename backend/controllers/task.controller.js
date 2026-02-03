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

export const updatetasks = async (req, res) => {
  try {
    const { id } = req.params;      // task id from URL
    const { status } = req.body;    // new status from body

    if (!id || !status) {
      return res.status(400).json({
        message: "Task id and status are required",
      });
    }

    const task = await Task.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    return res.status(200).json({
      message: "Task status updated",
      task,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
