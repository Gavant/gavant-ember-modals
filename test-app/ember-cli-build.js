'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

const packageJson = require('./package');
module.exports = function (defaults) {
    let app = new EmberApp(defaults, {
        autoImport: {
            watchDependencies: Object.keys(packageJson.dependencies)
        },
        sassOptions: {
            includePaths: [
                '../node_modules/ember-modal-dialog/app/styles',
                '../node_modules/@gavant/ember-modals/dist/styles'
            ]
        }
    });

    const { Webpack } = require('@embroider/webpack');
    return require('@embroider/compat').compatBuild(app, Webpack, {
        packageRules: [
            {
                package: 'ember-modal-dialog',
                components: {
                    '<ModalDialog/>': {
                        invokes: {
                            modalDialogComponentName: [
                                '{{ember-modal-dialog/-in-place-dialog}}',
                                '{{ember-modal-dialog/-liquid-tether-dialog}}',
                                '{{ember-modal-dialog/-tether-dialog}}',
                                '{{ember-modal-dialog/-liquid-dialog}}',
                                '{{ember-modal-dialog/-basic-dialog}}'
                            ]
                        },
                        layout: {
                            addonPath: 'templates/components/modal-dialog.hbs'
                        }
                    },
                    '<LiquidWormhole/>': { safeToIgnore: true },
                    '<LiquidTether/>': { safeToIgnore: true }
                }
            }
        ]
    });
};
