var weight = 200;

function dependencies() {
  return {
    devDependencies: {
      'babel': '^6.3.26',
      'babel-core': '^6.3.26',
      'babel-loader' : '^6.2.0',
      'babel-preset-es2015': '^6.3.13',
      'babel-preset-stage-0': '^6.3.13',
      'ts-loader' : '^0.8.1',
      'typescript' : '^1.8.7'
    }
  };
}

function config(settings, require) {
  var fs = require('fs');
  var path = require('path');
  var babelSettings = {};
  var tsConfig = {};

  var CWD = path.resolve('./');

  if (fs.existsSync(CWD + '/.babelrc')) {
    var babelrc = fs.readFileSync(CWD + '/.babelrc');
    babelSettings = JSON.parse(babelrc);
  }

  if (fs.existsSync(CWD + '/tsconfig.json')) {
    var tsConfigData = fs.readFileSync(CWD + '/tsconfig.json');
    tsConfig = JSON.parse(tsConfigData);
  }

  tsConfig.transpileOnly = true;

  if (!tsConfig.compilerOptions) {
    tsConfig.compilerOptions = {};
  }

  tsConfig.compilerOptions.target = 'es6';
  tsConfig.compilerOptions.sourceMap = true;
  tsConfig.compilerOptions.experimentalDecorators = true;
  tsConfig.compilerOptions.module = 'commonjs';

  if (!tsConfig.exclude) {
    tsConfig.exclude = [];
  }

  if (tsConfig.exclude.indexOf('node_modules') < 0) {
    tsConfig.exclude.push('node_modules');
  }

  if (tsConfig.exclude.indexOf('.meteor') < 0) {
    tsConfig.exclude.push('.meteor');
  }

  if (!babelSettings.presets) {
    babelSettings.presets = [];
  }

  if (!babelSettings.plugins) {
    babelSettings.plugins = [];
  }

  if (babelSettings.presets.indexOf('es2015') < 0) {
    babelSettings.presets.push('es2015');
  }

  if (babelSettings.presets.indexOf('stage-0') < 0 &&
      babelSettings.presets.indexOf('stage-1') < 0 &&
      babelSettings.presets.indexOf('stage-2') < 0 &&
      babelSettings.presets.indexOf('stage-3') < 0) {
    babelSettings.presets.push('stage-0');
  }

  if (settings.babel && settings.babel.plugins) {
    babelSettings.plugins = babelSettings.plugins.concat(settings.babel.plugins);
  }

  return {
    loaders: [
      { test: /\.ts$/, loader: 'babel?' + JSON.stringify(babelSettings) + '!ts?' + JSON.stringify(tsConfig), exclude: /\.meteor|node_modules/ }
    ],
    extensions: ['.ts'],
  };
}
