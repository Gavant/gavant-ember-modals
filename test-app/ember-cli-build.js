'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

const packageJson = require('./package');
module.exports = function (defaults) {
    let app = new EmberApp(defaults, {
        autoImport: {
            watchDependencies: Object.keys(packageJson.dependencies)
        },
        sassOptions: {
            includePaths: ['../node_modules/@gavant/ember-modals/dist/styles']
        }
    });

    const { maybeEmbroider } = require('@embroider/test-setup');
    return maybeEmbroider(app);
};
