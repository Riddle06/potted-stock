import { config } from './../../configuration';
import { Router } from 'express';
import { middleware, RequestError, WebhookRequestBody } from "@line/bot-sdk";
import { replyOverBuyFlexMessage } from '../../services/line-chatbot.svc';
const router = Router();

const lineChatbotConfig = {
    channelAccessToken: config.lineChannelAccessToken,
    channelSecret: config.lineChannelSecret
}


router.use('/line-chatbot', middleware(lineChatbotConfig), async (req, res, next) => {
    const body: WebhookRequestBody = req.body
    for (const event of body.events) {
        if (event.type === "message" && event?.message.type === "text") {
            const replyToken = event.replyToken
            if (event.message.text.indexOf("買超")) {
                await replyOverBuyFlexMessage(replyToken, true)
            } else if (event.message.text.indexOf("賣超")) {
                await replyOverBuyFlexMessage(replyToken, false)
            }
        }
    }
    res.json({
        body
    })
});

export default router;