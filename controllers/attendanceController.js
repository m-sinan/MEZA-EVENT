import Attendance from '../models/Attendance.js';
import Staffs from '../models/staff_profile.js';

export const submitAttendance = async (req, res) => {
  const {  staff_name, staff_Id, master, location } = req.body;

  try {
    // Check if the staffId exists
    const staff = await Staffs.findOne({ staff_Id });
    if (!staff) {
      return res.status(404).json({ message: 'Staff ID not found' });
    }

        // Check if attendance already submitted for the same location today
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to start of the day

    const existingAttendance = await Attendance.findOne({
      staff_name,
      staff_Id,
      master,
      location,
      date: { $gte:today }, // Check for today's date
    });

    if (existingAttendance) {
      return res.status(400).json({ message: 'Attendance already submitted for this location today' });
    }

    // Submit attendance
    const newAttendance = new Attendance({ staff_name, staff_Id, master, location, });
    await newAttendance.save();
    res.status(201).json(newAttendance);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


// Updated getAttendance controller to handle both staff_Id and location
export const getAttendance = async (req, res) => {
  const { param } = req.params;
  
  try {
    // Try to find by staff_Id first (assuming staff IDs are numeric)
    let attendance = await Attendance.find({ staff_Id: param });
    
    // If no results found by staff_Id, try searching by location
    if (attendance.length === 0) {
      attendance = await Attendance.find({ location: param });
    }
    
    res.json(attendance);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteAttendance = async (req, res) => {
  const { id } = req.params;
  try {
    await Attendance.findByIdAndDelete(id);
    res.json({ message: 'Attendance deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}