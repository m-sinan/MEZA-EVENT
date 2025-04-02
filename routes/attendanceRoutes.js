import express from 'express';
import { deleteAttendance, getAttendance, submitAttendance } from '../controllers/attendanceController.js';

const router = express.Router();


router.post('/', submitAttendance);
router.get('/:param', getAttendance);
router.delete('/:id', deleteAttendance);
// router.get('/:location', getAttendanceByLocation);
export default router;