import { Router } from "express";
import { AdminController } from "../controllers/admin.controller";
import asyncHandler from "../helper/asyncHanlder";
import { verifySecretKey } from "../middleware/verifySecretKey";

const router = Router();

router.use(verifySecretKey);
router.get("/userIDs", asyncHandler(AdminController.getAllUserIDs));
router.post("/userIDs/date", asyncHandler(AdminController.getAllUserFromDate));
router.get("/deviceIDs", asyncHandler(AdminController.getAllDeviceIDs));
router.get("/users", asyncHandler(AdminController.getAllUserData));
router.get("/devices", asyncHandler(AdminController.getAllDeviceData));
router.get("/devicesV2", asyncHandler(AdminController.getAllDeviceDataV2));

export default router;
