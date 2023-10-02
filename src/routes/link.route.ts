import { Router } from "express";
import { LinkController } from "../controllers/link.controller";
import asyncHandler from "../helper/asyncHanlder";

const router = Router();

router.post('/', asyncHandler(LinkController.createLink));
router.post('/unLINK', asyncHandler(LinkController.unLink));
router.post('/all', asyncHandler(LinkController.getAllLinkOfUser));

export default router;