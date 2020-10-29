import { Router } from 'express';
import UtilitiesRouter from "./utilities";
import WebhooksRouter from "./webhooks";
import * as bodyParser from "body-parser";
const router = Router();

router.use(bodyParser.json())
router.use('/utilities', UtilitiesRouter);
router.use('/webhooks', WebhooksRouter);
export default router;