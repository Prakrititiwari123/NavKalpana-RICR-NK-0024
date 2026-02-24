import express from "express";
import { updateUserProfile } from "../controllers/userController.js";

const router = express.Router();

router.post("/updateddata", updateUserProfile);


export default router;
