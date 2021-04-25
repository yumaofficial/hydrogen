"use strict";

const { series, parallel, src, dest, watch } = require('gulp');
const fs = require('fs');
const prompt = require('prompt');
const { colors } = require('prompt');

prompt.message = colors.blue('Hydrogen');
prompt.delimiter = colors.white(':');

const properties = [
  {
    name: 'markupFolder',
    required: true,
    description: colors.white('Markup Folder: the path to your main markup from the root of your project (e.g. src/templates or html). If your project has multiple markup folders, you can add them to an array in the hydrogen.config.json file afterwards. Learn more in the Hydrogen docs.')
  },
  {
    name: 'styleFolder',
    required: true,
    description: colors.white('Styles Folder: the path to your styles folder from the root of your project (e.g. src/styles or css).')
  }
];

var markup = '';
var styles = '';
var hydrogenInit = '';

function setFolders(done) {
  prompt.start();
  prompt.get(properties, function (err, result) {
    markup = result.markupFolder;
    styles = result.styleFolder;
    done();
  });
}

function createHydrogenInit(done) {
  // Reset the variables.
  hydrogenInit = '{\n  "folders": {\n    "markup": "' + markup + '",\n    "styles": "' + styles + '"\n  }\n}';
  // Write the file.
  fs.writeFile('./hydrogen.config.json', hydrogenInit, function(err) {
    if (err) {
      console.log('[ERROR] Hydrogen: ', err.red);
    }
  });
  done();
}

function initSuccess(done) {
  console.log('[SUCCESS] Hydrogen: you\'ve successfully created a Hydrogen configuration file. You can see all available configuration options at https://hydrogen.design'.green);
  done();
}

exports.init = series(setFolders, createHydrogenInit, initSuccess);