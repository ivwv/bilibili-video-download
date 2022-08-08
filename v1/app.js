/**
 * 下载b站视频，视频是多P的，所以需要循环
 */
var axios = require("axios");
const fs = require("fs");
const path = require("path");
var qs = require("qs");
// 导入终端进度条
const ProgressBar = require("progress");
// 下载视频，只需要传入bvid即可
let bvid = "BV1QA411b7TR";
// 要下载的集数，如果是多P，那么就是多个集数
// 默认只下载一集
const videoPFrom = 1;
const videoPTo = 7;
// 视频集数命名
let p = 1;

let cidArr = [];
let videoUrlArr = [];
// const videoPFrom = 342;
// const videoPTo = 342;
// 定义一个集数 变量 初始值为1

// const file = path.join(__dirname, "./video/" + Math.random() * 100 + ".flv");

// 返回一个promise
const getCidArr = (bvid) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`http://api.bilibili.com/x/player/pagelist?bvid=${bvid}`)
      .then((res) => {
        // console.log("getCidArr");
        let data = res.data.data;

        resolve(data);
      })
      .catch((err) => {
        console.log("getCidArr");
        reject(err);
      });
  });
};
getCidArr(bvid)
  .then((res) => {
    // for (let i = 0; i < res.length - 42; i++) {
    for (let i = videoPFrom - 1; i < videoPTo; i++) {
      // 判断videoFrom是否大于videoTo
      if (videoPFrom > videoPTo) {
        console.log("videoFrom大于videoTo");
        return;
      }
      cidArr.push({
        cid: res[i].cid,
        part: `p${p}-${res[i].part}`,
      });
      p++;
      // 判断videoTo是否超出范围 就结束循环
      if (i >= res.length) {
        break;
      }
    }
    console.log(cidArr);
    return new Promise((resolve, reject) => {
      // console.log(cidArr);
      resolve(cidArr);
    });
  })
  .then((data) => {
    // console.log(data);
    // 将cidArr中的cid拼接成url
    for (let i = 0; i < data.length; i++) {
      let cid = data[i].cid;

      var url = `https://api.bilibili.com/x/player/playurl?bvid=${bvid}&cid=${cidArr[i].cid}&qn=80&fnval=0&fnver=0&fourk=1`;

      // console.log(url);
      var config = {
        method: "get",
        url: url,
        headers: {
          accept: "*/*",
          "accept-language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
          "sec-ch-ua":
            '"Google Chrome";v="105", ")Not;A=Brand";v="8", "Chromium";v="105"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-site",
          Referer: "https://www.bilibili.com/",
          "Referrer-Policy": "no-referrer-when-downgrade",
        },
      };

      axios(config)
        .then((res) => {
          var durl = res.data.data.durl[0].url;
          console.log("get durl");
          // let data = res[i].data.durl.url;
          // console.log(res.data.data.durl);
          // console.log(res.data.data.durl[0].url);
          videoUrlArr.push(durl);
        })
        .catch((err) => {
          console.log("get durl");
          console.log(err);
        });
    }
  })
  .catch((err) => {
    console.log(err);
  });
