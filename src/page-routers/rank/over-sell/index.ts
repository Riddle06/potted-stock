import { Router } from 'express';
import { getBig5Content, parseRankStockHtml, sourceUrls } from '../../../services/stock-fetcher';
import { RankPageViewModel, RankType } from '../../../view-models/rank.vm';
const router = Router();
const isOverBuy = false;
router.get('/foreign', async (req, res) => {
    const html = await getBig5Content({ url: sourceUrls.foreign });
    const { fallItems, dateQuery } = await parseRankStockHtml({ html });
    const model = new RankPageViewModel({
        dateQuery,
        isOverBuy,
        rankStockItems: fallItems,
        rankType: RankType.foreign
    });
    res.render('rank', model);
})

router.get('/credit', async (req, res) => {
    const html = await getBig5Content({ url: sourceUrls.credit });
    const { fallItems, dateQuery } = await parseRankStockHtml({ html });
    const model = new RankPageViewModel({
        dateQuery,
        isOverBuy,
        rankStockItems: fallItems,
        rankType: RankType.credit
    });
    res.render('rank', model);
})

router.get('/self-employed', async (req, res) => {
    const html = await getBig5Content({ url: sourceUrls.selfEmployed });
    const { fallItems, dateQuery } = await parseRankStockHtml({ html });
    const model = new RankPageViewModel({
        dateQuery,
        isOverBuy,
        rankStockItems: fallItems,
        rankType: RankType.selfEmployed
    });
    res.render('rank', model);
})

router.get('/hot', async (req, res) => {
    const html = await getBig5Content({ url: sourceUrls.hot });
    const { fallItems, dateQuery } = await parseRankStockHtml({ html });
    const model = new RankPageViewModel({
        dateQuery,
        isOverBuy,
        rankStockItems: fallItems,
        rankType: RankType.hot
    });
    res.render('rank', model);
})

export default router;