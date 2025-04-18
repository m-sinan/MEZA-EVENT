import express from "express";
import { createStaff, deleteStaff, getStaffs, updateStaff, upload } from "../controllers/Staff.controller.js";

const router = express.Router();

//create a staff

router.post("/", upload.single('profileImage'), createStaff);

//delete a staff

router.delete("/:id", deleteStaff);

//update staff

router.put("/:id", upload.single('profileImage'), updateStaff);

//get all staffs

router.get("/", getStaffs);


export default router;