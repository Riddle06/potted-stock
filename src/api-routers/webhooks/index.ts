import { config } from './../../configuration';
import { Router } from 'express';
import { middleware, RequestError, WebhookRequestBody } from "@line/bot-sdk";
const router = Router();

const lineChatbotConfig = {
    channelAccessToken: config.lineChannelAccessToken,
    channelSecret: config.lineChannelSecret
}


router.use('/line-chatbot', middleware(lineChatbotConfig), async (req, res, next) => {
    const body: WebhookRequestBody = req.body
    res.json({
        body
    })
});

export default router;