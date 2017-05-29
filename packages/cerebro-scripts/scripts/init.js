'use strict';
// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err;
});

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

module.exports = function(appPath, appName, originalDirectory) {
  const ownPackageName = require(path.join(
    __dirname,
    '..',
    'package.json'
  )).name;
  const ownPath = path.join(appPath, 'node_modules', ownPackageName);
  const appPackage = require(path.join(appPath, 'package.json'));

  // Copy over some of the devDependencies
  appPackage.dependencies = appPackage.dependencies || {};
  appPackage.devDependencies = appPackage.devDependencies || {};

  appPackage.main = 'dist/index.js';

  appPackage.keywords = ["cerebro", "cerebro-plugin"]

  // Setup the script rules
  appPackage.scripts = {
    start: 'cerebro-scripts start',
    build: 'cerebro-scripts build',
    test: 'cerebro-scripts test'
  };

  fs.writeFileSync(
    path.join(appPath, 'package.json'),
    JSON.stringify(appPackage, null, 2)
  );

  // Copy the files for the user
  const templatePath = path.join(ownPath, 'template');
  if (fs.existsSync(templatePath)) {
    fs.copySync(templatePath, appPath);
  } else {
    console.error(
      `Could not locate supplied template: ${chalk.green(templatePath)}`
    );
    return;
  }

  // Display the most elegant way to cd.
  // This needs to handle an undefined originalDirectory for
  // backward compatibility with old global-cli's.
  let cdpath;
  if (originalDirectory && path.join(originalDirectory, appName) === appPath) {
    cdpath = appName;
  } else {
    cdpath = appPath;
  }

  console.log();
  console.log(`Success! Created plugin structure for ${appName} at ${appPath}`);
  console.log('Inside that directory, you can run several commands:');
  console.log();
  console.log(chalk.cyan(`  yarn start`));
  console.log('    Starts the development process of plugin.');
  console.log();
  console.log(
    chalk.cyan(`  yarn build`)
  );
  console.log('    Build your plugin before publishing it');
  console.log();
  console.log(chalk.cyan(`  yarn test`));
  console.log('    Starts the test runner.');
  console.log();
  console.log('We suggest that you begin by typing:');
  console.log();
  console.log(chalk.cyan('  cd'), cdpath);
  console.log(`  ${chalk.cyan(`yarn start`)}`);
  console.log();
  console.log('Happy hacking!');
}