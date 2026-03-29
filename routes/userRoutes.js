import express from "express";
import User from "../models/User.js";

const router = express.Router();

// Save user
router.post("/save", async (req, res) => {
  try {
    const { name, email, role, firebaseUID } = req.body;

    // check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      user = new User({ name, email, role, firebaseUID });
      await user.save();
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error saving user" });
  }
});

router.post("/add-member", async (req, res) => {
  try {
    const { leaderEmail, memberEmail } = req.body;

    const leader = await User.findOne({ email: leaderEmail });
    const member = await User.findOne({ email: memberEmail });

    if (!leader || !member) {
      return res.status(404).json({ message: "User not found" });
    }
    // initialize if not exists
    if (!leader.teamMembers) {
      leader.teamMembers = [];
    }

    // avoid duplicates
    if (!leader.teamMembers.includes(member._id)) {
      leader.teamMembers.push(member._id);
    }

    await leader.save();

    res.json({ message: "Member added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding member" });
  }
});

router.get("/team/:email", async (req, res) => {
  try {
    const { email } = req.params;

    const leader = await User.findOne({ email }).populate("teamMembers");

    if (!leader) {
      return res.status(404).json({ message: "Leader not found" });
    }

    res.json(leader.teamMembers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching team" });
  }
});

export default router;
