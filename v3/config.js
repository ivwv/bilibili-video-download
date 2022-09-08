module.exports = {
  // 视频 BVID 号

  bvid: "BV1zq4y1p7ga",
  // 下载的视频从哪一集开始，默认为 1
  videoPFrom: 1,
  // 下载的视频到哪一集结束，如果视频只有一集，那就跟开始一样都为 1
  videoPTo: 5,
  // 下载视频保存目录 需要自己创建
  videoSavePath: "./videos",
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
    "sec-fetch-site": "same-origin",
    "sec-fetch-user": "?1",
    "upgrade-insecure-requests": "1",
    cookie:
      "i-wanna-go-back=-1;  blackside_state=0; buvid_fp_plain=undefined;  b_ut=5; CURRENT_BLACKGAP=0; nostalgia_conf=-1; hit-dyn-v2=1; CURRENT_QUALITY=80; b_nut=100;  sid=56iic41l; PVID=1; innersign=1; theme_style=light;  CURRENT_FNVAL=4048",
    Referer: "https://www.bilibili.com/",
    "Referrer-Policy": "no-referrer-when-downgrade",
  },
};
