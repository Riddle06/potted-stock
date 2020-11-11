import { Router } from 'express';
import { getBig5Content, parseRiseAndFallRankHtml, sourceUrls } from '../../services/stock-fetcher';
import OverBuyRouter from "./over-buy";
import OverSellRouter from "./over-sell";
import * as luxon from "luxon";
import commaNumber from 'comma-number';
const router = Router();

// 買超排行
router.use('/over-buy', OverBuyRouter);
// 賣超排行
router.use('/over-sell', OverSellRouter);
// 漲幅排行
router.use('/rise', async (req, res) => {
    const url: string = sourceUrls.rise;
    const html = await getBig5Content({ url });
    const result = parseRiseAndFallRankHtml({ html })
    const title: string = luxon.DateTime.fromJSDate(result.dateQuery).toFormat("MM/dd") + " 漲幅排行";
    const titleCssClassName = "danger";
    const items = result.items.map((item) => {
        return {
            ...item,
            riseRateText: (item.riseRate * 100).toFixed(2) + '%',
            dealCountText: commaNumber(item.dealCount),
        }
    })

    res.render('rise-and-fall', { items, title, titleCssClassName });
})
// 跌幅排行
router.use('/fall', async (req, res) => {
    const url: string = sourceUrls.fall;
    const html = await getBig5Content({ url });
    const result = parseRiseAndFallRankHtml({ html })
    const title: string = luxon.DateTime.fromJSDate(result.dateQuery).toFormat("MM/dd") + " 跌幅排行";
    const titleCssClassName = "success";
    const items = result.items.map((item) => {
        return {
            ...item,
            riseRateText: (item.riseRate * 100).toFixed(2) + '%',
            dealCountText: commaNumber(item.dealCount)
        }
    })
    res.render('rise-and-fall', { items, title, titleCssClassName });
})

export default router;