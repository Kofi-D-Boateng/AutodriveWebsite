"use-strict";
const aws = require("aws-sdk");
require("dotenv").config;
const fs = require("fs");

// AWS SETUP
const region = "us-east-2";
const bucketName = "autodrive-photos";
const accessKeyId = "AKIAYIMUVV5D6XVBEW2R";
const secretAccessKey = "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";

const s3 = new aws.S3({
  region,
  accessKeyId,
  secretAccessKey,
});

// UPLOADING AND DOWNLOADING FILES TO S3
module.exports = {
  uploadFile: (uploadFile = (file) => {
    const fileStream = fs.createReadStream(file.path);

    const uploadParams = {
      Bucket: bucketName,
      Body: fileStream,
      Key: file.filename,
    };
    return s3.upload(uploadParams).promise();
  }),
  getFileStream: (getFileStream = (fileKey) => {
    const downloadParams = {
      Key: fileKey,
      Bucket: bucketName,
    };
    return s3.getObject(downloadParams).createReadStream();
  }),
  deleteFile: (deleteFile = (fileKey) => {
    const deleteParams = {
      Key: fileKey,
      Bucket: bucketName,
    };
    return s3.deleteObject(deleteParams).createReadStream();
  }),
};
