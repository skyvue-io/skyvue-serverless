const mongoose = require('mongoose');
const dataset = require('./models/Dataset');

require('dotenv').config();

// const handleMongoError = err => {
//   console.error(`Mongoose connection error: ${err}`);
//   process.exit(1);
// };

// const connectToDB = async () => {
//   await mongoose
//     .connect(process.env.DB_URI, {
//       useNewUrlParser: true,
//       useFindAndModify: false,
//       useCreateIndex: true,
//       useUnifiedTopology: true,
//     })
//     .catch(handleMongoError);

//   mongoose.connection.on('error', handleMongoError);
// }

// connectToDB();
let conn = null;

exports.handler = async (event, context) => {
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

  new Dataset({
    userId: 'testing',
    title: 'testing',
    visibilitySettings: {
      owner: 'string',
      editors: [],
      viewers: [],
    }
  }).save();

  const response = {
    statusCode: 200,
    body: JSON.stringify('let\'s try this!'),
  };
  return response;
};
