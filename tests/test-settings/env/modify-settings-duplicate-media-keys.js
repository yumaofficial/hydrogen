// Hydrogen tests: Build settings
'use strict';

// Vendor dependencies

// Hydrogen dependencies
var { build_test_settings } = require('../../build-settings');

function modify_settings(settings) {
  // Manipulate the settings for this test =====================================
  settings.input = ['markup'];
  settings.output = 'styles';
  settings.styles.foundations.media = [
    {
      key: 'print',
      query: 'print',
    },
    {
      key: 'print',
      query: 'screen and (min-width: 30rem)',
    },
  ];
  settings.styles.foundations.typography = [
    {
      query_key: 'base',
      size: '100%',
      line_height: '1.4',
      type_scale: '1.2',
    },
  ];
  return settings;
}

build_test_settings('Parser test', modify_settings);
