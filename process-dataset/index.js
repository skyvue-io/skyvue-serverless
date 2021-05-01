require('dotenv').config();

const { Client } = require('pg');
const aws = require('aws-sdk');
const knex = require('knex')({
  client: 'redshift',
});
const R = require('ramda');

const parseDataType = require('./parseDataType');

const awsConfig = new aws.Config({
  region: 'us-east-2',
  accessKeyId: process.env.AWS_ACCESSKEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESSKEY,
});
const s3 = new aws.S3(awsConfig);

const redshift = new Client();

exports.handler = async (event, context) => {
  await redshift.connect();
  console.log(event);
  const Bucket = event.Records[0].s3.bucket.name;
  const Key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
  const params = {
    Bucket,
    Key,
  };

  // extract column information
  // parse data types
  // upload columns to S3 or Mongo? TODO figure this out
  // generate create table query according to colIds
  // generate insert query
  // execute itttt

  return new Promise((resolve, reject) => {
    redshift.query('select * from information_schema.tables').then(data => {
      redshift.end();
      resolve(data.rows);
    });
  });
};
