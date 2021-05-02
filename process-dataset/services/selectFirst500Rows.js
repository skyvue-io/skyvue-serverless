const selectFirst500Rows = async (s3, s3Params) => {
  const params = {
    ...s3Params,
    ExpressionType: 'SQL',
    Expression: 'SELECT * FROM S3Object limit 500',
    InputSerialization: {
      CSV: {
        FileHeaderInfo: 'NONE',
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

  return response;
};

module.exports = selectFirst500Rows;
