import { Client, FlexMessage } from '@line/bot-sdk';
import { Router } from 'express';
import * as luxon from "luxon";
const router = Router();

router.get('/current-time', async (req, res, next) => {

    res.json({
        currentDate: luxon.DateTime.local().toFormat("yyyy-MM-dd HH:mm:ss")
    })
})


export default router;