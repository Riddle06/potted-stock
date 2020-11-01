import { Router } from 'express';
import UtilitiesRouter from "./utilities";
import WebhooksRouter from "./webhooks";
import StockStatisticsRouter from "./stock-statistics";
import * as bodyParser from "body-parser";
const router = Router();

router.use((req, res, next) => {

    if (req.path.indexOf('/webhooks') === -1) {
        return bodyParser.json()(req, res, next);
    }

    // skip body parser 
    next();
})
router.use('/utilities', UtilitiesRouter);
router.use('/webhooks', WebhooksRouter);
router.use('/stock-statistics', StockStatisticsRouter)
export default router;