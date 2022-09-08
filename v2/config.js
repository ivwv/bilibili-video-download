module.exports = {
  // 视频 BVID 号

  bvid: "BV1Ee4y1C7jt",
  // 下载的视频从哪一集开始，默认为 1
  // 16-17  26 39 73 100 103 107
  videoPFrom: 1,
  // 下载的视频到哪一集结束，如果视频只有一集，那就跟开始一样都为 1
  videoPTo: 123,
  // 下载视频保存目录 需要自己创建
  videoSavePath: "./video",
  // b站用户请求头
  headers: {
    accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    "accept-language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
    "cache-control": "no-cache",
    pragma: "no-cache",
    "sec-ch-ua":
      '"Chromium";v="106", "Google Chrome";v="106", "Not;A=Brand";v="99"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Windows"',
    "sec-fetch-dest": "document",
    "sec-fetch-mode": "navigate",
    "sec-fetch-site": "none",
    "sec-fetch-user": "?1",
    "upgrade-insecure-requests": "1",
    Referer: "https://www.bilibili.com/BV1Ee4y1C7jt",
    "Referrer-Policy": "strict-origin-when-cross-origin",
  },
};
