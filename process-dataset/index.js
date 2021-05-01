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
  const dbParams = {
    user: REDSHIFT_USER,
    database: REDSHIFT_DB,
    password: REDSHIFT_PW,
    port: REDSHIFT_PORT,
    host: REDSHIFT_HOST,
  };
  const client = new Client(dbParams);
  const connected = await client.authenticate();
  console.log(connected);
  await client.connect();

  const results = await client.query('select * from information_schema.tables');
  console.log(results);

  // const test = await axios.get('https://swapi.dev/api/people/1/');
  // console.log(test.data);

  // return new Promise((resolve, reject) => {
  //   axios.get('https://swapi.dev/api/people/1/').then(data => resolve(data.data));
  // });
  return new Promise((resolve, reject) => {
    client
      .query('select * from information_schema.tables')
      .then(res => {
        console.log(res.rows);
        return res;
      })
      .then(data => resolve(data.rows));
  });
};

console.log(exports.handler());
