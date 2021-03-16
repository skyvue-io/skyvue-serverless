const randomWords = require('random-words');

exports.handler = async event => {
  const response = {
    statusCode: 200,
    body: JSON.stringify(event.body),
  };
  return response;
};
