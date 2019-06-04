'use strict';

module.exports = {
  extends: 'recommended',
  rules: {
    'no-bare-strings': true,
    'block-indentation': 4,
    'attribute-indentation': false
  },
  ignore: [
    'dummy/templates/**',
    'addon/templates/**'
  ]
};
