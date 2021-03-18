const mongoose = require('mongoose');
const aws = require('aws-sdk');
const dataset = require('./models/Dataset');

require('dotenv').config();

let conn = null;

const spacesEndpoint = new aws.Endpoint('nyc3.digitaloceanspaces.com');
const s3 = new aws.S3({
  endpoint: spacesEndpoint,
  accessKeyId: process.env.SPACES_KEY,
  secretAccessKey: process.env.SPACES_SECRET,
});

exports.handler = async (event, context) => {
  const { body } = event;

  if (!body.datasetId) return {
    status: 400,
    message: "Missing datasetId",
  }

  return {
    status: 200,
    message: body.datasetId,
  }

  context.callbackWaitsForEmptyEventLoop = false;

  // Because `conn` is in the global scope, Lambda may retain it between
  // function calls thanks to `callbackWaitsForEmptyEventLoop`.
  // This means your Lambda function doesn't have to go through the
  // potentially expensive process of connecting to MongoDB every time.
  if (conn == null) {
    conn = mongoose.createConnection(process.env.DB_URI, {
      // Buffering means mongoose will queue up operations if it gets
      // disconnected from MongoDB and send them when it reconnects.
      // With serverless, better to fail fast if not connected.
      bufferCommands: false, // Disable mongoose buffering
      bufferMaxEntries: 0 // and MongoDB driver buffering
    });

    // `await`ing connection after assigning to the `conn` variable
    // to avoid multiple function calls creating new connections
    await conn;
    conn.model('dataset', dataset);
  }

  const Dataset = conn.model('dataset');

  const testing = new Dataset({
    userId: 'testing',
    title: 'testing',
    visibilitySettings: {
      owner: 'string',
      editors: [],
      viewers: [],
    }
  }).save();

  const s3Params = {
    Bucket: 'skyvue-datasets',
    Key: 'testing',
    Body: JSON.stringify({ testing: 'hello world' }),
    ContentType: 'application/json',
  };

  await s3.putObject(s3Params).promise();

  const response = {
    status: 200,
    body: JSON.stringify('let\'s try this!'),
  };
  return response;
};
