exports.handler = async event => {
  const bucket = event.Records[0].s3.bucket.name;
  const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));

  console.log('successful invokation!!', bucket, key);
  // TODO implement
  const response = {
    statusCode: 200,
    body: JSON.stringify(event),
  };

  return response;
};
