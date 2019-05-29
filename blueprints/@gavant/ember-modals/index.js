/* eslint-env node */
'use strict';

const path = require('path');
const fs = require('fs');

module.exports = {
  normalizeEntityName() {}, // no-op since we're just adding dependencies

  afterInstall() {
    let importStatement = '\n@import "@gavant/ember-modals";\n';

    let stylePath = path.join('app', 'styles');
    let file = path.join(stylePath, 'app.scss');
    let writeOp = Promise.resolve();

    if (!fs.existsSync(stylePath)) {
        fs.mkdirSync(stylePath);
    }
    if (fs.existsSync(file)) {
        this.ui.writeLine(`Added import statement to ${file}`);
        writeOp = this.insertIntoFile(file, importStatement, {});
    } else {
        fs.writeFileSync(file, importStatement);
        this.ui.writeLine(`Created ${file}`);
    }

    return writeOp.then(() => {
        return this.addPackagesToProject([
          { name: 'animate.css' }
        ]);
    });
  }
};
