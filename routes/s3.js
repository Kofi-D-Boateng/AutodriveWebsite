"use-strict";
const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const express = require("express");
var router = express.Router();
const User = require("../models/user");
const passport = require("passport");
const fs = require("fs");

// AWS SETUP
const region = "us-east-2";
const bucketName = process.env.AWS_BUCKET_NAME;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_ACCESS_KEY_SECRET;

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
    // console.log("GRAB THIS KEY---> " + uploadParams["Key"] + "\n");

    return s3.upload(uploadParams).promise();
  }),
  getFileStream: (getFileStream = (fileKey) => {
    const downloadParams = {
      Key: fileKey,
      Bucket: bucketName,
    };
    console.log("GRAB THIS KEY---> " + downloadParams["Key"] + "\n");

    return s3.getObject(downloadParams).createReadStream();
  }),
};
