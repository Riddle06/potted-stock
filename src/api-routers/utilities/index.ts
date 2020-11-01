import { Client, FlexMessage } from '@line/bot-sdk';
import { Router } from 'express';
import * as luxon from "luxon";
import { config } from '../../configuration';
import { generateRiseAndFallRankStockFlexMessages } from '../../services/line-chatbot.svc';
import { sourceUrls, getBig5Content, parseRiseAndFallRankHtml } from '../../services/stock-fetcher';
import { clearFolderFiles, pushToLineChatbotTask } from '../../services/task.svc';
const router = Router();

router.get('/current-time', async (req, res, next) => {

    res.json({
        currentDate: luxon.DateTime.local().toFormat("yyyy-MM-dd HH:mm:ss")
    })
})

router.post('/try-broadcast', async (req, res, next) => {
    try {
        const urls = await pushToLineChatbotTask()
        res.json({
            success: true,
            urls
        })
    } catch (error) {
        console.log(error)
        res.json(error)
    }

})

router.post('/try-broadcast-rise-rank', async (req, res, next) => {
    try {
        const isRise = true;
        const top: number = 10;
        const url: string = isRise ? sourceUrls.rise : sourceUrls.fall;
        const html = await getBig5Content({ url });
        const items = parseRiseAndFallRankHtml({ html }).slice(0, top);
        const altText: string = isRise ? "漲幅排行" : "跌幅排行";
        const flexMessage: FlexMessage = generateRiseAndFallRankStockFlexMessages(items, altText, isRise)
        const client = new Client({
            channelAccessToken: config.lineChannelAccessToken,
            channelSecret: config.lineChannelSecret
        });

        await client.broadcast(flexMessage);

    } catch (error) {
        console.log(error)
        res.json(error)
    }

})

export default router;