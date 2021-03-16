const randomWords = require('random-words');

exports.handler = async event => {
  const response = {
    statusCode: 200,
    body: JSON.stringify(JSON.parse(event.body)),
  };
  return response;
};
