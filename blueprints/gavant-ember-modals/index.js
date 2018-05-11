module.exports = {
  normalizeEntityName() {}, // no-op since we're just adding dependencies

  afterInstall() {
    return this.addPackagesToProject([
      { name: 'animate.css' }
    ]);
  }
};
