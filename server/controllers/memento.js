import { Memento } from "../models/memento.model.js";
// import type { File } from "multer";
import { User } from "../models/user.model.js";
import path from "path";
import fs from "fs";
import { start } from "repl";
import { error } from "console";
const __dirname = path.resolve();

async function handleGetUser(req,res){
  if (!req.user) {
    return res.status(401).json({ error: true, message: "Unauthorized" });
  }
  try{
    const userId = req.user._id;
    const isUser = await User.findOne({_id: userId});
    if(!isUser){
      res.status(401).json({error:true, message:"User not found"});
    }
    return res.json({user: isUser, message: ""})
  }catch(error){
    console.log(error.message);
    res.status(500).json({error:true, message:error.message});
  }
}

async function handleAddMemento(req, res) {
  try {
    const { title, description, visitedLocation, imageUrl, visitedDate } =
      req.body;
    const { _id: userId } = req.user;
    if (
      !title ||
      !description ||
      !visitedLocation ||
      !imageUrl ||
      !visitedDate
    ) {
      return res.status(400).json({ msg: "Please provide all fields" });
    }
    const parsedVisitedDate = new Date(parseInt(visitedDate));
    const result = await Memento.create({
      title,
      description,
      visitedLocation,
      imageUrl,
      visitedDate: parsedVisitedDate,
      userId,
    });
    res.status(201).json({ msg: "memento added successfully", result });
  } catch (error) {
    console.log("error adding memento", error);
    res.status(500).json({ msg: "error adding memento" });
  }
}

async function handleGetAllMemento(req, res) {
  try {
    const userId = req.user._id;

    const result = await Memento.find({ userId });
    res
      .status(200)
      .json({ msg: "memento fetched successfully", result });
  } catch (error) {
    console.log("error getting memento", error);
    res.status(500).json({ msg: "error getting memento" });
  }
}

async function handleEditMemento(req, res) {
  try {
    const { id } = req.params;
    const { title, description, visitedLocation, imageUrl, visitedDate } =
      req.body;
    const userId = req.user._id;
    if (
      !title ||
      !description ||
      !visitedLocation ||
      !imageUrl ||
      !visitedDate
    ) {
      return res.status(400).json({ msg: "Please provide all fields" });
    }
    const parsedVisitedDate = new Date(parseInt(visitedDate));
    const result = await Memento.findOne({
      _id: id,
      userId: userId,
    });
    if (!result) {
      return res
        .status(404)
        .json({ error: true, msg: "memento not found" });
    }
    const placeholderImgUrl =
      "http://localhost:3000/assets/placeholder-image.png";
      result.title = title;
      result.description = description;
    result.visitedLocation = visitedLocation;
    result.imageUrl = imageUrl || placeholderImgUrl;
    result.visitedDate = parsedVisitedDate;

    await result.save();
    res
      .status(200)
      .json({ result: result, msg: "updated successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: true, msg: error.message });
  }
}

async function handleDeleteMemento(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const result = await Memento.findOne({
      _id: id,
      userId: userId,
    });
    if (!result) {
      return res
        .status(404)
        .json({ error: true, msg: "Memento not found" });
    }

    await result.deleteOne({ _id: id, userId: userId });

    const imageUrl = result.imageUrl;
    const filename = path.basename(imageUrl);
    const filePath = path.join(__dirname, "uploads", filename);

    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("failed to delete image", err);
      }
    });
    res.status(200).json({ msg: "Memento deleted successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: true, msg: error.message });
  }
}

async function handleUpdateIsFavourite(req, res) {
  try {
    const { id } = req.params;
    const { isFavourite } = req.body;
    const userId = req.user._id;

    const result = await Memento.findOne({ _id: id, userId });
    if (!result) {
      return res
        .status(404)
        .json({ error: true, msg: "Memento  not found" });
    }
    result.isFavourite = isFavourite;
    await result.save();
    res
      .status(200)
      .json({ memento: result, msg: "updated successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: true, msg: error.message });
  }
}

async function handleSearch(req, res) {
  try {
    const { query } = req.query;
    const userId = req.user._id;
    if (!query) {
      return res
        .status(404)
        .json({ error: true, message: "query is required" });
    }
    const searchResults = await Memento.find({
      userId: userId,
      $or: [
        { title: { $regex: query, $options: "i" } },
        { story: { $regex: query, $options: "i" } },
        { visitedLocation: { $regex: query, $options: "i" } },
      ],
    }).sort({ isFavourite: -1 });

    res.status(200).json({ mementos: searchResults });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: true, msg: error.message });
  }
}

async function handleFilter(req, res) {
  try {
    const { startDate, endDate } = req.query;
    const userId = req.user._id;
    const start = new Date(parseInt(startDate));
    const end = new Date(parseInt(endDate));
    const result = await Memento.find({
      userId: userId,
      visitedDate: { $gte: start, $lte: end },
    }).sort({ isFavourite: -1 });

    res.status(200).json({ mementos: result });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: true, message: error.message });
  }
}

export {
  handleGetUser,
  handleAddMemento,
  handleGetAllMemento,
  handleEditMemento,
  handleDeleteMemento,
  handleUpdateIsFavourite,
  handleSearch,
  handleFilter,
};
