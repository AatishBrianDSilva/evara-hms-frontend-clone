module.exports = function transformer(file, api) {
  const j = api.jscodeshift.withParser('tsx');

  return j(file.source)
    .find(j.ImportDeclaration, {
      source: { value: '@mui/material' },
    })
    .forEach((path) => {
      // Extract named imports
      const namedImports = path.value.specifiers
        .filter((specifier) => specifier.type === 'ImportSpecifier')
        .map((specifier) => specifier.imported.name);

      // Create individual import declarations for each named import
      const newImports = namedImports.map((importName) =>
        j.importDeclaration(
          [j.importDefaultSpecifier(j.identifier(importName))],
          j.literal(`@mui/material/${importName}`)
        )
      );

      // Replace the original import declaration with new ones
      j(path).replaceWith(newImports);
    })
    .toSource({ quote: 'single' });
};