setTimeout(() => {
  console.log(videoUrlArr);
  // 下载视频，需要当上一个视频下载完毕，才能下载下一个视频
  for (let i = 0; i < videoUrlArr.length; i++) {
    let videoUrl = videoUrlArr[i];
    // let videoName = `${bvid}-${i + 1}.mp4`;
    download(videoUrl, i);
  }
}, 1000);
const download = (url, index) => {
  axios({
    method: "get",
    url: url,
    // 由于b站视频链接源是动态的，为了防止发生出现403错误
    // 所以一定需要动态设置请求头
    // headers: {
    //   accept:
    //     "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    //   "accept-language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
    //   "sec-ch-ua":
    //     '"Google Chrome";v="105", ")Not;A=Brand";v="8", "Chromium";v="105"',
    //   "sec-ch-ua-mobile": "?0",
    //   "sec-ch-ua-platform": '"Windows"',
    //   "sec-fetch-dest": "document",
    //   "sec-fetch-mode": "navigate",
    //   "sec-fetch-site": "none",
    //   "sec-fetch-user": "?1",
    //   "upgrade-insecure-requests": "1",
    // },
    headers: {
      accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
      "accept-language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
      "sec-ch-ua":
        '"Google Chrome";v="105", ")Not;A=Brand";v="8", "Chromium";v="105"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
      "sec-fetch-dest": "document",
      "sec-fetch-mode": "navigate",
      "sec-fetch-site": "none",
      "sec-fetch-user": "?1",
      "upgrade-insecure-requests": "1",
      Referer: "https://www.bilibili.com/",
      "Referrer-Policy": "strict-origin-when-cross-origin",
    },
    responseType: "stream",
  })
    .then((res) => {
      var len = parseInt(res.headers["content-length"], 10);

      console.log();
      var bar = new ProgressBar(
        `  downloading ${cidArr[index].part} [:bar] :rate/bps :percent :etas`,
        {
          complete: "=",
          incomplete: " ",
          width: 20,
          total: len,
        }
      );
      var fileName = cidArr[index].part;
      var file = path.join(
        __dirname,
        `./video/${fileName}${(Math.random() * 100).toFixed(1)}.flv`
      );

      res.data.pipe(fs.createWriteStream(file));
      // 显示进度条
      res.data.on("data", (chunk) => {
        bar.tick(chunk.length);
      });
      res.data.on("end", function () {
        console.log("\n");
      });
    })
    .catch((err) => {
      console.log("downloading");
      console.log(err);
    });
};
// var config = {
//   method: "get",
//   url: "http://api.bilibili.com/x/player/playurl?bvid=BV1ap4y1q7JV&cid=221283786&qn=80&fnval=0&fnver=0&fourk=1",
//   headers: {},
// };

// axios(config)
//   .then(function (response) {
//     console.log(response);
//   })
//   .catch(function (error) {
//     console.log(error);
//   });
// https://upos-hz-mirrorakam.akamaized.net/upgcxcode/44/57/220905744/220905744_nb2-1-64.flv?e=ig8euxZM2rNcNbRVhwdVhwdlhWdVhwdVhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1657190926&gen=playurlv2&os=akam&oi=2450763295&trid=13f8d78440b147098f877832266e3c9au&mid=0&platform=pc&upsig=40e6bc36367e1d8281179d6a0a9c8eb9&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform&hdnts=exp=1657190926~hmac=3a477c546ec685252947fdc53c36e48e4820bb91ce204a76ef86e5403f94a73a&bvc=vod&nettype=0&orderid=0,1&agrr=1&bw=41203&logo=80000000
// https://upos-sz-mirrorcos.bilivideo.com/upgcxcode/44/57/220905744/220905744_nb2-1-64.flv?e=ig8euxZM2rNcNbRVhwdVhwdlhWdVhwdVhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1657191010&gen=playurlv2&os=cosbv&oi=1879386891&trid=cc32d921b096461fbf98b6313e24bca7u&mid=0&platform=pc&upsig=bb40da8bfd2f31c85a62c7fe879c5fc9&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform&bvc=vod&nettype=0&orderid=0,3&agrr=1&bw=41203&logo=80000000

// var url = videoUrlArr[0];
//   axios({
//     method: "get",
//     url: url,
//     headers: {
//       accept:
//         "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
//         "accept-language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",

//         "sec-ch-ua":
//           '"Google Chrome";v="105", ")Not;A=Brand";v="8", "Chromium";v="105"',
//         "sec-ch-ua-mobile": "?0",
//         "sec-ch-ua-platform": '"Windows"',
//         "sec-fetch-dest": "document",
//         "sec-fetch-mode": "navigate",
//         "sec-fetch-site": "none",
//         "sec-fetch-user": "?1",
//         "upgrade-insecure-requests": "1",
//         Referer: "https://www.bilibili.com/",
//         "Referrer-Policy": "strict-origin-when-cross-origin",
//       },
//       responseType: "stream",
//     })
//       .then((result) => {
//         var fileSize = result.headers["content-length"];
//         var alreadyDownloaded = 0;
//         result.data.pipe(fs.createWriteStream(file));
//         result.data.on("data", (chunk) => {
//           alreadyDownloaded += chunk.length;
//           console.log(`已下载：${(alreadyDownloaded / fileSize) * 100}%`);
//         });
//         result.data.on("end", () => {
//           console.log("下载完成");
//         });
//       })
//       .catch((err) => {
//         console.log(err);
//       });
