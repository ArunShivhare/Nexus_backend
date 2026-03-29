import express from "express";
import Task from "../models/Task.js";
import User from "../models/User.js";

const router = express.Router();

// Assign Task
router.post("/assign", async (req, res) => {
  try {
    const { title, description, memberEmail, leaderEmail } = req.body;

    const member = await User.findOne({ email: memberEmail });
    const leader = await User.findOne({ email: leaderEmail });

    if (!member || !leader) {
      return res.status(404).json({ message: "User not found" });
    }

    const task = new Task({
      title,
      description,
      assignedTo: member._id,
      assignedBy: leader._id,
    });

    await task.save();

    res.json(task);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error assigning task" });
  }
});

router.get("/member/:email", async (req, res) => {
  try {
    const { email } = req.params;

    const member = await User.findOne({ email });

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    const tasks = await Task.find({ assignedTo: member._id })
      .populate("assignedBy", "name email");

    res.json(tasks);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching tasks" });
  }
});

router.patch("/complete/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status: "completed" },
      { new: true }
    );

    res.json(task);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating task" });
  }
});

router.get("/leader/:email", async (req, res) => {
  try {
    const leader = await User.findOne({ email: req.params.email });

    const tasks = await Task.find({ assignedBy: leader._id })
      .populate("assignedTo", "name email");

    res.json(tasks);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching tasks" });
  }
});

router.patch("/failed/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status: "failed" },
      { new: true }
    );

    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating task" });
  }
});

export default router;