require('dotenv').config();
const { Client } = require('pg');
const axios = require('axios');

exports.handler = async (event, context) => {
  const client = new Client();
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
