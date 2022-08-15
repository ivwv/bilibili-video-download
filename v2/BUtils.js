const axios = require("axios");
const fs = require("fs");
const path = require("path");
const qs = require("qs");
const { spawn } = require("node:child_process");
// 导入终端进度条
const ProgressBar = require("progress");

// console.log(config);
class BUtils {
  constructor(obj) {
    this.obj = obj;
    this.cidArr = [];
    this.videoUrlArr = [];
    this.downloadUrl = [];
    this.bvid = obj.bvid;
    this.videoPFrom = obj.videoPFrom;
    this.videoPTo = obj.videoPTo;
    this.videoSavePath = obj.videoSavePath;
    this.headers = obj.headers;
    this.p = this.videoPFrom;
    this.init();
  }
  init() {
    this.downloadVideo();
  }
  /**
   * 获取视频 cid
   * 返回 cid 数组
   * @returns {Promise<void>}
   */
  async getCid() {
    const url = `http://api.bilibili.com/x/player/pagelist?bvid=${this.bvid}`;
    try {
      const { data: res } = await axios.get(url, { headers: this.headers });
      return res.data;
    } catch (error) {
      return error;
    }
  }

  /**
   * 将getCid 返回的数据
   * 根据用户传进来的 videoPFrom 和 videoPTo 提取出视频 cid 和part
   * cid 为getCid 返回的数据的 cid 字段
   * part 为getCid 返回的数据的 part 字段，需要拼接为 `p${this.videoPFrom}-${getCid 返回的数据的第 i 个 part 字段}`
   * 将提取出来的 cid 和 part 放入 cidArr 数组 并返回
   */
  async getCidArr() {
    const cidData = await this.getCid();
    for (let i = this.videoPFrom - 1; i < this.videoPTo; i++) {
      const cid = cidData[i].cid;
      const part = `${this.p}-${cidData[i].part}`;
      this.cidArr.push({ cid, part });
      this.p++;
    }
  }

  /**
   * 获取下载视频地址
   * 将 getCidArr 返回的 cidArr 数组中的 cid  拼接成视频地址
   * 返回视频下载地址
   */
  async getVideoUrl() {
    await this.getCidArr();
    for (let i = 0; i < this.cidArr.length; i++) {
      const url = `http://api.bilibili.com/x/player/playurl?bvid=${this.bvid}&cid=${this.cidArr[i].cid}&qn=80&fnval=0&fnver=0&fourk=0`;
      this.videoUrlArr.push(url);
    }
  }

  /**
   * 获取视频下载地址
   * axios 异步请求 videoUrlArr 数组中的地址
   * 提取出来下载地址
   */
  async getDownloadUrl() {
    await this.getVideoUrl();
    for (let i = 0; i < this.videoUrlArr.length; i++) {
      const { data: res } = await axios.get(this.videoUrlArr[i], {
        headers: this.headers,
      });
      this.downloadUrl.push(res.data.durl[0].url);
    }
  }
  // 打印一下视频下载地址
  // async printDownloadUrl() {
  //   await this.getDownloadUrl();
  //   console.log(this.downloadUrl);
  // }
  /**
   * 下载视频
   */
  async downloadVideo() {
    await this.getDownloadUrl();
    for (let i = 0; i < this.downloadUrl.length; i++) {
      try {
        const { data: res } = await axios.get(this.downloadUrl[i], {
          headers: this.headers,
          responseType: "stream",
        });
        var len = parseInt(res.headers["content-length"], 10);
        var bar = new ProgressBar(
          `  downloading ${this.cidArr[i].part} [:bar] :rate/bps :percent :etas`,
          {
            complete: "=",
            incomplete: " ",
            width: 20,
            total: len,
          }
        );
        var fileName = this.cidArr[i].part;
        var file = path.join(
          __dirname,
          `${this.videoSavePath}/${fileName}${(Math.random() * 100).toFixed(
            1
          )}.flv`
        );
        res.pipe(fs.createWriteStream(file));
        res.on("data", function (chunk) {
          bar.tick(chunk.length);
        });
        res.on("end", function () {
          console.log("\n");
        });
      } catch (error) {
        // return error;
        console.log(error);
      }
    }
  }

  // getInfo() {
  //   console.log(this.obj);
  // }

  //
}

// 导出类
module.exports = BUtils;
