import { Router } from "express";
import RankRouter from "./rank";
const router = Router();

router.use('/rank', RankRouter);
export default router;