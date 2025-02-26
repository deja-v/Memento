import { Router } from "express";
import { handleUserLogin, handleUserRegister } from "../controllers/user.js";
const router = Router();

router.post("/login", (req,res)=>{
    handleUserLogin(req,res);
});

router.post("/register", (req,res)=>{
    handleUserRegister(req,res);
});



export default router;