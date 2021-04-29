require('dotenv').config();
const { Client } = require('pg');

const {
  REDSHIFT_DB,
  REDSHIFT_USER,
  REDSHIFT_PW,
  REDSHIFT_PORT,
  REDSHIFT_HOST,
} = process.env;

const dbParams = {
  user: REDSHIFT_USER,
  database: REDSHIFT_DB,
  password: REDSHIFT_PW,
  port: REDSHIFT_PORT,
  host: REDSHIFT_HOST,
};

const makeRedshift = async () => {
  const client = new Client(dbParams);
  await client.connect();

  return client;
};

exports.handler = async event => {
  // const bucket = event.Records[0].s3.bucket.name;
  // const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));

  const redshift = await makeRedshift();

  // console.log('successful invokation!!', bucket, key);
  console.log(await redshift.query('select * from information_schema.tables'));

  // TODO implement
  const response = {
    statusCode: 200,
    body: JSON.stringify(event),
  };

  return response;
};
