const NULLISH_VALUES = [
  null,
  'null',
  'nil',
  'undefined',
  'none',
  'NONE',
  'None',
  'na',
  'NA',
  'n/a',
  'N/A',
  'nan',
  'NaN',
];

const isNullish = value => NULLISH_VALUES.includes(value?.toLowerCase());

module.exports = { isNullish, NULLISH_VALUES };
