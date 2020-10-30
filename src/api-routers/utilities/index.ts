import { Router } from 'express';
import * as luxon from "luxon";
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

export default router;