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
  };

  const res = await s3.selectObjectContent(params).promise();
  const events = res.Payload;

  for await (const event of events) {
    if (event.Records) {
      console.log(event.Records.Payload.toString());
    }
  }
};

module.exports = selectFirst500Rows;
