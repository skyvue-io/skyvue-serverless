const randomWords = require('random-words');

exports.handler = async event => {
  console.log('hello world');
  const response = {
    statusCode: 200,
    body: JSON.stringify(event),
  };
  return response;
};
