import express from "express";
import { LoginController } from "../controllers/login.controller";
import asyncHandler from "../helper/asyncHanlder";

const router = express.Router();

router.post('/LogDEV2', asyncHandler(LoginController.loginWithDevice))
router.post('/LogID', asyncHandler(LoginController.loginWithUserId))
router.post('/LogLink', asyncHandler(LoginController.loginWithLink))

export default router;