const knex = require('knex')({
  client: 'redshift',
});

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

const makeCaseStatement = (colId, isLast) =>
  `${NULLISH_VALUES.map(val => `when "${val}" then ${null}`).join(
    '\n',
  )} else "${colId}" end as "${colId}"`;

const createUnloadSelectQuery = (unprocessedTableKey, columns) =>
  knex
    .select(
      ...columns.map((col, index) =>
        knex.raw(
          `case "${col._id}" ${makeCaseStatement(
            col._id,
            index === columns.length - 1,
          )}`,
        ),
      ),
    )
    .table(`spectrum.${unprocessedTableKey}`)
    .toString();

// create unload query
const createUnloadQuery = (selectQuery, boardId) => `
  UNLOAD ('${selectQuery}')
  TO "s3://skyvue-datasets/${boardId}/rows/"
  iam_role "arn:aws:iam::082311462302:role/redshift-s3-and-athena-full-access"

  format as CSV
`;

// create an external table that Redshift can use to query s3 data
const createPermanentStorageTableQuery = (boardId, columns) =>
  knex.schema
    .createTable(`spectrum.${boardId}`, table => {
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
            table.string();
        }
        table.string(col._id);
      });
    })
    .raw(
      `
    ROW FORMAT DELIMITED FIELDS TERMINATED BY ','
    STORED AS TEXTFILE
    LOCATION 's3://skyvue-datasets/${boardId}/rows'
    TABLE PROPERTIES (
      'skip.header.line.count'= '1'
    )
    `.trim(),
    )
    .toString()
    .replace('create table', 'create external table');

module.exports = {
  createUnprocessedTableQuery,
  makeCaseStatement,
  createUnloadSelectQuery,
  createUnloadQuery,
  createPermanentStorageTableQuery,
};
