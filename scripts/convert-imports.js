// revert-module-specifier.cjs
const { Project } = require('ts-morph');
const path = require('path');

(async () => {
  const project = new Project({ tsConfigFilePath: 'tsconfig.json' });
  const files = project
    .getSourceFiles('src/**/*.ts')
    .filter((f) => !f.getFilePath().includes('/node_modules/') && !f.isDeclarationFile());

  for (const f of files) {
    let changed = false;
    for (const imp of f.getImportDeclarations()) {
      const spec = imp.getModuleSpecifierValue();
      if (spec && spec.includes('app-i18n/translate.helper')) {
        imp.setModuleSpecifier(
          spec.replace('../../../shared/modules/app-i18n/translate.helper', '@app/common'),
        );
        changed = true;
      }
    }
    if (changed) await f.save();
  }
  console.log('done');
})();
