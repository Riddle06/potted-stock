import { config } from './../configuration';
import * as nodeSchedule from "node-schedule";

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
    console.log({
        current: new Date()
    })
    // 現在時間是否要 run service

    // 產圖片：買賣超 外資 , 投信, 主力, 自營商

    // push images to line chatbot

    // setTimeout 將圖片清空 
}

async function clearFolderFiles() {
    console.log(`clear folder file`);

    console.log({
        env: process.env
    })
}
