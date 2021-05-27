const csv = require('csvtojson');
const R = require('ramda');
const { v4: uuid } = require('uuid');

const parseDataType = require('./parseDataType');
const { isNullish } = require('./isNullish');

const extractColumnData = async file => {
  const csvAsJson = await csv().fromString(file.toString('utf8'));

  return R.pipe(
    x => R.keys(x[0]),
    R.map(key => ({
      _id: uuid(),
      value: key,
      dataType: R.reduce((acc, current) => {
        const val = current[key];
        const currentDataType = parseDataType(val);
        return !val || isNullish(val) ? acc ?? 'string' : currentDataType;
      }, undefined)(csvAsJson),
    })),
  )(csvAsJson);
};

module.exports = extractColumnData;
