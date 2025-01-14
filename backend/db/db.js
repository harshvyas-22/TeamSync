import mongoose from "mongoose";
import dotenv from "dotenv/config";

function connect() {
  return mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("Database connected");
    })
    .catch((error) => {
      console.log("Error connecting to database", error);
    });
}

export default connect;
