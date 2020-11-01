import { getBig5Content, parseRiseAndFallRankHtml, sourceUrls } from '../../services/stock-fetcher';
import { Router } from 'express';
const router = Router();

router.get('/rise-rank', async (req, res, next) => {
    const html = await getBig5Content({ url: sourceUrls.rise });
    
    const items = parseRiseAndFallRankHtml({ html });
    res.json({
        success: true,
        items
    })
})

router.get('/fall-rank', async (req, res, next) => {

})

export default router;