import express from "express";
import { createStaff, deleteStaff, getStaffs, shareStaffDetails, updateStaff, upload } from "../controllers/Staff.controller.js";

const router = express.Router();

//create a staff

router.post("/", upload.single('profileImage'), createStaff);

//delete a staff

router.delete("/:id", deleteStaff);

//update staff

router.put("/:id", upload.single('profileImage'), updateStaff);

//get all staffs

router.get("/", getStaffs);

// Route to share staff profile details
router.get("/share/:id", shareStaffDetails);


export default router;