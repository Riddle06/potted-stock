import { config } from './../configuration';
import * as nodeSchedule from "node-schedule";
import * as luxon from "luxon";
import * as fs from "fs";
import * as util from "util";
import * as path from "path";
import { RankPageViewModel, RankType } from '../view-models/rank.vm';
import { getBig5Content, parseRankStockHtml, sourceUrls } from './stock-fetcher';
import nodeHtmlToImage from "node-html-to-image";

export async function setTasks(): Promise<void> {
    nodeSchedule.scheduleJob(config.schedulePushToLineChatbot, () => {
        pushToLineChatbotTask()
    });

    nodeSchedule.scheduleJob(config.scheduleClearFolder, () => {
        clearFolderFiles()
    });
}


async function pushToLineChatbotTask() {
    console.log(`pushToLineChatbotTask start`)
    // 現在時間是否要 run service

    if (!isNeedToPush()) {
        return;
    }

    // 產圖片：買賣超 外資 , 投信, 主力, 自營商
    const ret = await generateImages()

    // push images to line chatbot
}

export async function clearFolderFiles(): Promise<boolean> {
    const rm = util.promisify(fs.rm)
    const clearPath = path.resolve(__dirname, `../../generate-files`);
    const removeResult = await rm(clearPath, { recursive: true, force: true });
    return true
}


function isNeedToPush(): boolean {
    const allowPushWeekDay = [1, 2, 3, 4, 5]
    const currentWeekDay = luxon.DateTime.local().get('weekday')

    return allowPushWeekDay.some(weekday => weekday === currentWeekDay)
}

export async function generateImages(): Promise<string[]> {
    const ret: string[] = [];
    const readFile = util.promisify(fs.readFile)
    const htmlTemplate = await readFile(path.resolve(__dirname, '../../views/rank.handlebars'), { encoding: 'utf-8' });

    const foreignHtml = await getBig5Content({ url: sourceUrls.foreign });
    const creditHtml = await getBig5Content({ url: sourceUrls.credit });
    const hotHtml = await getBig5Content({ url: sourceUrls.hot });
    const selfEmployedHtml = await getBig5Content({ url: sourceUrls.selfEmployed });

    const { riseItems: foreignRiseItems, fallItems: foreignFallItems, dateQuery } = await parseRankStockHtml({ html: foreignHtml });
    const { riseItems: creditRiseItems, fallItems: creditFallItems } = await parseRankStockHtml({ html: creditHtml });
    const { riseItems: hotRiseItems, fallItems: hotFallItems } = await parseRankStockHtml({ html: hotHtml });
    const { riseItems: selfEmployedRiseItems, fallItems: selfEmployedFallItems } = await parseRankStockHtml({ html: selfEmployedHtml });

    const pageModels: RankPageViewModel[] = [
        new RankPageViewModel({ dateQuery, isOverBuy: true, rankStockItems: foreignRiseItems, rankType: RankType.foreign }),
        new RankPageViewModel({ dateQuery, isOverBuy: true, rankStockItems: creditRiseItems, rankType: RankType.credit }),
        new RankPageViewModel({ dateQuery, isOverBuy: true, rankStockItems: hotRiseItems, rankType: RankType.hot }),
        new RankPageViewModel({ dateQuery, isOverBuy: true, rankStockItems: selfEmployedRiseItems, rankType: RankType.selfEmployed }),
        new RankPageViewModel({ dateQuery, isOverBuy: false, rankStockItems: foreignFallItems, rankType: RankType.foreign }),
        new RankPageViewModel({ dateQuery, isOverBuy: false, rankStockItems: creditFallItems, rankType: RankType.credit }),
        new RankPageViewModel({ dateQuery, isOverBuy: false, rankStockItems: hotFallItems, rankType: RankType.hot }),
        new RankPageViewModel({ dateQuery, isOverBuy: false, rankStockItems: selfEmployedFallItems, rankType: RankType.selfEmployed }),
    ]

    const dirPath = path.resolve(__dirname, `../../generate-files/${luxon.DateTime.fromJSDate(dateQuery).toFormat("yyyy-MM-dd")}`);

    if (!fs.existsSync(dirPath)) {
        console.log(`create dir ${dirPath}`)
        fs.mkdirSync(dirPath);
    }

    await nodeHtmlToImage({
        html: htmlTemplate,
        puppeteerArgs: { args: ['--no-sandbox'] },
        content: pageModels.map(model => {
            const fileName = `${model.rankType}-${model.isOverBuy ? "over-buy" : "over-sell"}-${luxon.DateTime.local().toSeconds()}.png`;
            const output = path.resolve(__dirname, `../../generate-files/${luxon.DateTime.fromJSDate(model.dateQuery).toFormat("yyyy-MM-dd")}/${fileName}`);
            ret.push(`${config.appBaseUrl}/static/${luxon.DateTime.fromJSDate(model.dateQuery).toFormat("yyyy-MM-dd")}/${fileName}`)
            return {
                ...model,
                output
            }
        })
    })

    console.log({ ret })

    return ret;
}

