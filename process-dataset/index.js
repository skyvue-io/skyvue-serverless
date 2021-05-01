require('dotenv').config();
const { Client } = require('pg');
const axios = require('axios');

exports.handler = async (event, context) => {
  const client = new Client();
  console.log('I am called', process.env.PGHOST);
  await client.connect();

  console.log('I am still getting hung up here');
  const results = await client.query('select * from information_schema.tables');
  console.log('I am still getting hung up here');

  // const test = await axios.get('https://swapi.dev/api/people/1/');
  // console.log(test.data);

  // return new Promise((resolve, reject) => {
  //   axios.get('https://swapi.dev/api/people/1/').then(data => resolve(data.data));
  // });
  return new Promise((resolve, reject) => {
    client
      .query('select * from information_schema.tables')
      .then(data => resolve(data.rows));
  });
};
