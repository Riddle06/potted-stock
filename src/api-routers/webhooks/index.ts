import { config } from './../../configuration';
import { Router } from 'express';
import { middleware, WebhookRequestBody } from "@line/bot-sdk";
const router = Router();

router.use('/line-chatbot', middleware({
    channelAccessToken: config.lineChannelAccessToken,
    channelSecret: config.lineChannelSecret
}), async (req, res, next) => {
    const body: WebhookRequestBody = req.body
    res.json({
        body
    })
});

export default router;