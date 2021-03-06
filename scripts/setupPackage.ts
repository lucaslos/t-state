import fs from 'fs';

function setupPackage() {
  const source = fs
    .readFileSync(`${__dirname}/../package.json`)
    .toString('utf-8');

  const pkg = JSON.parse(source);
  pkg.scripts = {};
  pkg.devDependencies = {};
  if (pkg.main.startsWith('dist/')) {
    pkg.main = pkg.main.replace('dist/', '');
  }
  if (pkg.types.startsWith('dist/')) {
    pkg.types = pkg.types.replace('dist/', '');
  }
  fs.writeFileSync(
    `${__dirname}/../dist/package.json`,
    Buffer.from(JSON.stringify(pkg, null, 2), 'utf-8'),
  );
}

setupPackage();
