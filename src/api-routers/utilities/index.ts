import { Router } from 'express';
import * as luxon from "luxon";
import { clearFolderFiles, generateImages } from '../../services/task.svc';
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

router.delete('/stock-images', async (req, res, next) => {
    await clearFolderFiles()
    res.json({
        success: true
    })
})

export default router;