const axios = require("axios");
const fs = require("fs");
const path = require("path");
const ProgressBar = require("progress");

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
    if (fs.existsSync(this.obj.aria2cFileName)) {
      fs.unlinkSync(this.obj.aria2cFileName);
    }
    this.downloadVideo();
  }
  /**
   * 获取视频 cid
   * 返回 cid 数组
   * @returns {Promise<void>}
   */
  async getCid() {
    const url = `http://api.bilibili.com/x/player/pagelist?bvid=${this.bvid}`;
    const { data: res } = await axios.get(url, { headers: this.headers });
    return res.data;
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
    this.cidArr = cidData.slice(this.videoPFrom - 1, this.videoPTo).map((data, i) => ({
      cid: data.cid,
      part: `${this.checkFileName(`${this.p}-${data.part}`)}.flv`,
    }));
    this.p += this.cidArr.length;
  }
  /**
   * 定义一个用于替换和检查文件名是否和合法的方法，如果合法则返回文件名，否则替换不合法的字符串为 ""
   * @param {String} fileName 文件名
   */
  checkFileName(fileName) {
    const reg = /[\\\/\:\*\?\"\<\>\|]/g;
    return fileName.replace(reg, "");
  }
  /**
   * 获取下载视频地址
   * 将 getCidArr 返回的 cidArr 数组中的 cid  拼接成视频地址
   * 返回视频下载地址
   */
  async getVideoUrl() {
    await this.getCidArr();
    this.videoUrlArr = this.cidArr.map(
      (data) =>
        `http://api.bilibili.com/x/player/playurl?bvid=${this.bvid}&cid=${data.cid}&qn=80&fnval=0&fnver=0&fourk=0`
    );
  }
  /**
   * 获取视频下载地址
   * axios 异步请求 videoUrlArr 数组中的地址
   * 提取出来下载地址
   */
  async getDownloadUrl() {
    await this.getVideoUrl();
    const promises = this.videoUrlArr.map(async (url) => {
      const { data: res } = await axios.get(url, { headers: this.headers });
      return res.data.durl[0].url;
    });
    this.downloadUrl = await Promise.all(promises);
  }

  async download(i) {
    const res = await axios.get(this.downloadUrl[i], {
      headers: this.headers,
      responseType: "stream",
    });
    const len = parseInt(res.headers["content-length"], 10);
    const bar = new ProgressBar(
      `  downloading ${this.cidArr[i].part} [:bar] :rate/bps :percent :etas`,
      {
        complete: "=",
        incomplete: " ",
        width: 20,
        total: len,
      }
    );
    const fileName = this.cidArr[i].part;
    const file = path.join(__dirname, `${this.videoSavePath}/${fileName}`);
    const writer = fs.createWriteStream(file);
    res.data.on("data", function (chunk) {
      writer.write(chunk);
      bar.tick(chunk.length);
    });
    res.data.on("end", function () {
      console.log("\n");
    });
  }
  /**
   * 下载视频
   */
  async downloadVideo() {
    await this.getDownloadUrl();
    const promises = this.downloadUrl.map(async (_, i) => {
      await this.writeToText(this.downloadUrl[i], this.cidArr[i].part);
      // await this.download(i);
    });
    await Promise.all(promises);
  }

  async sleep(time) {
    return new Promise((resolve) => {
      setTimeout(resolve, time);
    });
  }

  async writeToText(url, filename) {
    fs.writeFileSync(
      this.obj.aria2cFileName,
      `${url}
       referer=https://www.bilibili.com/video/${this.bvid}
       user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36
       out=${filename}\r\n`,
      { flag: "a" }
    );
  }
}

module.exports = BUtils;
