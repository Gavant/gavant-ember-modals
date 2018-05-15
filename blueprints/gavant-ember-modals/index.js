/* eslint-env node */
'use strict';

const path = require('path');
const fs = require('fs');

module.exports = {
  normalizeEntityName() {}, // no-op since we're just adding dependencies

  afterInstall() {
    let importStatement = '\n@import "gavant-ember-validations";\n';

    let stylePath = path.join('app', 'styles');
    let file = path.join(stylePath, 'app.scss');

    if (!fs.existsSync(stylePath)) {
        fs.mkdirSync(stylePath);
    }
    if (fs.existsSync(file)) {
        this.ui.writeLine(`Added import statement to ${file}`);
        return this.insertIntoFile(file, importStatement, {});
    } else {
        fs.writeFileSync(file, importStatement);
        this.ui.writeLine(`Created ${file}`);
    }

    return this.addPackagesToProject([
      { name: 'animate.css' }
    ]);
  }
};
