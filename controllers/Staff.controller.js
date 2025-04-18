import mongoose from "mongoose";
import Staffs from "../models/staff_profile.js";
import multer from "multer";

// Middleware to get all staffs
export const getStaffs = async (req, res) => {
  try {
    const staffs = await Staffs.find();
    const convertedImages = staffs.map((staff) => {
      let profileImage = null;
      if (staff.profileImage && staff.profileImage.data) {
        profileImage = {
          contentType: staff.profileImage.contentType,
          data: staff.profileImage.data.toString("base64"),
        };
      }
      return {
        ...staff._doc,
        profileImage,
      };
    });
    res.status(200).json({ success: true, data: convertedImages });
  } catch (error) {
    console.error("Error in get staffs:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Middleware to handle file uploads
const storage = multer.memoryStorage();
export const upload = multer({ storage: storage });

// Middleware to create a new staff member
export const createStaff = async (req, res) => {
  const { name, staff_Id, location, phone_Number } = req.body;
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded");
    }
    const existingStaff = await Staffs.findOne({ staff_Id });
    if (existingStaff) {
      return res
        .status(400)
        .json({ success: false, message: "Staff ID already exists" });
    }
    const newStaff = new Staffs({
      name,
      staff_Id,
      location,
      phone_Number,
      profileImage: {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      },
    });
    await newStaff.save();
    res.status(201).send(newStaff);
  } catch (error) {
    console.error("Error in creating staff:", error.message);
    res.status(500).send(error.message);
  }
};

// Middleware to delete a staff member by ID
export const deleteStaff = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid staff id" });
  }
  try {
    const staff = await Staffs.findById(id);
    if (!staff) {
      return res
        .status(404)
        .json({ success: false, message: "Staff not found" });
    }
    await Staffs.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Staff deleted" });
  } catch (error) {
    console.error("Error in deleting staff:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Middleware to update a staff member by ID
export const updateStaff = async (req, res) => {
  const { id } = req.params;
  const { name, staff_Id, location, phone_Number } = req.body;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid staff id" });
  }
  try {
    const existingStaff = await Staffs.findById(id);
    if (!existingStaff) {
      return res
        .status(404)
        .json({ success: false, message: "Staff not found" });
    }
    const updatedStaff = await Staffs.findByIdAndUpdate(
      id,
      {
        name,
        staff_Id,
        location,
        phone_Number,
        profileImage: { data: req.file.buffer, contentType: req.file.mimetype },
      },
      { new: true }
    );
    res.status(200).json({ success: true, data: updatedStaff });
  } catch (error) {
    console.error("Error in updating staff:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
