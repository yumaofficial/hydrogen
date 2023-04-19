const { DateTime } = require('luxon');
const { hydrogen_build } = require('@hydrogen-css/hydrogen/lib/build');
const eleventyNavigationPlugin = require('@11ty/eleventy-navigation');
const UpgradeHelper = require('@11ty/eleventy-upgrade-help');

module.exports = function (eleventyConfig) {
  eleventyConfig.setServerOptions({
    // Default values are shown:

    // Whether the live reload snippet is used
    liveReload: true,

    // Whether DOM diffing updates are applied where possible instead of page reloads
    domDiff: false,

    // The starting port number
    // Will increment up to (configurable) 10 times if a port is already in use.
    port: 8080,

    // Additional files to watch that will trigger server updates
    // Accepts an Array of file paths or globs (passed to `chokidar.watch`).
    // Works great with a separate bundler writing files to your output folder.
    // e.g. `watch: ["_site/**/*.css"]`
    watch: [],

    // Show local network IP addresses for device testing
    showAllHosts: false,

    // Use a local key/certificate to opt-in to local HTTP/2 with https
    https: {
      // key: "./localhost.key",
      // cert: "./localhost.cert",
    },

    // Change the default file encoding for reading/serving files
    encoding: 'utf-8',

    // Show the dev server version number on the command line
    showVersion: true,
  });

  // Run Hydrogen after the eleventy build executes
  eleventyConfig.on('eleventy.after', () => {
    try {
      process.env.H2DEBUG = true;
      hydrogen_build();
    } catch (error) {
      console.log(error);
    }
  });

  eleventyConfig.addPlugin(eleventyNavigationPlugin);

  // Create a human readable date format
  eleventyConfig.addFilter('readableDate', (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat(
      'dd LLL yyyy'
    );
  });

  // date filter (localized)
  eleventyConfig.addNunjucksFilter('date', function (date, format, locale) {
    locale = locale ? locale : 'en';
    moment.locale(locale);
    return moment(date).format(format);
  });

  // Copy Static Files to /_Site
  eleventyConfig.addPassthroughCopy({
    './src/static/css/app.css': './static/css/app.css',
    './src/static/scripts/app.js': './static/js/app.js',
    './src/static/_redirects': './_redirects',
  });

  // Copy Image Folder to /_site
  eleventyConfig.addPassthroughCopy('./src/static/img');

  // Copy favicon to route of /_site
  eleventyConfig.addPassthroughCopy({ './src/static/img/favicons': './' });

  eleventyConfig.addWatchTarget('../releases/**/*');

  eleventyConfig.addCollection('en_docs', function (collectionApi) {
    return collectionApi
      .getFilteredByGlob('./src/en/docs/**/*.11ty.js')
      .filter(function (item) {
        return item.data.navigation.order;
      })
      .sort(function (a, b) {
        if (!a.data.navigation.order);
        else if (a.data.navigation.order > b.data.navigation.order) return 1;
        else if (a.data.navigation.order < b.data.navigation.order) return -1;
        else return 0;
      });
  });

  eleventyConfig.addCollection('en_installation', function (collectionApi) {
    return collectionApi
      .getFilteredByGlob('./src/en/docs/installation/*/*.11ty.js')
      .filter(function (item) {
        return item.data.navigation.order;
      })
      .sort(function (a, b) {
        if (!a.data.navigation.order);
        else if (a.data.navigation.order > b.data.navigation.order) return 1;
        else if (a.data.navigation.order < b.data.navigation.order) return -1;
        else return 0;
      });
  });
  eleventyConfig.addCollection('en_configuration', function (collectionApi) {
    return collectionApi
      .getFilteredByGlob('./src/en/docs/configuration/*/*.11ty.js')
      .filter(function (item) {
        return item.data.navigation.order;
      })
      .sort(function (a, b) {
        if (!a.data.navigation.order);
        else if (a.data.navigation.order > b.data.navigation.order) return 1;
        else if (a.data.navigation.order < b.data.navigation.order) return -1;
        else return 0;
      });
  });
  eleventyConfig.addCollection('en_styling', function (collectionApi) {
    return collectionApi
      .getFilteredByGlob('./src/en/docs/styling/*/*.11ty.js')
      .filter(function (item) {
        return item.data.navigation.order;
      })
      .sort(function (a, b) {
        if (!a.data.navigation.order);
        else if (a.data.navigation.order > b.data.navigation.order) return 1;
        else if (a.data.navigation.order < b.data.navigation.order) return -1;
        else return 0;
      });
  });
  eleventyConfig.addCollection('en_properties', function (collectionApi) {
    return collectionApi
      .getFilteredByGlob('./src/en/docs/properties/*/*.11ty.js')
      .filter(function (item) {
        return item.data.navigation.order;
      })
      .sort(function (a, b) {
        if (!a.data.navigation.order);
        else if (a.data.navigation.order > b.data.navigation.order) return 1;
        else if (a.data.navigation.order < b.data.navigation.order) return -1;
        else return 0;
      });
  });

  // If you have other `addPlugin` calls, it’s important that UpgradeHelper is added last.
  // eleventyConfig.addPlugin(UpgradeHelper);

  return {
    dir: {
      input: 'src',
      includes: '_includes',
    },
    templateFormats: ['11ty.js'],
  };
};
