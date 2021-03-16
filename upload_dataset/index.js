const randomWords = require('random-words');

exports.handler = async event => {
  const { body } = JSON.parse(event);
  const response = {
    statusCode: 200,
    body: JSON.stringify(body),
  };
  return response;
};
