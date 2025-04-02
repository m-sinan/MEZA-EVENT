import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import staffRoutes from "./routes/Staff.route.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import bodyParser from 'body-parser'


const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
dotenv.config();
app.use(express.json());
// app.use('/uploads', express.static('uploads')); // Serve uploaded images
app.use(bodyParser.json());

//Routes
app.use("/api/staffs", staffRoutes)

app.use('/api/attendance', attendanceRoutes);

app.listen(PORT, () => {
  connectDB();
  console.log("server started at http://localhost:"+PORT);
});
