const path = require("path");
const fs = require("fs");
const { spawn } = require("node:child_process");
/**
 * 将video目录下的所有视频文件转换为mp4格式,保存到 mp4-video目录下,全部转换完成后删除video目录下的所有视频文件
 * 使用ffmpeg命令行工具转换视频文件
 * var bat = spawn("ffmpeg", [
 *        "-i",
 *         `${videoSavePath}/${fileName}.flv`,
 *         "-c:v",
 *         "copy",
 *         "-y",
 *         `${videoSavePath}/${fileName}.mp4`,
 *         ]);
 */

const videoSavePath = path.join(__dirname, "./videosflv");
const mp4SavePath = path.join(__dirname, "./mp4-video");

// 读取 videoSavePath 目录下的所有文件，保存在数组
const files = fs.readdirSync(videoSavePath);
// console.log(files);
// 创建 mp4SavePath 目录
// fs.mkdirSync(mp4SavePath);
// 循环转换视频文件
for (let i = 0; i < files.length; i++) {
  const file = files[i];
  const fileName = file.split(".")[0];
  const fileExt = file.split(".")[1];
  // 判断文件是否为flv格式
  if (fileExt === "flv") {
    // 创建一个进程，用于转换视频文件
    console.log("开始转换格式");
    var bat = spawn("ffmpeg", [
      "-i",
      `videosflv/p1-2-1Node.js编程基础概要[ 52it.cc    ]67.0.flv`,
      "-c:v",
      "copy",
      "-y",
      `p1-2-1Node.js编程基础概要[ 52it.cc    ]67.0.mp4`,
    ]);
    console.log("\n");
    // 监听bat的结束，将原来的flv文件删除
    bat.on("exit", (code) => {
      console.log("转换完成");
    });
  }
}
