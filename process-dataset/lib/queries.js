const knex = require('knex')({
  client: 'redshift',
});
const { NULLISH_VALUES } = require('./isNullish');

// create table for querying the unprocessed data
const createUnprocessedTableQuery = (key, columns) =>
  knex.schema
    .createTable(`spectrum.${key.slice(0, -1)}`, table => {
      columns.forEach(col => {
        table.string(col.value);
      });
    })
    .toString()
    .replace('create table', 'create external table') +
  `
      ROW FORMAT DELIMITED FIELDS TERMINATED BY ','
      STORED AS TEXTFILE
      LOCATION 's3://skyvue-datasets-queue/${key}'
      TABLE PROPERTIES (
        'skip.header.line.count'= '1'
      )
     `.trim();

const makeCaseStatement = (tableKey, { value, _id }) =>
  `${NULLISH_VALUES.map(val => `when ''${val}'' then ${null}`).join(
    '\n',
  )} else spectrum."${tableKey}"."${value}" end as "${_id}"`;

const createUnloadSelectQuery = (unprocessedTableKey, columns) =>
  knex
    .select(
      knex.raw(
        'md5(cast (random() * 100 as int) || cast(random() * 100 as int) || TIMEOFDAY()) as id',
      ),
      ...columns.map(col =>
        knex.raw(
          `case spectrum."${unprocessedTableKey}"."${col.value}" ${makeCaseStatement(
            unprocessedTableKey,
            col,
          )}`,
        ),
      ),
    )
    .table(`spectrum.${unprocessedTableKey}`)
    .toString();

// create unload query
const createUnloadQuery = (selectQuery, boardId) => `
  UNLOAD ('${selectQuery}')
  TO 's3://skyvue-datasets/${boardId}/rows/'
  iam_role '${process.env.REDSHIFT_IAM_ROLE}'

  format as CSV
`;

// create an external table that Redshift can use to query s3 data
const createPermanentStorageTableQuery = (boardId, columns) =>
  knex.schema
    .createTable(`spectrum.${boardId}_working`, table => {
      table.string('id');
      columns.forEach(col => {
        switch (col.dataType) {
          case 'string':
            table.string(col._id);
            break;
          case 'number':
            table.float(col._id);
            break;
          case 'date':
            table.datetime(col._id);
            break;
          default:
            table.string(col._id);
        }
      });
    })
    .toString()
    .replace('create table', 'create external table') +
  `
    ROW FORMAT DELIMITED FIELDS TERMINATED BY ','
    STORED AS TEXTFILE
    LOCATION 's3://skyvue-datasets/${boardId}/rows'
    TABLE PROPERTIES (
      'skip.header.line.count'= '1'
    )
    `.trim();

module.exports = {
  createUnprocessedTableQuery,
  makeCaseStatement,
  createUnloadSelectQuery,
  createUnloadQuery,
  createPermanentStorageTableQuery,
};
