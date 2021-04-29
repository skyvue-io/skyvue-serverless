require('dotenv').config();
const { Client } = require('pg');
const axios = require('axios');

const {
  REDSHIFT_DB,
  REDSHIFT_USER,
  REDSHIFT_PW,
  REDSHIFT_PORT,
  REDSHIFT_HOST,
} = process.env;

exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const dbParams = {
    user: REDSHIFT_USER,
    database: REDSHIFT_DB,
    password: REDSHIFT_PW,
    port: REDSHIFT_PORT,
    host: REDSHIFT_HOST,
  };
  const client = new Client(dbParams);
  await client.connect();

  console.log('client is connected');

  // const results = await redshift.query('select * from information_schema.tables');

  // return new Promise((resolve, reject) => {
  //   axios.get('https://swapi.dev/api/people/1/').then(data => resolve(data.data));
  // });
  return new Promise((resolve, reject) => {
    client
      .query('select * from information_schema.tables')
      .then(data => resolve(data.rows));
  });
};
