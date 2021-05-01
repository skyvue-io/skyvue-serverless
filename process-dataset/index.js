require('dotenv').config();
const { Pool } = require('pg');

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
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  };
  const client = new Pool(dbParams);
  await client.connect();

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

exports.handler({}, {});
