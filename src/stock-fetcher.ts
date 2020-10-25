import * as request from "request";
import * as iconvLite from "iconv-lite";
import $ from "cheerio";
import * as luxon from "luxon";


export const sourceUrls: Readonly<{
    /**
     * 外資
     */
    foreign: string
    /**
     * 投信
     */
    credit: string
    /**
     * 自營商
     */
    selfEmployed: string
    /**
     * 主力
     */
    hot: string
}> = {
    foreign: "https://fubon-ebrokerdj.fbs.com.tw/z/zg/zgk.djhtm?A=D&B=0&C=1",
    credit: "https://fubon-ebrokerdj.fbs.com.tw/z/zg/zgk.djhtm?A=DD&B=0&C=1",
    selfEmployed: "https://fubon-ebrokerdj.fbs.com.tw/z/zg/zgk.djhtm?A=DB&B=0&C=1",
    hot: "https://fubon-ebrokerdj.fbs.com.tw/z/zg/zgk.djhtm?A=F&B=0&C=1"
}

export function getBig5Content({ url }: { url: string }): Promise<string> {

    return new Promise<string>((resolve, reject) => {
        request.get({
            url,
            encoding: null
        }, (error, response) => {

            if (error) {
                reject(error);
                return;
            }

            const decodeString = iconvLite.decode(response.body, 'BIG5');
            const html = decodeString.toLowerCase();
            resolve(html);
            return;
        })
    })
}

export async function parseRankStockHtml({ html }: { html: string }): Promise<BuyAndSellRankItemResult> {
    const stockRegex = /^[0-9a-z]+/g;
    const $trList = $('tr', html)
    const riseItems: RankStockItem[] = [];
    const fallItems: RankStockItem[] = [];
    $trList.each((index, ele) => {
        const tdElements = $(ele).find('td');

        if (!isStockItem(tdElements)) {
            return true;
        }

        riseItems.push({
            rank: +$(tdElements[0]).text(),
            name: $(tdElements[1]).text(),
            overBuyAmount: +($(tdElements[2]).text().replace(/,/g, '')),
            price: +$(tdElements[3]).text(),
            rise: +($(tdElements[4]).text().replace(/,/g, '')),
            id: $(tdElements[1]).text().match(stockRegex)[0].toUpperCase()
        })

        fallItems.push({
            rank: +$(tdElements[5]).text(),
            name: $(tdElements[6]).text(),
            overBuyAmount: +($(tdElements[7]).text().replace(/,/g, '')),
            price: +$(tdElements[8]).text(),
            rise: +($(tdElements[9]).text().replace(/,/g, '')),
            id: $(tdElements[6]).text().match(stockRegex)[0].toUpperCase()
        })

    });

    const eleDataDate = $(html).find('.t11');

    let dateQuery = luxon.DateTime.local().toJSDate()

    if (eleDataDate.length) {
        dateQuery = luxon.DateTime.fromFormat(eleDataDate.text().replace(/日期：/g, ''), "MM/dd").toJSDate()
    }
    

    return {
        riseItems,
        fallItems,
        dateQuery
    }
}

function isStockItem(tdElements: cheerio.Cheerio): boolean {
    return tdElements.length === 10 && !isNaN(+tdElements.eq(0).text())
}


export interface RankStockItem {
    rank: number
    name: string
    price: number
    rise: number
    overBuyAmount: number
    id: string
}

export interface BuyAndSellRankItemResult {
    dateQuery: Date
    riseItems: RankStockItem[]
    fallItems: RankStockItem[]
}