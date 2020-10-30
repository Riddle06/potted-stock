![](https://stonk.fund/assets/img/og-image.png)

平常在 FB follow 的 `中華財經台` 因節目關台的關係，隨即連粉絲專頁也一併關閉。
之前粉絲頁會PO的一些財經相關資訊，能讓人快速了解一天的股價盤勢。裡面讓我覺得最實用的是法人買賣超的股價排行，既然現在沒有這種功能，乾脆就用 Line chatbot 做一個種花裁金台吧！

# How to make your own app

## Requirement
- node.js

## Installation
- Open terminal then key in:

```bash
git clone git@github.com:Riddle06/potted-stock.git

cd potted-stock

npm ci
```
- Edit `.env` file
    - port
    - line channel information
    - host information


## How To Start
```bash
npm run build && npm start
```

------ 

## Features

- 爬蟲買賣超排行
- 交易日的下午(17:30)會推播買賣超排行資訊

## Demo 

![](https://i.imgur.com/pEuVRFv.jpg=300x)
![](https://i.imgur.com/uFKsME6.jpg=300x)


##  How To Use

- 種花裁金 QR Code

![](https://imgur.com/dHyrjED.png)

<a href="https://lin.ee/iH0OfcO"><img src="https://scdn.line-apps.com/n/line_add_friends/btn/zh-Hant.png" alt="加入好友" height="36"></a>



## Reference
- [富邦證券](https://fubon-ebrokerdj.fbs.com.tw)