import jwt from "jsonwebtoken";
import redisClient from "../services/redis.service.js";
export const authUser = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization.split(" ")[1];
if(!token) {
    return res.status(401).send({ error: "Not authorized to access this resource" });
}

const isBlacklisted = await redisClient.get(token);
if(isBlacklisted) {
    res.cookies('token', '')
    return res.status(401).send({ error: "Not authorized to access this resource" });
}
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user=decoded;
    next();
  } catch (error) {
    res.status(401).send({ error: "Not authorized to access this resource" });
  }
}