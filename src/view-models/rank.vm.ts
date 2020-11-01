import { OverBuyRankStockItem } from "../services/stock-fetcher";
import * as luxon from "luxon";
import { typeChecker } from 'camel-toolbox';

export enum RankType {
    foreign = "foreign",
    credit = "credit",
    selfEmployed = "selfEmployed",
    hot = "hot"
}

export interface RankItemViewModel extends OverBuyRankStockItem {
    riseStyle: "text-danger" | "text-success" | ""
}

export class RankPageViewModel {
    public headerText: string
    public rankItems: RankItemViewModel[]
    public headerTextStyle: string
    public rankType: RankType;
    public dateQuery: Date
    public isOverBuy: boolean
    constructor(param: RankPageViewModelInitParameter) {
        this.rankItems = param.rankStockItems.slice(0, typeChecker.isNullOrUndefinedObject(param.size) ? param.rankStockItems.length : param.size).map(item => {

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
        this.rankType = param.rankType;
        this.headerText = this.getHeaderText(param.isOverBuy, param.dateQuery, param.rankType);
        this.dateQuery = param.dateQuery;
        this.isOverBuy = param.isOverBuy

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
    rankStockItems: OverBuyRankStockItem[]
    rankType: RankType
    isOverBuy: boolean
    dateQuery: Date
    size?: number
}