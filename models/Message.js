import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task",
    required: true,
  },
  sender: String,
  text: String,
  time: String,
}, { timestamps: true });

export default mongoose.model("Message", messageSchema);