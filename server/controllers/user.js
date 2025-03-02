import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

async function handleUserRegister(req, res) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ msg: "Please provide all fields" });
    }
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await User.create({ name, email, password: hashedPassword });
    res.status(201).json({ msg: "user created successfully", result });
  } catch (error) {
    console.log("error creating user", error);
    res.status(500).json({ msg: "error creating user" });
  }
}

async function handleUserLogin(req, res) {
  try {
    const { email, password } = req.body;
    const entry = await User.findOne({
      email,
    });
    if (!entry) {
      return res.status(401).json({ msg: "User not Found", user: false });
    }
    const passwordMatch = await bcrypt.compare(password, entry.password);
    const name = entry.name;
    if (!passwordMatch)
      return res.status(401).json({ msg: "Invalid credentials", user: false });
    const token = jwt.sign(
      {
        entry,
      },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );
    return res.status(200).json({error:false, msg: "success", name: name, accessToken:token });
  } catch (error) {
    console.log("error logging in");
    res.status(400).json({ status: "error logging in", user: false });
  }
}

export { handleUserRegister, handleUserLogin };
