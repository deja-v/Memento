import { Router } from "express";
import {
  handleAddTravelJournal,
  handleGetAllTravelJournal,
  handleEditTravelJournal,
  handleDeleteTravelJournal,
  handleUpdateIsFavourite,
  handleSearch,
  handleFilter
} from "../controllers/travel-journal.js";

const router = Router();

router.post("/add", (req, res) => {
  handleAddTravelJournal(req, res);
});

router.get("/all", (req, res) => {
  handleGetAllTravelJournal(req, res);
});

router.put("/edit/:id", (req,res)=>{
  handleEditTravelJournal(req,res);
})

router.delete("/delete/:id", (req,res)=>{
  handleDeleteTravelJournal(req,res);
})

router.put("/update-favourite/:id", (req,res)=>{
  handleUpdateIsFavourite(req,res);
})

router.get("/search", (req,res)=>{
  handleSearch(req,res);
})

router.get('/filter', (req,res)=>{
  handleFilter(req,res);
})

export default router;
