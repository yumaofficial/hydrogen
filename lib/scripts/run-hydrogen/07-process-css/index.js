// Hydrogen
'use strict';

// Data models
/**
 * @typedef {import('../../../data/config-data').ParsedConfig} ParsedConfig
 */

// Data imports

// Local functions

// Helper functions
const { log_message } = require('../../console-logging/log-message');

// Vendor imports
var autoprefixer = require('autoprefixer'); // This needs to stay
var cssnano = require('cssnano');
var cssnano_default = require('cssnano-preset-default');
var fs = require('fs');
var postcss = require('postcss');
var path = require('path');

// CSSnano preset
const preset = cssnano_default({
  cssDeclarationSorter: false,
  colormin: false,
  convertValues: false,
  discardOverridden: false,
  mergeLonghand: false,
  mergeRules: false,
  orderedValues: false,
  reduceInitial: false,
  reduceTransforms: false,
  svgo: false,
  uniqueSelectors: false,
});

// Script ==========================================================================================

/**
 * Processes Hydrogen's output to ensure it's prefixed and minified
 * @param {ParsedConfig} config the user's settings
 * @returns {any} A prefixed, minified CSS file
 */
function process_hydrogen(config) {
  try {
    // Start the processor timer
    const postcss_timer_start_time = process.hrtime.bigint();
    // Delete any existing hydrogen.css files
    if (fs.existsSync(path.join(config.output.parsed.string + '/hydrogen.css')) == true) {
      fs.unlinkSync(path.join(config.output.parsed.string + '/hydrogen.css'));
    }
    // Load the raw CSS synchronously
    let rawCSS = fs.readFileSync(path.join(config.output.parsed.string + '/hydrogen.raw.css'));
    // Determine the plugins to be used
    let plugin_array = [];
    let timer_label = '';
    if (config.processing.browser_prefix_css === true && config.processing.minify_css === false) {
      plugin_array = [autoprefixer];
      timer_label = 'prefixed';
    } else if (
      config.processing.browser_prefix_css === false &&
      config.processing.minify_css === true
    ) {
      plugin_array = [
        cssnano({
          preset,
        }),
      ];
      timer_label = 'minified';
    } else if (
      config.processing.browser_prefix_css === true &&
      config.processing.minify_css === true
    ) {
      plugin_array = [
        autoprefixer,
        cssnano({
          preset,
        }),
      ];
      timer_label = 'prefixed and minified';
    }
    // Run PostCSS
    let processor = postcss(plugin_array);
    let result = processor.process(rawCSS);
    // This error handling will primarily catch calc function problems.
    if (result.messages) {
      result.messages.forEach((message, index) => {
        if (message.type === 'warning' || message.type === 'error') {
          var selector_css = message.node.parent.selector + '{';
          message.node.parent.nodes.forEach((n) => {
            selector_css = selector_css + n.prop + ':' + n.value + ';';
          });
          selector_css = selector_css + '}';
          log_message({
            type: 'error',
            config: config,
            step: 'Processing CSSnano',
            message:
              "This syntax error was found during CSSnano's compression of Hydrogen's final CSS output.",
            selector: selector_css,
            css: message.node.prop + ':' + message.node.value + ';',
            files: [path.resolve(config.output.parsed.string + '/hydrogen.css')],
          });
        }
      });
    }
    // Log that Hydrogen is exporting variables
    if (config.logging.verbose_console_output === true) {
      log_message({
        type: 'system',
        step: 'CSS ' + timer_label,
        times: {
          start: postcss_timer_start_time,
          end: process.hrtime.bigint(),
        },
      });
    }
    return result.css;
  } catch (error) {
    if (process.env.H2DEBUG) {
      console.log(error);
    }
    if (error.step) {
      throw error;
    } else {
      throw {
        step: 'Processing raw CSS',
        error: error,
      };
    }
  }
}

module.exports = {
  process_hydrogen,
};