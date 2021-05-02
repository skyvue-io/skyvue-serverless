const csv = require('csvtojson');

const selectFirst500Rows = async (s3, s3Params) => {
  const params = {
    ...s3Params,
    ExpressionType: 'SQL',
    Expression: 'SELECT * FROM S3Object limit 500',
    InputSerialization: {
      CSV: {
        FileHeaderInfo: 'USE',
        RecordDelimiter: '\n',
        FieldDelimiter: ',',
      },
    },
    OutputSerialization: {
      CSV: {},
    },
  };

  const res = await s3.selectObjectContent(params).promise();
  const events = res.Payload;
  let response = '';

  for await (const event of events) {
    if (event.Records) {
      response += event.Records.Payload.toString();
    }
  }

  return csv().fromString(response);
};

module.exports = selectFirst500Rows;
