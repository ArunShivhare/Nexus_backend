import express from "express";
import Message from "../models/Message.js";

const router = express.Router();

// GET messages for a task
router.get("/:taskId", async (req, res) => {
  try {
    const messages = await Message.find({ taskId: req.params.taskId });
    res.json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;