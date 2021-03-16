const mongoose = require('mongoose');

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
  const body = JSON.parse(event.body);
  const response = {
    statusCode: 200,
    body: JSON.stringify(process.env.TESTING),
  };
  return response;
};
