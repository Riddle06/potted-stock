import { config } from './../configuration';
import * as nodeSchedule from "node-schedule";
import * as luxon from "luxon";
import * as path from "path";
import { getAllRankPageViewModels } from './stock-fetcher';
import { Client } from '@line/bot-sdk';
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