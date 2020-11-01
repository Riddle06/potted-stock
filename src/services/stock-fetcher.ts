import * as request from "request";
import * as iconvLite from "iconv-lite";
import $ from "cheerio";
import * as luxon from "luxon";
import { RankPageViewModel, RankType } from "../view-models/rank.vm";
import { typeChecker } from 'camel-toolbox';

const stockRegex = /^[0-9a-z]+/g;

type SourceUrls = Readonly<{
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
    /**
     * 漲幅排行
     */
    rise: string
    /**
     * 跌幅排行
     */
    fall: string
}>


export const sourceUrls: SourceUrls = {
    foreign: "https://fubon-ebrokerdj.fbs.com.tw/z/zg/zgk.djhtm?A=D&B=0&C=1",
    credit: "https://fubon-ebrokerdj.fbs.com.tw/z/zg/zgk.djhtm?A=DD&B=0&C=1",
    selfEmployed: "https://fubon-ebrokerdj.fbs.com.tw/z/zg/zgk.djhtm?A=DB&B=0&C=1",
    hot: "https://fubon-ebrokerdj.fbs.com.tw/z/zg/zgk.djhtm?A=F&B=0&C=1",
    rise: "https://fubon-ebrokerdj.fbs.com.tw/z/zg/zg_A_0_1.djhtm",
    fall: "https://fubon-ebrokerdj.fbs.com.tw/Z/ZG/ZG_AA.djhtm"

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

export async function parseOverBuyRankStockHtml({ html }: { html: string }): Promise<BuyAndSellRankItemResult> {

    const $trList = $('tr', html)
    const riseItems: OverBuyRankStockItem[] = [];
    const fallItems: OverBuyRankStockItem[] = [];
    $trList.each((index, ele) => {
        const tdElements = $(ele).find('td');

        if (!isValidOverBuyStockItem(tdElements)) {
            return true;
        }
        if (typeChecker.isNullOrUndefinedOrWhiteSpace($(tdElements[1]).text())) {
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

export function parseRiseAndFallRankHtml({ html }: { html: string }): RiseAndFallRankStockItem[] {
    const $trMenu = $("#oscrollmenu", html)

    const $trStockItems = $trMenu.nextAll();

    const items: RiseAndFallRankStockItem[] = [];
    $trStockItems.each((index, element) => {
        const tdElements = $(element).find('td');
        
        const id = $(tdElements[1]).text().trim().match(stockRegex)[0].toUpperCase();
        items.push({
            rank: paseStringToNumber($(tdElements[0]).text()),
            name: $(tdElements[1]).text().trim().replace(id, '').trim().toUpperCase(),
            dealCount: paseStringToNumber($(tdElements[5]).text()),
            price: paseStringToNumber($(tdElements[2]).text()),
            rise: paseStringToNumber($(tdElements[3]).text()),
            id,
            riseRate: paseStringToNumber($(tdElements[4]).text()) / 100,
        })
    })
    return items;
}

function isValidOverBuyStockItem(tdElements: cheerio.Cheerio): boolean {
    return tdElements.length === 10 && !isNaN(+tdElements.eq(0).text())
}

function paseStringToNumber(text: string): number {
    return +text.replace(/,/g, '').replace(/%/g, '').replace(/\+/g, '').replace(/-/g, '')
}

export async function getAllRankPageViewModels(size?: number): Promise<RankPageViewModel[]> {

    console.time(`getBig5Content`)
    const [foreignHtml, creditHtml, hotHtml, selfEmployedHtml] = await Promise.all([
        getBig5Content({ url: sourceUrls.foreign }),
        getBig5Content({ url: sourceUrls.credit }),
        getBig5Content({ url: sourceUrls.hot }),
        getBig5Content({ url: sourceUrls.selfEmployed })
    ])
    console.timeEnd(`getBig5Content`)


    console.time(`parseRankStockHtml`)
    const { riseItems: foreignRiseItems, fallItems: foreignFallItems, dateQuery } = await parseOverBuyRankStockHtml({ html: foreignHtml });
    const { riseItems: creditRiseItems, fallItems: creditFallItems } = await parseOverBuyRankStockHtml({ html: creditHtml });
    const { riseItems: hotRiseItems, fallItems: hotFallItems } = await parseOverBuyRankStockHtml({ html: hotHtml });
    const { riseItems: selfEmployedRiseItems, fallItems: selfEmployedFallItems } = await parseOverBuyRankStockHtml({ html: selfEmployedHtml });
    console.timeEnd(`parseRankStockHtml`)

    const pageModels: RankPageViewModel[] = [
        new RankPageViewModel({ dateQuery, isOverBuy: true, rankStockItems: foreignRiseItems, rankType: RankType.foreign, size }),
        new RankPageViewModel({ dateQuery, isOverBuy: true, rankStockItems: creditRiseItems, rankType: RankType.credit, size }),
        new RankPageViewModel({ dateQuery, isOverBuy: true, rankStockItems: hotRiseItems, rankType: RankType.hot, size }),
        new RankPageViewModel({ dateQuery, isOverBuy: true, rankStockItems: selfEmployedRiseItems, rankType: RankType.selfEmployed, size }),
        new RankPageViewModel({ dateQuery, isOverBuy: false, rankStockItems: foreignFallItems, rankType: RankType.foreign, size }),
        new RankPageViewModel({ dateQuery, isOverBuy: false, rankStockItems: creditFallItems, rankType: RankType.credit, size }),
        new RankPageViewModel({ dateQuery, isOverBuy: false, rankStockItems: hotFallItems, rankType: RankType.hot, size }),
        new RankPageViewModel({ dateQuery, isOverBuy: false, rankStockItems: selfEmployedFallItems, rankType: RankType.selfEmployed, size }),
    ]
    return pageModels
}

export interface OverBuyRankStockItem {
    rank: number
    name: string
    price: number
    rise: number
    overBuyAmount: number
    id: string
}

export interface RiseAndFallRankStockItem {
    id: string
    rank: number
    name: string
    price: number
    rise: number
    riseRate: number
    /**
     * 成交量
     */
    dealCount: number
}

export interface BuyAndSellRankItemResult {
    dateQuery: Date
    riseItems: OverBuyRankStockItem[]
    fallItems: OverBuyRankStockItem[]
}