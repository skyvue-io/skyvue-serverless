require('dotenv').config();

const { Client } = require('pg');
const { MongoClient, ObjectID } = require('mongodb');

const aws = require('aws-sdk');
const R = require('ramda');
const { v4: uuid } = require('uuid');

const selectFirst500Rows = require('./services/selectFirst500Rows');

const extractColumnData = require('./lib/extractColumnData');
const {
  createUnprocessedTableQuery,
  createUnloadQuery,
  createPermanentStorageTableQuery,
  createUnloadSelectQuery,
} = require('./lib/queries');

exports.handler = async (event, context) => {
  if (!event) return new Promise(resolve => resolve(undefined));
  console.log('event', JSON.stringify(event));
  const Mongo = new MongoClient(process.env.DB_URI, { useUnifiedTopology: true });
  await Mongo.connect();
  const mongo = Mongo.db('skyvue_db_prod');

  const awsConfig = new aws.Config({
    region: 'us-east-2',
    accessKeyId: process.env.AWS_ACCESSKEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESSKEY,
  });
  const s3 = new aws.S3(awsConfig);

  const redshift = new Client();
  await redshift.connect();

  const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));

  const columns = await extractColumnData(
    await selectFirst500Rows(s3, {
      Bucket: event.Records[0].s3.bucket.name,
      Key: key,
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

  console.log(createUnprocessedTableQuery(key.slice(0, -1), columns));
  await redshift.query(createUnprocessedTableQuery(key.slice(0, -1), columns));

  console.log(
    createUnloadQuery(createUnloadSelectQuery(key.slice(0, -2), columns), boardId),
  );
  await redshift.query(
    createUnloadQuery(createUnloadSelectQuery(key.slice(0, -2), columns), boardId),
  );

  console.log(createPermanentStorageTableQuery(boardId, columns));
  await redshift.query(createPermanentStorageTableQuery(boardId, columns));

  console.log('destination table', `${boardId}_working`);

  await mongo
    .collection('datasets')
    .updateOne(
      { _id: new ObjectID(key.slice(0, -2)) },
      { $set: { isProcessing: false } },
    );

  return new Promise(resolve => {
    resolve(JSON.stringify({ columns, boardId }));
  });
};

exports.handler();
