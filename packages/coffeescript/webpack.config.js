var weight = 200;

function dependencies() {
  return {
    devDependencies: {
      'babel': '^6.3.26',
      'babel-core': '^6.3.26',
      'babel-loader' : '^6.2.0',
      'babel-preset-es2015': '^6.3.13',
      'babel-preset-stage-0': '^6.3.13',
      'coffee-loader' : '^0.7.2',
      'coffee-script' : '^1.10.0'
    }
  };
}

function config(settings, require) {
  var fs = require('fs');
  var path = require('path');
  var babelSettings = {};

  var CWD = path.resolve('./');

  if (fs.existsSync(CWD + '/.babelrc')) {
    var babelrc = fs.readFileSync(CWD + '/.babelrc');
    babelSettings = JSON.parse(babelrc);
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
      { test: /\.coffee?$/, loader: 'babel?' + JSON.stringify(babelSettings) + '!coffee', exclude: /\.meteor|node_modules/ }
    ],
    extensions: ['.coffee'],
  };
}
