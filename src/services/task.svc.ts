import { config } from './../configuration';
import * as nodeSchedule from "node-schedule";
import * as luxon from "luxon";
import * as fs from "fs";
import * as util from "util";
import * as path from "path";
import { RankPageViewModel, RankType } from '../view-models/rank.vm';
import { getAllRankPageViewModels, getBig5Content, parseRankStockHtml, sourceUrls } from './stock-fetcher';
import nodeHtmlToImage from "node-html-to-image";
import { Client, FlexMessage, ImageMessage } from '@line/bot-sdk';
import * as del from "del";
import { generateRankStockFlexMessages } from './line-chatbot.svc';

export async function setTasks(): Promise<void> {
    nodeSchedule.scheduleJob(config.schedulePushToLineChatbot, () => {
        pushToLineChatbotTask()
    });

    nodeSchedule.scheduleJob(config.scheduleClearFolder, () => {
        clearFolderFiles()
    });
}


export async function pushToLineChatbotTask(): Promise<void> {
    console.log(`pushToLineChatbotTask start`)

    // 現在時間是否要 run service

    if (!isNeedToPush()) {
        return;
    }

    const pageModels = await getAllRankPageViewModels(10)
    
    const client = new Client({
        channelAccessToken: config.lineChannelAccessToken,
        channelSecret: config.lineChannelSecret
    })

    const overBuyModels = pageModels.filter(model => model.isOverBuy);
    const overSellModels = pageModels.filter(model => !model.isOverBuy);

    const overBuyFlexMessage = generateRankStockFlexMessages(overBuyModels, "法人買超排行");
    const overSellFlexMessage = generateRankStockFlexMessages(overSellModels, "法人賣超排行");

    await client.broadcast(overBuyFlexMessage);
    await client.broadcast(overSellFlexMessage);

    return;
}

export async function clearFolderFiles(): Promise<boolean> {
    const clearPath = path.resolve(__dirname, `../../generate-files/*/`);
    del.sync([clearPath]);
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
    const pageModels = await getAllRankPageViewModels();
    const dateQuery = pageModels[0]?.dateQuery ?? new Date();
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

    return ret;
}

