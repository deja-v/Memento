import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import userRouter from "./routes/user.js";
import mementoRouter from "./routes/memento.js";
import auth from "./middlewares/auth.js";
import upload from "./utils/multer.js";  
import streamifier from "streamifier";
import path from "path";

import { v2 as cloudinary } from "cloudinary";
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
const PORT = process.env.PORT || 3000;

async function connectDB() {
  try {
    await mongoose.connect(`${process.env.MONGO_URI}/travel-journal`);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}
connectDB();

const allowedOrigins = [
  process.env.CLIENT_URL,      
  process.env.CLIENT_PROD_URL, 
];

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS policy: origin ${origin} not allowed`));
    }
  },
  methods: "GET,POST,PUT,DELETE",
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post("/image-upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ msg: "Please provide an image" });
  }

  const uploadStream = cloudinary.uploader.upload_stream(
    { folder: "travel-journal" },
    (err, result) => {
      if (err) {
        console.error("Cloudinary upload error:", err);
        return res.status(500).json({ error: true, msg: err.message });
      }
      res.status(201).json({
        imageUrl: result.secure_url,
        public_id: result.public_id,
      });
    }
  );

  streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
});

app.delete("/delete-image", async (req, res) => {
  const { public_id } = req.query;
  if (!public_id) {
    return res.status(400).json({ error: true, msg: "public_id parameter is required" });
  }
  try {
    const result = await cloudinary.uploader.destroy(String(public_id));
    if (result.result === "ok") {
      return res.status(200).json({ msg: "Image deleted successfully" });
    }
    return res.status(404).json({ error: true, msg: "Image not found or already deleted" });
  } catch (error) {
    console.error("Error deleting image:", error);
    return res.status(500).json({ error: true, msg: error.message });
  }
});

app.use("/assets", express.static(path.join(path.resolve(), "assets")));

app.use("/user", userRouter);
app.use("/memento", auth, mementoRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
