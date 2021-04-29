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

exports.handler = async event =>
  new Promise((resolve, reject) => {
    makeRedshift()
      .then(redshift => redshift.query('select * from information_schema.tables'))
      .then(res => {
        console.log('here is the data');
        resolve(res);
      });
  });
