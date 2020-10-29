import { config } from './../configuration';
import * as nodeSchedule from "node-schedule";
import * as luxon from "luxon";

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

    // push images to line chatbot

    // setTimeout 將圖片清空 
}

async function clearFolderFiles() {
    console.log(`clear folder file`);
}


function isNeedToPush(): boolean {
    const allowPushWeekDay = [1, 2, 3, 4, 5]
    const currentWeekDay = luxon.DateTime.local().get('weekday')

    return allowPushWeekDay.some(weekday => weekday === currentWeekDay)
}