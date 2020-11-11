import { Router } from "express";
import RankRouter from "./rank";
const router = Router();

router.use('/rank', RankRouter);

router.get('/', async (req, res, next) => {

    // 

    res.render('index');
});
export default router;