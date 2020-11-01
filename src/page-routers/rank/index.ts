import { Router } from 'express';
import OverBuyRouter from "./over-buy";
import OverSellRouter from "./over-sell";
const router = Router();

router.use('/over-buy', OverBuyRouter);
router.use('/over-sell', OverSellRouter);

export default router;