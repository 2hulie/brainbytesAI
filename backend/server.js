const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
//const aiService = require("./aiService");
const { generateResponse } = require("./aiService");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize AI model
//aiService.initializeAI();

// Connect to MongoDB
mongoose
  .connect("mongodb://mongo:27017/brainbytes", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    retryWrites: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
  });

// Define schemas
// Message schema
const messageSchema = new mongoose.Schema({
  text: String,
  isUser: Boolean,
  category: { type: String, default: "general" },
  questionType: { type: String, default: "general" },
  sentiment: { type: String, default: "neutral" },
  createdAt: { type: Date, default: Date.now },
  //userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const Message = mongoose.model("Message", messageSchema);

const messagePairSchema = new mongoose.Schema({
  userMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
  aiMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
  category: String,
  questionType: String,
  sentiment: String,
  createdAt: { type: Date, default: Date.now },
});

const MessagePair = mongoose.model("MessagePair", messagePairSchema);

// User Profile Schema
const userProfileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  preferredSubjects: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const UserProfile = mongoose.model("UserProfile", userProfileSchema);

// Learning Material Schema
const learningMaterialSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  topic: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const LearningMaterial = mongoose.model(
  "LearningMaterial",
  learningMaterialSchema
);

// API Routes
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the BrainBytes API" });
});

// Get all messages
app.get("/api/messages", async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new message and get AI response
app.post("/api/messages", async (req, res) => {
  try {
    // Save user message
    const userMessage = new Message({
      text: req.body.text,
      isUser: true,
    });
    await userMessage.save();

    // Generate AI response with a 30-second overall timeout
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timeout")), 30000)
    );

    const aiResultPromise = generateResponse(req.body.text);

    // Race between the AI response and the timeout
    const aiResult = await Promise.race([
      aiResultPromise,
      timeoutPromise,
    ]).catch((error) => {
      console.error("AI response timed out or failed:", error);
      return {
        category: "error",
        response:
          "I'm sorry, but I couldn't process your request in time. Please try again with a simpler question.",
        questionType: "general",
        sentiment: "neutral",
      };
    });

    // Save AI response
    const aiMessage = new Message({
      text: aiResult.response,
      isUser: false,
      category: aiResult.category,
      questionType: aiResult.questionType,
      sentiment: aiResult.sentiment,
      //userId: user ? user._id : null,
    });
    await aiMessage.save();

    // Return both messages
    res.status(201).json({
      userMessage,
      aiMessage,
      category: aiResult.category,
      questionType: aiResult.questionType || "general",
      sentiment: aiResult.sentiment || "neutral",
    });
  } catch (err) {
    console.error("Error in /api/messages route:", err);
    res.status(400).json({ error: err.message });
  }
});

// User Profile CRUD Operations
// Create a new user profile
app.post("/api/users", async (req, res) => {
  try {
    const { name, email, preferredSubjects } = req.body;

    // Check if user already exists
    const existingUser = await UserProfile.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User with this email already exists" });
    }

    const userProfile = new UserProfile({
      name,
      email,
      preferredSubjects: preferredSubjects || [],
    });

    await userProfile.save();
    res.status(201).json(userProfile);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all user profiles
app.get("/api/users", async (req, res) => {
  try {
    const users = await UserProfile.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a specific user profile
app.get("/api/users/:id", async (req, res) => {
  try {
    const user = await UserProfile.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a user profile
app.put("/api/users/:id", async (req, res) => {
  try {
    const { name, email, preferredSubjects } = req.body;
    const updatedUser = await UserProfile.findByIdAndUpdate(
      req.params.id,
      {
        name,
        email,
        preferredSubjects,
        updatedAt: Date.now(),
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a user profile
app.delete("/api/users/:id", async (req, res) => {
  try {
    const deletedUser = await UserProfile.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User profile deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Learning Materials CRUD Operations
// Create a new learning material
app.post("/api/materials", async (req, res) => {
  try {
    const { subject, topic, content } = req.body;

    const material = new LearningMaterial({
      subject,
      topic,
      content,
    });

    await material.save();
    res.status(201).json(material);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all learning materials
app.get("/api/materials", async (req, res) => {
  try {
    // Support filtering by subject
    const filter = {};
    if (req.query.subject) {
      filter.subject = req.query.subject;
    }

    const materials = await LearningMaterial.find(filter);

    res.json(materials);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a specific learning material
app.get("/api/materials/:id", async (req, res) => {
  try {
    const material = await LearningMaterial.findById(req.params.id);

    if (!material) {
      return res.status(404).json({ error: "Learning material not found" });
    }

    res.json(material);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a learning material
app.put("/api/materials/:id", async (req, res) => {
  try {
    const { subject, topic, content } = req.body;
    const updatedMaterial = await LearningMaterial.findByIdAndUpdate(
      req.params.id,
      {
        subject,
        topic,
        content,
        updatedAt: Date.now(),
      },
      { new: true }
    );

    if (!updatedMaterial) {
      return res.status(404).json({ error: "Learning material not found" });
    }

    res.json(updatedMaterial);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a learning material
app.delete("/api/materials/:id", async (req, res) => {
  try {
    const deletedMaterial = await LearningMaterial.findByIdAndDelete(
      req.params.id
    );

    if (!deletedMaterial) {
      return res.status(404).json({ error: "Learning material not found" });
    }

    res.json({ message: "Learning material deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
