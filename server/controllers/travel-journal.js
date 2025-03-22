import { TravelJournal } from "../models/travel-journal.model.js";
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

async function handleAddTravelJournal(req, res) {
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
    const result = await TravelJournal.create({
      title,
      description,
      visitedLocation,
      imageUrl,
      visitedDate: parsedVisitedDate,
      userId,
    });
    res.status(201).json({ msg: "travel journal added successfully", result });
  } catch (error) {
    console.log("error adding travel journal", error);
    res.status(500).json({ msg: "error adding travel journal" });
  }
}

async function handleGetAllTravelJournal(req, res) {
  try {
    const userId = req.user._id;

    const result = await TravelJournal.find({ userId });
    res
      .status(200)
      .json({ msg: "travel journal fetched successfully", result });
  } catch (error) {
    console.log("error getting travel journal", error);
    res.status(500).json({ msg: "error getting travel journal" });
  }
}

async function handleEditTravelJournal(req, res) {
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
    const travelJournal = await TravelJournal.findOne({
      _id: id,
      userId: userId,
    });
    if (!travelJournal) {
      return res
        .status(404)
        .json({ error: true, msg: "Travel Journal not found" });
    }
    const placeholderImgUrl =
      "http://localhost:3000/assets/placeholder-image.png";
    travelJournal.title = title;
    travelJournal.description = description;
    travelJournal.visitedLocation = visitedLocation;
    travelJournal.imageUrl = imageUrl || placeholderImgUrl;
    travelJournal.visitedDate = parsedVisitedDate;

    await travelJournal.save();
    res
      .status(200)
      .json({ result: travelJournal, msg: "updated successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: true, msg: error.message });
  }
}

async function handleDeleteTravelJournal(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const travelJournal = await TravelJournal.findOne({
      _id: id,
      userId: userId,
    });
    if (!travelJournal) {
      return res
        .status(404)
        .json({ error: true, msg: "Travel Journal not found" });
    }

    await travelJournal.deleteOne({ _id: id, userId: userId });

    const imageUrl = travelJournal.imageUrl;
    const filename = path.basename(imageUrl);
    const filePath = path.join(__dirname, "uploads", filename);

    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("failed to delete image", err);
      }
    });
    res.status(200).json({ msg: "Travel Journal deleted successfully" });
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

    const travelJournal = await TravelJournal.findOne({ _id: id, userId });
    if (!travelJournal) {
      return res
        .status(404)
        .json({ error: true, msg: "Travel Journal not found" });
    }
    travelJournal.isFavourite = isFavourite;
    await travelJournal.save();
    res
      .status(200)
      .json({ journal: travelJournal, msg: "updated successfully" });
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
    const searchResults = await TravelJournal.find({
      userId: userId,
      $or: [
        { title: { $regex: query, $options: "i" } },
        { story: { $regex: query, $options: "i" } },
        { visitedLocation: { $regex: query, $options: "i" } },
      ],
    }).sort({ isFavourite: -1 });

    res.status(200).json({ journals: searchResults });
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
    const filteredJournals = await TravelJournal.find({
      userId: userId,
      visitedDate: { $gte: start, $lte: end },
    }).sort({ isFavourite: -1 });

    res.status(200).json({ journals: filteredJournals });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: true, message: error.message });
  }
}

export {
  handleGetUser,
  handleAddTravelJournal,
  handleGetAllTravelJournal,
  handleEditTravelJournal,
  handleDeleteTravelJournal,
  handleUpdateIsFavourite,
  handleSearch,
  handleFilter,
};
