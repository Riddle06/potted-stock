import { Router } from 'express';
import * as luxon from "luxon";
import { generateImages } from '../../services/task.svc';
const router = Router();

router.get('/current-time', async (req, res, next) => {

    res.json({
        currentDate: luxon.DateTime.local().toFormat("yyyy-MM-dd HH:mm:ss")
    })
})

router.post('/stock-images', async (req, res, next) => {
    try {
        const ret = await generateImages()
        res.json(ret);
    } catch (error) {
        res.json(error)
    }

})

export default router;