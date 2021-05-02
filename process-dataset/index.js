require('dotenv').config();

const { Client } = require('pg');
const aws = require('aws-sdk');
const knex = require('knex')({
  client: 'redshift',
});
const R = require('ramda');

const selectFirst500Rows = require('./services/selectFirst500Rows');

const extractColumnData = require('./lib/extractColumnData');

exports.handler = async (event, context) => {
  const awsConfig = new aws.Config({
    region: 'us-east-2',
    accessKeyId: process.env.AWS_ACCESSKEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESSKEY,
  });
  const s3 = new aws.S3(awsConfig);

  const redshift = new Client();
  await redshift.connect();

  const first500Rows = await selectFirst500Rows(s3, {
    Bucket: event.Records[0].s3.bucket.name,
    Key: decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' ')),
  });

  const columnData = extractColumnData(first500Rows);

  console.log(columnData);

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
