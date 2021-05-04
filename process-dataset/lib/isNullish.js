const NULLISH_VALUES = [
  null,
  'null',
  'nil',
  'undefined',
  undefined,
  'none',
  '',
  'na',
  'n/a',
  NaN,
  'nan',
];

const isNullish = value => NULLISH_VALUES.includes(value?.toLowerCase());

module.exports = { isNullish, NULLISH_VALUES };
