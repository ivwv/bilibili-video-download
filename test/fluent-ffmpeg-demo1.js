const fs = require("fs");
const path = require("path");
const ffmpeg = require("fluent-ffmpeg");
const command = ffmpeg();
const spawn = require("child_process").spawn;

// ffmpeg("./v2/videosflv/01.flv")
//   .audioCodec("libmp3lame")
//   // .size("1920x1080")
//   .size("1280x720")
//   .on("progress", function (progress) {
//     console.log(progress.percent + "%");
//   })
//   .on("error", function (err) {
//     console.log("An error occurred: " + err.message);
//   })
//   .on("end", function () {
//     console.log("Processing finished !");
//   })
//   .save("./output3.mp4");

// ffmpeg("./v2/videosflv/01.flv");

// ffmpeg("./v2/videosflv/01.flv")
//   .audioCodec("libmp3lame")
//   .on("error", function (err) {
//     console.log("An error occurred: " + err.message);
//   })
//   .on("end", function () {
//     console.log("Processing finished !");
//   })
//   .save("./output.mp4");

// var outStream = fs.createWriteStream("./output1.mp4");

// ffmpeg("./v2/videosflv/01.flv")
//   .audioCodec("libmp3lame")
//   .size("1920x1080")
//   .on("error", function (err) {
//     console.log("An error occurred: " + err.message);
//   })
//   // 进度条
//   .on("progress", function (progress) {
//     console.log(progress.percent + "%");
//   })
//   .on("end", function () {
//     console.log("Processing finished !");
//   })
//   .pipe(outStream, { end: true });

// 封装一个函数，用于转换视频文件，将flv格式的视频文件转换为mp4格式
/**
 *
 * @param {*} fileObj
 * fileObj = {
 * path  视频文件的路径
 * outputPath 转换后的视频文件的输出路径
 * }
 */

function convertFlvToMp4(fileObj) {
  const lastPath = fileObj.path.split("/")[fileObj.path.split("/").length - 1];
  // 匹配是否为flv格式的视频文件
  if (!lastPath.match(/\.flv$/)) return;
  const fileName = lastPath.split(".flv")[0];
  // const fileName = file.split(".flv")[0];
  // const fileExt = file.split(".")[1];
  console.log(`开始转换:${fileName}.flv`);
  const bat = spawn("ffmpeg", [
    "-i",
    `${fileObj.path}`,
    "-c:v",
    "copy",
    "-y",
    `${fileObj.outputPath}/${fileName}.mp4`,
  ]);

  bat.on("exit", (code) => {
    console.log(`${fileName}.flv 转换完成`);
  });
}

// convertVideo("02.flv");
// 从后往前，将文件名截取到 .flv 后缀，得到文件名

// 读取 v2\分享价值1K的Node.js工程师教程 文件夹中的所有文件
const files = fs.readdirSync("./v2/分享价值1K的Node.js工程师教程");
// 循环转换格式
files.forEach((file) => {
  convertFlvToMp4({
    path: `./v2/分享价值1K的Node.js工程师教程/${file}`,
    outputPath: "./v2/output",
  });
})

