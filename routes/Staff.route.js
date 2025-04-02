import express from "express";
import { createStaff, deleteStaff, getStaffs, updateStaff } from "../controllers/Staff.controller.js";

const router = express.Router();

//create a staff

router.post("/", createStaff);

//delete a staff

router.delete("/:id", deleteStaff);

//update staff

router.put("/:id", updateStaff);

//get all staffs

router.get("/", getStaffs);


export default router;