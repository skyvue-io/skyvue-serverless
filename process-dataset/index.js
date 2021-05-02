require('dotenv').config();

const { Client } = require('pg');
const aws = require('aws-sdk');
const knex = require('knex')({
  client: 'redshift',
});
const R = require('ramda');
const { v4: uuid } = require('uuid');

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

  const columns = await extractColumnData(
    await selectFirst500Rows(s3, {
      Bucket: event.Records[0].s3.bucket.name,
      Key: decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' ')),
    }),
  );

  const boardId = uuid();

  await s3
    .putObject({
      Bucket: 'skyvue-datasets',
      ContentType: 'text/csv',
      Key: `${boardId}/columns/${0}`,
      Body: JSON.stringify({
        columns,
        layerToggles: {
          groupings: true,
          filters: true,
          joins: true,
          smartColumns: true,
        },
      }),
    })
    .promise();

  /*
    - create two tables:
      - Key
      - boardId

    - UNLOAD(select colName as colId from Key)
      TO 's3://skyvue-datasets/{boardId}'
      AS CSV
  */

  return new Promise((resolve, reject) => {
    resolve(JSON.stringify({ columns, boardId }));
    // redshift.query('select * from information_schema.tables').then(data => {
    //   redshift.end();
    //   resolve(data.rows);
    // });
  });
};
