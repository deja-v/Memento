import jwt from "jsonwebtoken";

async function auth(
  req,
  res,
  next
){
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({ msg: "token not found" });
      return;
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      res.status(401).json({ msg: "token not found" });
      return;
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (!decoded) {
      res.status(401).json({ msg: "invalid or expired token" });
      return;
    }

    req.user = decoded.entry;
    next();
  } catch (error) {
    res.status(500).json({ msg: "error authenticating user" });
  }
}

export default auth;
