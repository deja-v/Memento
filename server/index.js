import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import userRouter from "./routes/user.js";
import mementoRouter from "./routes/memento.js";
import auth from "./middlewares/auth.js";
import path from "path";
import upload from "./utils/multer.js"
import fs from "fs";
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

app.post("/image-upload",upload.single("image"), async (req,res)=>{
  try {
    if (!req.file) {
      return res.status(400).json({ msg: "Please provide an image" });
    }
    const imageUrl = `http://localhost:3000/uploads/${req.file.filename}`;
    res.status(201).json({ imageUrl });
  } catch (error) {
    res.status(500).json({ error: true, msg: error.message });
  }
});

app.delete("/delete-image", async (req, res) => {
  const { imageUrl } = req.query;
  console.log(req.query)
  if (!imageUrl) {
    return res
    .status(400)
    .json({ error: true, msg: "imageUrl Parameter is required" });
  }
  
  try{
    const filename = path.basename(imageUrl);
    const filePath = path.join(__dirname, "uploads", filename);
    
    if(fs.existsSync(filePath)){
      fs.unlinkSync(filePath);
      res.status(200).json({msg: "Image deleted successfully"});
    }
    else{
      res.status(404).json({error: true, msg: "Image not found"});
    }
    
  }
  catch(error){
    console.log(error.message);
    res.status(500).json({error: true, msg: error.message});
  }
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/assets", express.static(path.join(__dirname, "assets")));

app.use("/user", userRouter);
app.use("/memento", auth, mementoRouter);

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
