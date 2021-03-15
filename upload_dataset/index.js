const randomWords = require('random-words');

exports.handler = async event => {
  console.log('hello world');
  const response = {
    statusCode: 200,
    body: JSON.stringify(randomWords(5)),
  };
  return response;
};
