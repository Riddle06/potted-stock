import { RankStockItem } from "stock-fetcher";
import * as luxon from "luxon";

export enum RankType {
    foreign = "foreign",
    credit = "credit",
    selfEmployed = "selfEmployed",
    hot = "hot"
}

export interface RankItemViewModel extends RankStockItem {
    riseStyle: "text-danger" | "text-success" | ""
}

export class RankPageViewModel {
    public headerText: string
    public rankItems: RankItemViewModel[]
    public headerTextStyle: string
    constructor(param: RankPageViewModelInitParameter) {
        this.rankItems = param.rankStockItems.slice(0, 10).map(item => {

            let riseStyle: "text-danger" | "text-success" | "" = ""
            if (item.rise > 0) {
                riseStyle = "text-danger";
            } else {
                riseStyle = "text-success";
            }
            const result: RankItemViewModel = {
                ...item,
                riseStyle
            }

            return result
        })
        this.headerText = this.getHeaderText(param.isOverBuy, param.dateQuery, param.rankType);

        if (param.isOverBuy) {
            this.headerTextStyle = "text-danger";
        } else { 
            this.headerTextStyle = "text-success";
        }
    }

    private getHeaderText(isOverBuy: boolean, dateQuery: Date, rankType: RankType): string {
        let rankTypeText: string = '';
        switch (rankType) {
            case RankType.credit:
                rankTypeText = "投信";
                break;
            case RankType.foreign:
                rankTypeText = "外資";
                break;
            case RankType.selfEmployed:
                rankTypeText = "自營商";
                break;
            case RankType.hot:
                rankTypeText = "主力";
                break;
        }

        let isOverBuyText = "買超";

        if (!isOverBuy) {
            isOverBuyText = "賣超";
        }
        const formatDateText = luxon.DateTime.fromJSDate(dateQuery).toFormat("MM/dd");
        return `${formatDateText} ${rankTypeText}${isOverBuyText}排行`;
    }



}

export interface RankPageViewModelInitParameter {
    rankStockItems: RankStockItem[]
    rankType: RankType
    isOverBuy: boolean
    dateQuery: Date
}