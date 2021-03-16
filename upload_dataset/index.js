const randomWords = require('random-words');

exports.handler = async event => {
  try {
    const { body } = JSON.parse(event);
    const response = {
      statusCode: 200,
      body: JSON.stringify(body),
    };
    return response;
  } catch (e) {
    return e;
  }
};
