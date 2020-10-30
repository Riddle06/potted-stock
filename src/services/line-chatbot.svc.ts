import { Client, FlexBubble, FlexComponent, FlexMessage } from '@line/bot-sdk';
import { RankPageViewModel, RankType } from '../view-models/rank.vm';
import { getAllRankPageViewModels, RankStockItem } from './stock-fetcher';
import commaNumber from "comma-number";
import { config } from '../configuration';


const client = new Client({
    channelAccessToken: config.lineChannelAccessToken,
    channelSecret: config.lineChannelSecret
})


export async function replyOverBuyFlexMessage(replyToken: string, isOverBuy: boolean): Promise<void> {
    const top: number = 10;
    const models = await getAllRankPageViewModels(top)
    let filterModels: RankPageViewModel[];
    let altText: string;
    if (isOverBuy) {
        filterModels = models.filter(model => model.isOverBuy)
        altText = `法人買超排行前 ${top} 名`;
    } else {
        filterModels = models.filter(model => !model.isOverBuy)
        altText = `法人賣超排行前 ${top} 名`;
    }
    const flexMessage = generateRankStockFlexMessages(filterModels, altText);
    await client.replyMessage(replyToken, flexMessage)
    return;
}

export function generateRankStockFlexMessages(models: RankPageViewModel[], altText: string): FlexMessage {
    const ret: FlexMessage = {
        altText,
        type: "flex",
        contents: {
            type: "carousel",
            contents: models.map(model => generateStockRankBubbleFlexMessage(model))
        },
    }
    return ret;
}

function generateStockRankBubbleFlexMessage(model: RankPageViewModel): FlexBubble {
    const ret: FlexBubble = {
        type: "bubble",
        size: "giga",
        direction: "ltr",
        body: {
            type: "box", layout: "vertical",
            contents: [{
                type: "text", text: model.headerText, weight: "bold", size: "xl", margin: "none", color: model.isOverBuy ? "#ff1414" : "#28a745"
            },
            { type: "separator", margin: "lg" },
            {
                type: "box", layout: "vertical", margin: "xl", spacing: "none",
                contents: [
                    {
                        type: "box",
                        layout: "horizontal",
                        flex: 1,
                        contents: [
                            { type: "text", text: "名次", size: "md", align: "start", flex: 1 },
                            { type: "text", text: "代號", size: "md", align: "start", flex: 2 },
                            { type: "text", text: "張數", size: "md", align: "start", flex: 2 },
                            { type: "text", text: "價格", size: "md", align: "start", flex: 2 }
                        ]
                    },
                    { type: "separator", margin: "md" },
                    {
                        type: "box", layout: "vertical", margin: "xxl", spacing: "none",
                        contents: model.rankItems.map((item, index) => generateFlexComponentRankItem(item, (index + 1) % 2 === 1, model.isOverBuy))
                    }
                ]
            }
            ]
        },
        footer: {
            type: "box", layout: "vertical", contents: [{
                type: "button",
                action: {
                    type: "uri",
                    label: "前往查看所有排行",
                    uri: getUriByPageModel(model)
                }
            }
            ]
        },
        styles: {
            footer: {
                separator: true
            }
        }
    }
    return ret;
}

function getUriByPageModel(model: RankPageViewModel): string {
    let path: string = "/rank";

    if (model.isOverBuy) {
        path += '/over-buy'
    } else {
        path += '/over-sell'
    }

    switch (model.rankType) {
        case RankType.credit:
            path += '/credit'
            break
        case RankType.foreign:
            path += '/foreign'
            break
        case RankType.hot:
            path += '/hot'
            break
        case RankType.selfEmployed:
            path += '/self-employed'
            break
    }

    return config.appBaseUrl + path;
}


function generateFlexComponentRankItem(item: RankStockItem, isOddItem: boolean, isOverBuy: boolean): FlexComponent {
    const ret: FlexComponent = {
        type: "box",
        layout: "horizontal",
        contents: [
            {
                type: "box",
                layout: "vertical",
                contents: [{ type: "text", size: "xxl", color: "#555555", text: item.rank.toString(), align: "center", flex: 1, gravity: "center" }],
                flex: 1
            },
            {
                type: "box", layout: "vertical", contents: [
                    {
                        type: "text",
                        text: item.id,
                        size: "lg",
                        color: "#111111",
                        align: "start",
                        flex: 2,
                        gravity: "top"
                    },
                    {
                        type: "text",
                        text: item.name.toUpperCase().replace(item.id, ''),
                        size: "xs",
                        color: "#666666",
                        gravity: "top",
                        maxLines: 2,
                        wrap: true
                    }
                ],
                flex: 2
            },
            {
                type: "text",
                text: commaNumber(item.overBuyAmount),
                size: "md",
                color: isOverBuy ? "#ff1414" : "#28a745",
                align: "start",
                flex: 2
            },
            {
                type: "box",
                layout: "vertical",
                contents: [
                    {
                        type: "text",
                        text: item.price.toString(),
                        size: "xl",
                        align: "start",
                        flex: 2
                    },
                    {
                        type: "text",
                        text: `${getRiseIcon(item.rise)} ${item.rise}`,
                        color: getRiseColor(item.rise)
                    }
                ],
                flex: 2
            }
        ],
        backgroundColor: isOddItem ? undefined : "#f5f5f5",
    }

    return ret;
}


function getRiseIcon(rise: number): string {

    if (rise === 0) {
        return ""
    }

    if (rise > 0) {
        return "📈";
    }

    return "📉";
}

function getRiseColor(rise: number): string {

    if (rise > 0) {
        return "#ff1414"
    }

    if (rise < 0) {
        return "#28a745"
    }

    return undefined;
}