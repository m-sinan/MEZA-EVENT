import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema({
 staff_name: { type: String, required: true },
  staff_Id: { type: String, required: true },
  date: { type: Date, default: Date.now },
  master: { type: String, required: true },
  location: { type: String, required: true },
  status: { type: String, default: "Present" },
});

const Attendance = mongoose.model("Attendance", AttendanceSchema);

export default Attendance;
