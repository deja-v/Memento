import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import userRouter from "./routes/user.js";
import mementoRouter from "./routes/memento.js";
import auth from "./middlewares/auth.js";
import path from "path";
import upload from "./utils/multer.js";
import fs from "fs";

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const __dirname = path.resolve();

const app = express();
const PORT = 3000;

async function connectDB() {
  try {
    await mongoose.connect(`${process.env.MONGO_URI}/travel-journal`);
    console.log("connected to MongoDB");
  } catch (error) {
    console.log("error connecting to MongoDB", error);
  }
}

connectDB();

const allowedOrigins = ["http://localhost:5173"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: "GET,POST,PUT,DELETE",
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post("/image-upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: "Please provide an image" });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "travel-journal",
    });

    fs.unlink(req.file.path, (err) => {
      if (err && err.code !== 'ENOENT') {
        console.error('Error deleting temp file:', err);
      }
    });

    return res.status(201).json({
      imageUrl: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    return res.status(500).json({ error: true, msg: error.message });
  }
});

app.delete("/delete-image", async (req, res) => {
  const { public_id } = req.query;

  if (!public_id) {
    return res.status(400).json({
      error: true,
      msg: "public_id parameter is required",
    });
  }

  try {
    const result = await cloudinary.uploader.destroy(String(public_id));
    if (result.result === "ok") {
      return res.status(200).json({ msg: "Image deleted successfully" });
    }
    return res.status(404).json({ error: true, msg: "Image not found or already deleted" });
  } catch (error) {
    console.error("Error deleting image:", error.message);
    return res.status(500).json({ error: true, msg: error.message });
  }
});


app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/assets", express.static(path.join(__dirname, "assets")));

app.use("/user", userRouter);
app.use("/memento", auth, mementoRouter);

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
