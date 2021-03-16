const mongoose = require('mongoose');
const Dataset = require('./models/Dataset');

require('dotenv').config();

const handleMongoError = err => {
  console.error(`Mongoose connection error: ${err}`);
  process.exit(1);
};

const connectToDB = async () => {
  await mongoose
    .connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true,
      useUnifiedTopology: true,
    })
    .catch(handleMongoError);

  mongoose.connection.on('error', handleMongoError);
}

connectToDB();

exports.handler = async event => {
  new Dataset({
    userId: 'blah',
    title: 'blah',
    visibilitySettings: {
      owner: 'blah',
      editors: ['blah'],
      viewers: ['blah'],
    },
  }).save()

  console.log('why is this not working')

  const response = {
    statusCode: 200,
    body: JSON.stringify(process.env.TESTING),
  };
  return response;
};
