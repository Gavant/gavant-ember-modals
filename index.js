'use strict';

module.exports = {
  name: 'gavant-ember-modals',
  config: function(environment, appConfig) {
    let initialConfig = Object.assign({}, appConfig);
    let updatedConfig = this.addons.reduce((config, addon) => {
      if (addon.config) {
        Object.assign(config, addon.config(environment, config));
      }
      return config;
    }, initialConfig);
    return updatedConfig;
  },
  included: function(app) {
    this._super.included.apply(this, arguments);
    app.import("node_modules/animate.css/animate.min.css");
  }
};
