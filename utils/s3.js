"use-strict";
const aws = require("aws-sdk");
require("dotenv").config;
const fs = require("fs");

// AWS SETUP
const region = process.env.AWS_BUCKET_REGION;
const bucketName = process.env.AWS_BUCKET_NAME;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_ACCESS_KEY_SECRET;

const s3 = new aws.S3({
  region,
  accessKeyId,
  secretAccessKey,
});

// MAP OF FUNCTIONS FOR UPLOADING AND DOWNLOADING FILES TO S3
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
