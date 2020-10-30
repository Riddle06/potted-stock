import { FlexBubble, FlexComponent, FlexMessage } from '@line/bot-sdk';
import { RankPageViewModel, RankType } from '../view-models/rank.vm';
import { RankStockItem } from './stock-fetcher';
import commaNumber from "comma-number";
import { config } from '../configuration';


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




// {
//     "type": "carousel",
//     "contents": [
//       {
//         "type": "bubble",
//         "size": "giga",
//         "direction": "ltr",
//         "body": {
//           "type": "box",
//           "layout": "vertical",
//           "contents": [
//             {
//               "type": "text",
//               "text": "10/29 外資買超排行",
//               "weight": "bold",
//               "size": "xl",
//               "margin": "none",
//               "color": "#ff1414"
//             },
//             {
//               "type": "separator",
//               "margin": "lg"
//             },
//             {
//               "type": "box",
//               "layout": "vertical",
//               "margin": "xl",
//               "spacing": "none",
//               "contents": [
//                 {
//                   "type": "box",
//                   "layout": "horizontal",
//                   "contents": [
//                     {
//                       "type": "text",
//                       "text": "名次",
//                       "size": "md",
//                       "align": "center",
//                       "flex": 1
//                     },
//                     {
//                       "type": "text",
//                       "text": "代號",
//                       "size": "md",
//                       "align": "start",
//                       "flex": 2
//                     },
//                     {
//                       "type": "text",
//                       "text": "張數",
//                       "size": "md",
//                       "align": "start",
//                       "flex": 2
//                     },
//                     {
//                       "type": "text",
//                       "text": "價格",
//                       "size": "md",
//                       "align": "start",
//                       "flex": 2
//                     }
//                   ],
//                   "paddingAll": "1%"
//                 },
//                 {
//                   "type": "separator",
//                   "margin": "xl"
//                 },
//                 {
//                   "type": "box",
//                   "layout": "vertical",
//                   "margin": "xxl",
//                   "spacing": "none",
//                   "contents": [
//                     {
//                       "type": "box",
//                       "layout": "horizontal",
//                       "contents": [
//                         {
//                           "type": "box",
//                           "layout": "vertical",
//                           "contents": [
//                             {
//                               "type": "text",
//                               "size": "xxl",
//                               "color": "#555555",
//                               "text": "1",
//                               "align": "center",
//                               "flex": 1,
//                               "gravity": "center"
//                             }
//                           ],
//                           "flex": 1
//                         },
//                         {
//                           "type": "box",
//                           "layout": "vertical",
//                           "contents": [
//                             {
//                               "type": "text",
//                               "text": "0050",
//                               "size": "lg",
//                               "color": "#111111",
//                               "align": "start",
//                               "flex": 2,
//                               "gravity": "top"
//                             },
//                             {
//                               "type": "text",
//                               "text": "元大台50",
//                               "size": "xs",
//                               "color": "#666666",
//                               "maxLines": 2
//                             }
//                           ],
//                           "flex": 2
//                         },
//                         {
//                           "type": "text",
//                           "text": "100,111",
//                           "size": "xl",
//                           "align": "start",
//                           "flex": 2
//                         },
//                         {
//                           "type": "box",
//                           "layout": "vertical",
//                           "contents": [
//                             {
//                               "type": "text",
//                               "text": "106.99",
//                               "size": "xl",
//                               "align": "start",
//                               "flex": 2
//                             },
//                             {
//                               "type": "text",
//                               "text": "📈 1.3 ",
//                               "color": "#db0000"
//                             }
//                           ],
//                           "flex": 2
//                         }
//                       ],
//                       "spacing": "none",
//                       "paddingAll": "1%"
//                     },
//                     {
//                       "type": "box",
//                       "layout": "horizontal",
//                       "contents": [
//                         {
//                           "type": "box",
//                           "layout": "vertical",
//                           "contents": [
//                             {
//                               "type": "text",
//                               "size": "xxl",
//                               "color": "#555555",
//                               "text": "2",
//                               "align": "center",
//                               "flex": 1,
//                               "gravity": "center"
//                             }
//                           ],
//                           "flex": 1
//                         },
//                         {
//                           "type": "box",
//                           "layout": "vertical",
//                           "contents": [
//                             {
//                               "type": "text",
//                               "text": "0056",
//                               "size": "lg",
//                               "color": "#111111",
//                               "align": "start",
//                               "flex": 2,
//                               "gravity": "top"
//                             },
//                             {
//                               "type": "text",
//                               "text": "元大高股息1111",
//                               "size": "xs",
//                               "color": "#666666",
//                               "gravity": "top",
//                               "maxLines": 2,
//                               "wrap": true
//                             }
//                           ],
//                           "flex": 2
//                         },
//                         {
//                           "type": "text",
//                           "text": "100,111",
//                           "size": "xl",
//                           "align": "start",
//                           "flex": 2
//                         },
//                         {
//                           "type": "box",
//                           "layout": "vertical",
//                           "contents": [
//                             {
//                               "type": "text",
//                               "text": "106.99",
//                               "size": "xl",
//                               "align": "start",
//                               "flex": 2
//                             },
//                             {
//                               "type": "text",
//                               "text": "📈 1.3 "
//                             }
//                           ],
//                           "flex": 2
//                         }
//                       ],
//                       "backgroundColor": "#f5f5f5",
//                       "paddingAll": "1%"
//                     },
//                     {
//                       "type": "box",
//                       "layout": "horizontal",
//                       "contents": [
//                         {
//                           "type": "box",
//                           "layout": "vertical",
//                           "contents": [
//                             {
//                               "type": "text",
//                               "size": "xxl",
//                               "color": "#555555",
//                               "text": "2",
//                               "align": "center",
//                               "flex": 1,
//                               "gravity": "center"
//                             }
//                           ],
//                           "flex": 1
//                         },
//                         {
//                           "type": "box",
//                           "layout": "vertical",
//                           "contents": [
//                             {
//                               "type": "text",
//                               "text": "0056",
//                               "size": "lg",
//                               "color": "#111111",
//                               "align": "start",
//                               "flex": 2,
//                               "gravity": "top"
//                             },
//                             {
//                               "type": "text",
//                               "text": "元大高股息1111",
//                               "size": "xs",
//                               "color": "#666666",
//                               "gravity": "top",
//                               "maxLines": 2,
//                               "wrap": true
//                             }
//                           ],
//                           "flex": 2
//                         },
//                         {
//                           "type": "text",
//                           "text": "100,111",
//                           "size": "xl",
//                           "align": "start",
//                           "flex": 2
//                         },
//                         {
//                           "type": "box",
//                           "layout": "vertical",
//                           "contents": [
//                             {
//                               "type": "text",
//                               "text": "106.99",
//                               "size": "xl",
//                               "align": "start",
//                               "flex": 2
//                             },
//                             {
//                               "type": "text",
//                               "text": "📈 1.3 "
//                             }
//                           ],
//                           "flex": 2
//                         }
//                       ],
//                       "backgroundColor": "#f5f5f5",
//                       "paddingAll": "1%"
//                     },
//                     {
//                       "type": "box",
//                       "layout": "horizontal",
//                       "contents": [
//                         {
//                           "type": "box",
//                           "layout": "vertical",
//                           "contents": [
//                             {
//                               "type": "text",
//                               "size": "xxl",
//                               "color": "#555555",
//                               "text": "2",
//                               "align": "center",
//                               "flex": 1,
//                               "gravity": "center"
//                             }
//                           ],
//                           "flex": 1
//                         },
//                         {
//                           "type": "box",
//                           "layout": "vertical",
//                           "contents": [
//                             {
//                               "type": "text",
//                               "text": "0056",
//                               "size": "lg",
//                               "color": "#111111",
//                               "align": "start",
//                               "flex": 2,
//                               "gravity": "top"
//                             },
//                             {
//                               "type": "text",
//                               "text": "元大高股息1111",
//                               "size": "xs",
//                               "color": "#666666",
//                               "gravity": "top",
//                               "maxLines": 2,
//                               "wrap": true
//                             }
//                           ],
//                           "flex": 2
//                         },
//                         {
//                           "type": "text",
//                           "text": "100,111",
//                           "size": "xl",
//                           "align": "start",
//                           "flex": 2
//                         },
//                         {
//                           "type": "box",
//                           "layout": "vertical",
//                           "contents": [
//                             {
//                               "type": "text",
//                               "text": "106.99",
//                               "size": "xl",
//                               "align": "start",
//                               "flex": 2
//                             },
//                             {
//                               "type": "text",
//                               "text": "📈 1.3 "
//                             }
//                           ],
//                           "flex": 2
//                         }
//                       ],
//                       "backgroundColor": "#f5f5f5",
//                       "paddingAll": "1%"
//                     },
//                     {
//                       "type": "box",
//                       "layout": "horizontal",
//                       "contents": [
//                         {
//                           "type": "box",
//                           "layout": "vertical",
//                           "contents": [
//                             {
//                               "type": "text",
//                               "size": "xxl",
//                               "color": "#555555",
//                               "text": "2",
//                               "align": "center",
//                               "flex": 1,
//                               "gravity": "center"
//                             }
//                           ],
//                           "flex": 1
//                         },
//                         {
//                           "type": "box",
//                           "layout": "vertical",
//                           "contents": [
//                             {
//                               "type": "text",
//                               "text": "0056",
//                               "size": "lg",
//                               "color": "#111111",
//                               "align": "start",
//                               "flex": 2,
//                               "gravity": "top"
//                             },
//                             {
//                               "type": "text",
//                               "text": "元大高股息1111",
//                               "size": "xs",
//                               "color": "#666666",
//                               "gravity": "top",
//                               "maxLines": 2,
//                               "wrap": true
//                             }
//                           ],
//                           "flex": 2
//                         },
//                         {
//                           "type": "text",
//                           "text": "100,111",
//                           "size": "xl",
//                           "align": "start",
//                           "flex": 2
//                         },
//                         {
//                           "type": "box",
//                           "layout": "vertical",
//                           "contents": [
//                             {
//                               "type": "text",
//                               "text": "106.99",
//                               "size": "xl",
//                               "align": "start",
//                               "flex": 2
//                             },
//                             {
//                               "type": "text",
//                               "text": "📈 1.3 "
//                             }
//                           ],
//                           "flex": 2
//                         }
//                       ],
//                       "backgroundColor": "#f5f5f5",
//                       "paddingAll": "1%"
//                     },
//                     {
//                       "type": "box",
//                       "layout": "horizontal",
//                       "contents": [
//                         {
//                           "type": "box",
//                           "layout": "vertical",
//                           "contents": [
//                             {
//                               "type": "text",
//                               "size": "xxl",
//                               "color": "#555555",
//                               "text": "2",
//                               "align": "center",
//                               "flex": 1,
//                               "gravity": "center"
//                             }
//                           ],
//                           "flex": 1
//                         },
//                         {
//                           "type": "box",
//                           "layout": "vertical",
//                           "contents": [
//                             {
//                               "type": "text",
//                               "text": "0056",
//                               "size": "lg",
//                               "color": "#111111",
//                               "align": "start",
//                               "flex": 2,
//                               "gravity": "top"
//                             },
//                             {
//                               "type": "text",
//                               "text": "元大高股息1111",
//                               "size": "xs",
//                               "color": "#666666",
//                               "gravity": "top",
//                               "maxLines": 2,
//                               "wrap": true
//                             }
//                           ],
//                           "flex": 2
//                         },
//                         {
//                           "type": "text",
//                           "text": "100,111",
//                           "size": "xl",
//                           "align": "start",
//                           "flex": 2
//                         },
//                         {
//                           "type": "box",
//                           "layout": "vertical",
//                           "contents": [
//                             {
//                               "type": "text",
//                               "text": "106.99",
//                               "size": "xl",
//                               "align": "start",
//                               "flex": 2
//                             },
//                             {
//                               "type": "text",
//                               "text": "📈 1.3 "
//                             }
//                           ],
//                           "flex": 2
//                         }
//                       ],
//                       "backgroundColor": "#f5f5f5",
//                       "paddingAll": "1%"
//                     },
//                     {
//                       "type": "box",
//                       "layout": "horizontal",
//                       "contents": [
//                         {
//                           "type": "box",
//                           "layout": "vertical",
//                           "contents": [
//                             {
//                               "type": "text",
//                               "size": "xxl",
//                               "color": "#555555",
//                               "text": "2",
//                               "align": "center",
//                               "flex": 1,
//                               "gravity": "center"
//                             }
//                           ],
//                           "flex": 1
//                         },
//                         {
//                           "type": "box",
//                           "layout": "vertical",
//                           "contents": [
//                             {
//                               "type": "text",
//                               "text": "0056",
//                               "size": "lg",
//                               "color": "#111111",
//                               "align": "start",
//                               "flex": 2,
//                               "gravity": "top"
//                             },
//                             {
//                               "type": "text",
//                               "text": "元大高股息1111",
//                               "size": "xs",
//                               "color": "#666666",
//                               "gravity": "top",
//                               "maxLines": 2,
//                               "wrap": true
//                             }
//                           ],
//                           "flex": 2
//                         },
//                         {
//                           "type": "text",
//                           "text": "100,111",
//                           "size": "xl",
//                           "align": "start",
//                           "flex": 2
//                         },
//                         {
//                           "type": "box",
//                           "layout": "vertical",
//                           "contents": [
//                             {
//                               "type": "text",
//                               "text": "106.99",
//                               "size": "xl",
//                               "align": "start",
//                               "flex": 2
//                             },
//                             {
//                               "type": "text",
//                               "text": "📈 1.3 "
//                             }
//                           ],
//                           "flex": 2
//                         }
//                       ],
//                       "backgroundColor": "#f5f5f5",
//                       "paddingAll": "1%"
//                     },
//                     {
//                       "type": "box",
//                       "layout": "horizontal",
//                       "contents": [
//                         {
//                           "type": "box",
//                           "layout": "vertical",
//                           "contents": [
//                             {
//                               "type": "text",
//                               "size": "xxl",
//                               "color": "#555555",
//                               "text": "2",
//                               "align": "center",
//                               "flex": 1,
//                               "gravity": "center"
//                             }
//                           ],
//                           "flex": 1
//                         },
//                         {
//                           "type": "box",
//                           "layout": "vertical",
//                           "contents": [
//                             {
//                               "type": "text",
//                               "text": "0056",
//                               "size": "lg",
//                               "color": "#111111",
//                               "align": "start",
//                               "flex": 2,
//                               "gravity": "top"
//                             },
//                             {
//                               "type": "text",
//                               "text": "元大高股息1111",
//                               "size": "xs",
//                               "color": "#666666",
//                               "gravity": "top",
//                               "maxLines": 2,
//                               "wrap": true
//                             }
//                           ],
//                           "flex": 2
//                         },
//                         {
//                           "type": "text",
//                           "text": "100,111",
//                           "size": "xl",
//                           "align": "start",
//                           "flex": 2
//                         },
//                         {
//                           "type": "box",
//                           "layout": "vertical",
//                           "contents": [
//                             {
//                               "type": "text",
//                               "text": "106.99",
//                               "size": "xl",
//                               "align": "start",
//                               "flex": 2
//                             },
//                             {
//                               "type": "text",
//                               "text": "📈 1.3 "
//                             }
//                           ],
//                           "flex": 2
//                         }
//                       ],
//                       "backgroundColor": "#f5f5f5",
//                       "paddingAll": "1%"
//                     },
//                     {
//                       "type": "box",
//                       "layout": "horizontal",
//                       "contents": [
//                         {
//                           "type": "box",
//                           "layout": "vertical",
//                           "contents": [
//                             {
//                               "type": "text",
//                               "size": "xxl",
//                               "color": "#555555",
//                               "text": "2",
//                               "align": "center",
//                               "flex": 1,
//                               "gravity": "center"
//                             }
//                           ],
//                           "flex": 1
//                         },
//                         {
//                           "type": "box",
//                           "layout": "vertical",
//                           "contents": [
//                             {
//                               "type": "text",
//                               "text": "0056",
//                               "size": "lg",
//                               "color": "#111111",
//                               "align": "start",
//                               "flex": 2,
//                               "gravity": "top"
//                             },
//                             {
//                               "type": "text",
//                               "text": "元大高股息1111",
//                               "size": "xs",
//                               "color": "#666666",
//                               "gravity": "top",
//                               "maxLines": 2,
//                               "wrap": true
//                             }
//                           ],
//                           "flex": 2
//                         },
//                         {
//                           "type": "text",
//                           "text": "100,111",
//                           "size": "xl",
//                           "align": "start",
//                           "flex": 2
//                         },
//                         {
//                           "type": "box",
//                           "layout": "vertical",
//                           "contents": [
//                             {
//                               "type": "text",
//                               "text": "106.99",
//                               "size": "xl",
//                               "align": "start",
//                               "flex": 2
//                             },
//                             {
//                               "type": "text",
//                               "text": "📈 1.3 "
//                             }
//                           ],
//                           "flex": 2
//                         }
//                       ],
//                       "backgroundColor": "#f5f5f5",
//                       "paddingAll": "1%"
//                     },
//                     {
//                       "type": "box",
//                       "layout": "horizontal",
//                       "contents": [
//                         {
//                           "type": "box",
//                           "layout": "vertical",
//                           "contents": [
//                             {
//                               "type": "text",
//                               "size": "xxl",
//                               "color": "#555555",
//                               "text": "2",
//                               "align": "center",
//                               "flex": 1,
//                               "gravity": "center"
//                             }
//                           ],
//                           "flex": 1
//                         },
//                         {
//                           "type": "box",
//                           "layout": "vertical",
//                           "contents": [
//                             {
//                               "type": "text",
//                               "text": "0056",
//                               "size": "lg",
//                               "color": "#111111",
//                               "align": "start",
//                               "flex": 2,
//                               "gravity": "top"
//                             },
//                             {
//                               "type": "text",
//                               "text": "元大高股息1111",
//                               "size": "xs",
//                               "color": "#666666",
//                               "gravity": "top",
//                               "maxLines": 2,
//                               "wrap": true
//                             }
//                           ],
//                           "flex": 2
//                         },
//                         {
//                           "type": "text",
//                           "text": "100,111",
//                           "size": "xl",
//                           "align": "start",
//                           "flex": 2
//                         },
//                         {
//                           "type": "box",
//                           "layout": "vertical",
//                           "contents": [
//                             {
//                               "type": "text",
//                               "text": "106.99",
//                               "size": "xl",
//                               "align": "start",
//                               "flex": 2
//                             },
//                             {
//                               "type": "text",
//                               "text": "📈 1.3 "
//                             }
//                           ],
//                           "flex": 2
//                         }
//                       ],
//                       "backgroundColor": "#f5f5f5",
//                       "paddingAll": "1%"
//                     },
//                     {
//                       "type": "box",
//                       "layout": "horizontal",
//                       "contents": [
//                         {
//                           "type": "box",
//                           "layout": "vertical",
//                           "contents": [
//                             {
//                               "type": "text",
//                               "size": "xxl",
//                               "color": "#555555",
//                               "text": "2",
//                               "align": "center",
//                               "flex": 1,
//                               "gravity": "center"
//                             }
//                           ],
//                           "flex": 1
//                         },
//                         {
//                           "type": "box",
//                           "layout": "vertical",
//                           "contents": [
//                             {
//                               "type": "text",
//                               "text": "0056",
//                               "size": "lg",
//                               "color": "#111111",
//                               "align": "start",
//                               "flex": 2,
//                               "gravity": "top"
//                             },
//                             {
//                               "type": "text",
//                               "text": "元大高股息1111",
//                               "size": "xs",
//                               "color": "#666666",
//                               "gravity": "top",
//                               "maxLines": 2,
//                               "wrap": true
//                             }
//                           ],
//                           "flex": 2
//                         },
//                         {
//                           "type": "text",
//                           "text": "100,111",
//                           "size": "xl",
//                           "align": "start",
//                           "flex": 2
//                         },
//                         {
//                           "type": "box",
//                           "layout": "vertical",
//                           "contents": [
//                             {
//                               "type": "text",
//                               "text": "106.99",
//                               "size": "xl",
//                               "align": "start",
//                               "flex": 2
//                             },
//                             {
//                               "type": "text",
//                               "text": "📈 1.3 "
//                             }
//                           ],
//                           "flex": 2
//                         }
//                       ],
//                       "backgroundColor": "#f5f5f5",
//                       "paddingAll": "1%"
//                     }
//                   ]
//                 }
//               ],
//               "flex": 0
//             }
//           ]
//         },
//         "footer": {
//           "type": "box",
//           "layout": "vertical",
//           "contents": [
//             {
//               "type": "button",
//               "action": {
//                 "type": "uri",
//                 "label": "前往查看所有排行",
//                 "uri": "http://linecorp.com/"
//               }
//             }
//           ]
//         },
//         "styles": {
//           "footer": {
//             "separator": true
//           }
//         }
//       },
//       {
//         "type": "bubble",
//         "size": "giga",
//         "direction": "ltr",
//         "body": {
//           "type": "box",
//           "layout": "vertical",
//           "contents": [
//             {
//               "type": "text",
//               "text": "10/29 外資買超排行",
//               "weight": "bold",
//               "size": "xl",
//               "margin": "none",
//               "color": "#ff1414"
//             },
//             {
//               "type": "separator",
//               "margin": "lg"
//             },
//             {
//               "type": "box",
//               "layout": "vertical",
//               "margin": "xl",
//               "spacing": "none",
//               "contents": [
//                 {
//                   "type": "box",
//                   "layout": "horizontal",
//                   "contents": [
//                     {
//                       "type": "text",
//                       "text": "名次",
//                       "size": "md",
//                       "align": "center",
//                       "flex": 1
//                     },
//                     {
//                       "type": "text",
//                       "text": "代號",
//                       "size": "md",
//                       "align": "start",
//                       "flex": 2
//                     },
//                     {
//                       "type": "text",
//                       "text": "張數",
//                       "size": "md",
//                       "align": "start",
//                       "flex": 2
//                     },
//                     {
//                       "type": "text",
//                       "text": "價格",
//                       "size": "md",
//                       "align": "start",
//                       "flex": 2
//                     }
//                   ],
//                   "paddingAll": "1%"
//                 },
//                 {
//                   "type": "separator",
//                   "margin": "xl"
//                 },
//                 {
//                   "type": "box",
//                   "layout": "vertical",
//                   "margin": "xxl",
//                   "spacing": "none",
//                   "contents": [
//                     {
//                       "type": "box",
//                       "layout": "horizontal",
//                       "contents": [
//                         {
//                           "type": "box",
//                           "layout": "vertical",
//                           "contents": [
//                             {
//                               "type": "text",
//                               "size": "xxl",
//                               "color": "#555555",
//                               "text": "1",
//                               "align": "center",
//                               "flex": 1,
//                               "gravity": "center"
//                             }
//                           ],
//                           "flex": 1
//                         },
//                         {
//                           "type": "box",
//                           "layout": "vertical",
//                           "contents": [
//                             {
//                               "type": "text",
//                               "text": "0050",
//                               "size": "lg",
//                               "color": "#111111",
//                               "align": "start",
//                               "flex": 2,
//                               "gravity": "top"
//                             },
//                             {
//                               "type": "text",
//                               "text": "元大台50",
//                               "size": "xs",
//                               "color": "#666666",
//                               "maxLines": 2
//                             }
//                           ],
//                           "flex": 2
//                         },
//                         {
//                           "type": "text",
//                           "text": "100,111",
//                           "size": "xl",
//                           "align": "start",
//                           "flex": 2
//                         },
//                         {
//                           "type": "box",
//                           "layout": "vertical",
//                           "contents": [
//                             {
//                               "type": "text",
//                               "text": "106.99",
//                               "size": "xl",
//                               "align": "start",
//                               "flex": 2
//                             },
//                             {
//                               "type": "text",
//                               "text": "📈 1.3 ",
//                               "color": "#db0000"
//                             }
//                           ],
//                           "flex": 2
//                         }
//                       ],
//                       "spacing": "none",
//                       "paddingAll": "1%"
//                     },
//                     {
//                       "type": "box",
//                       "layout": "horizontal",
//                       "contents": [
//                         {
//                           "type": "box",
//                           "layout": "vertical",
//                           "contents": [
//                             {
//                               "type": "text",
//                               "size": "xxl",
//                               "color": "#555555",
//                               "text": "2",
//                               "align": "center",
//                               "flex": 1,
//                               "gravity": "center"
//                             }
//                           ],
//                           "flex": 1
//                         },
//                         {
//                           "type": "box",
//                           "layout": "vertical",
//                           "contents": [
//                             {
//                               "type": "text",
//                               "text": "0056",
//                               "size": "lg",
//                               "color": "#111111",
//                               "align": "start",
//                               "flex": 2,
//                               "gravity": "top"
//                             },
//                             {
//                               "type": "text",
//                               "text": "元大高股息1111",
//                               "size": "xs",
//                               "color": "#666666",
//                               "gravity": "top",
//                               "maxLines": 2,
//                               "wrap": true
//                             }
//                           ],
//                           "flex": 2
//                         },
//                         {
//                           "type": "text",
//                           "text": "100,111",
//                           "size": "xl",
//                           "align": "start",
//                           "flex": 2
//                         },
//                         {
//                           "type": "box",
//                           "layout": "vertical",
//                           "contents": [
//                             {
//                               "type": "text",
//                               "text": "106.99",
//                               "size": "xl",
//                               "align": "start",
//                               "flex": 2
//                             },
//                             {
//                               "type": "text",
//                               "text": "📈 1.3 "
//                             }
//                           ],
//                           "flex": 2
//                         }
//                       ],
//                       "backgroundColor": "#f5f5f5",
//                       "paddingAll": "1%"
//                     }
//                   ]
//                 }
//               ],
//               "flex": 0
//             }
//           ]
//         },
//         "footer": {
//           "type": "box",
//           "layout": "vertical",
//           "contents": [
//             {
//               "type": "button",
//               "action": {
//                 "type": "uri",
//                 "label": "前往查看所有排行",
//                 "uri": "http://linecorp.com/"
//               }
//             }
//           ]
//         },
//         "styles": {
//           "footer": {
//             "separator": true
//           }
//         }
//       }
//     ]
//   }