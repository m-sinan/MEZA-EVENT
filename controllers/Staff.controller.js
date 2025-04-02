import fs from 'fs';
import mongoose from 'mongoose';
import Staffs from '../models/staff_profile.js';





//get all staffs
export const getStaffs = async (req, res) => {
    try {
      const staffs = await Staffs.find();
      res.status(200).json({ success: true, data: staffs });
    } catch (error) {
      console.error("Error in get staffs:", error.message);
      res.status(500).json({ success: false, message: "server Error" });
    }
  };

export const createStaff = async (req, res) => {
  const staffs = req.body;



//   if (req.file) {
//     staffs.profileImage = `${req.file.filename}`; // Save the relative path
// }
  try {
    const existingStaff = await Staffs.findOne({ staff_Id: staffs.staff_Id });
    if (existingStaff) {
      if (req.file) {
        fs.unlinkSync(req.file.path); // Delete the uploaded file if staff already exists
      }
      return res.status(400).json({ success: false, message: "Staff ID already exists" });
    }

    const newStaff = new Staffs(staffs);
    await newStaff.save();

    res.status(201).json({ success: true, data: newStaff });
  } catch (error) {
    if (req.file) {
      fs.unlinkSync(req.file.path); // Delete the uploaded file if an error occurs
    }
    console.error("Error in create staff:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const deleteStaff = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid staff id" });
  }

  try {
    const staff = await Staffs.findById(id);
    if (!staff) {
      return res.status(404).json({ success: false, message: "Staff not found" });
    }

    // // Delete the profile image if it exists
    // if (staff.profileImage) {
    //   const imagePath = `./frontend/public/uploads/${staff.profileImage}`; // Adjust the path as needed
    //   if (fs.existsSync(imagePath)) {
    //     fs.unlinkSync(imagePath); // Delete the image file
    //   }
    // }

    await Staffs.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Staff deleted" });
  } catch (error) {
    console.log("Error in deleting staff:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateStaff = async (req, res) => {
  const { id } = req.params;
  const staff = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid staff id" });
  }

  try {
    const existingStaff = await Staffs.findById(id);
    if (!existingStaff) {
      return res.status(404).json({ success: false, message: "Staff not found" });
    }

    // If a new file is uploaded, delete the old image and update with the new one
    if (req.file) {
      if (existingStaff.profileImage) {
        const oldImagePath = `./frontend/public/uploads/${existingStaff.profileImage}`; // Adjust the path as needed
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath); // Delete the old image file
        }
      }
      staff.profileImage = req.file.filename; // Update with the new image filename
    }

    const updatedStaff = await Staffs.findByIdAndUpdate(id, staff, { new: true });
    res.status(200).json({ success: true, data: updatedStaff });
  } catch (error) {
    if (req.file) {
      const newImagePath = `../frontend/public/uploads/${req.file.filename}`; // Adjust the path as needed
      if (fs.existsSync(newImagePath)) {
        fs.unlinkSync(newImagePath); // Delete the uploaded file if an error occurs
      }
    }
    console.error("Error in updating staff:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};