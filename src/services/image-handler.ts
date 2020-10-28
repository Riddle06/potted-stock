import { config } from '../configuration';
import nodeHtmlToImage from "node-html-to-image";
import * as request from "request";
import * as path from "path";
import * as luxon from "luxon";


export async function generateImage({ pathPath }: { pathPath: string }): Promise<void> {

    const html = await getHtmlString({ pathPath })

    const output = path.resolve(__dirname, `../generate-files/${luxon.DateTime.local().toSeconds()}.png`)

    await nodeHtmlToImage({
        html,
        output,
        
    })
}


function getHtmlString({ pathPath }: { pathPath: string }): Promise<string> {

    if (pathPath.substring(0, 1) === "/") {
        pathPath = pathPath.substring(1);
    }

    return new Promise<string>((resolve, reject) => {
        request.get(`http://localhost:${config.appPort}/${pathPath}`, (error, response) => {

            resolve(response.body)
        })
    })
}