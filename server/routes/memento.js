import { Router } from "express";
import {
  handleGetUser,
  handleAddMemento,
  handleGetAllMemento,
  handleEditMemento,
  handleDeleteMemento,
  handleUpdateIsFavourite,
  handleSearch,
  handleFilter
} from "../controllers/memento.js";

const router = Router();

router.get("/get-user", (req,res)=>{
  handleGetUser(req,res);
})

router.post("/add", (req, res) => {
  handleAddMemento(req, res);
});

router.get("/all", (req, res) => {
  handleGetAllMemento(req, res);
});

router.put("/edit/:id", (req,res)=>{
  handleEditMemento(req,res);
})

router.delete("/delete/:id", (req,res)=>{
  handleDeleteMemento(req,res);
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
