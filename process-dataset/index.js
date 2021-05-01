require('dotenv').config();
const { Client } = require('pg');

exports.handler = async (event, context) => {
  const client = new Client();
  console.log('I am called', process.env.PGHOST);
  await client.connect();

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
