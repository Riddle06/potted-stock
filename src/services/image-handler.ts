import { config } from '../configuration';
import nodeHtmlToImage from "node-html-to-image";
import * as request from "request";
import * as path from "path";
import * as luxon from "luxon";


/**
 * 將本機頁面路徑轉換成圖片
 */
export async function generateImage({ localPath }: { localPath: string }): Promise<void> {

    const html = await getHtmlString({ localPath })
    
    const output = path.resolve(__dirname, `../../generate-files/${luxon.DateTime.local().toSeconds()}.png`)
    
    await nodeHtmlToImage({
        html,
        output,
    })
}


function getHtmlString({ localPath }: { localPath: string }): Promise<string> {

    if (localPath.substring(0, 1) === "/") {
        localPath = localPath.substring(1);
    }

    return new Promise<string>((resolve, reject) => {
        request.get(`http://localhost:${config.appPort}/${localPath}`, (error, response) => {

            resolve(response.body)
        })
    })
}