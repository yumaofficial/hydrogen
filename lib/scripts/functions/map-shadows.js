"use strict";

// Loaded in the event we need to console.log.
var colors = require('colors');

function loadShadowMap(defaults, config) {
  // Create the map string.
  var shadowMapStringStart = '$h2-map-shadow: (';
  var shadowMapStringContent = '';
  var shadowMapStringEnd = ');';
  var shadowConfig;
  // Check to see if the user has defined any options in their config, and if not, load the defaults.
  if (config.shadows != null && config.shadows != undefined && config.shadows.length > 0) {
    shadowConfig = config.shadows;
  } else {
    shadowConfig = defaults.shadows;
  }
  // Loop through each option and build the map.
  shadowConfig.forEach(function(shadow) {
    var shadowString = '"' + shadow.name + '": "' + shadow.value + '",';
    shadowMapStringContent = shadowMapStringContent.concat(shadowString);
  });
  // Assemble the map.
  var shadowMap = shadowMapStringStart + shadowMapStringContent + shadowMapStringEnd;
  // Return the map.
  return shadowMap;
}

// Export the map function for use.
module.exports = loadShadowMap;