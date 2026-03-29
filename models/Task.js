import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,

  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  status: {
  type: String,
  enum: ["pending", "completed", "failed"],
  default: "pending",
}

}, { timestamps: true });

export default mongoose.model("Task", taskSchema);