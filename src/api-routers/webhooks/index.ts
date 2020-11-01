import { config } from './../../configuration';
import { Router } from 'express';
import { middleware, RequestError, WebhookRequestBody } from "@line/bot-sdk";
import { replyOverBuyFlexMessage, replyRiseAndFallFlexMessage } from '../../services/line-chatbot.svc';
const router = Router();

const lineChatbotConfig = {
    channelAccessToken: config.lineChannelAccessToken,
    channelSecret: config.lineChannelSecret
}

router.use('/line-chatbot', middleware(lineChatbotConfig), async (req, res, next) => {
    const body: WebhookRequestBody = req.body
    for (const event of body.events) {
        if (event.type === "message" && event?.message.type === "text") {
            const replyToken = event.replyToken;
            if (event.message.text.includes("買超")) {
                await replyOverBuyFlexMessage(replyToken, true);
            } else if (event.message.text.indexOf("賣超")) {
                await replyOverBuyFlexMessage(replyToken, false);
            } else if (event.message.text.indexOf("漲幅排行")) {
                await replyRiseAndFallFlexMessage(replyToken, true);
            } else if (event.message.text.indexOf("跌幅排行")) {
                await replyRiseAndFallFlexMessage(replyToken, false);
            }
        }
    }
    res.json({
        body
    })
});

export default router;