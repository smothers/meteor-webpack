var weight = 100;

function dependencies() {
  return {
    dependencies: {},
    devDependencies: {
      'babel-core': '^6.3.26',
      'babel-loader' : '^6.2.0',
      'babel-preset-es2015': '^6.3.13',
      'babel-plugin-transform-runtime': '^6.6.0',
      'babel-runtime': '^5.0.0',
      'vue': '^1.0.17',
      'vue-loader': '^8.2.0',
      'vue-html-loader': '^1.2.0',
      'vue-style-loader': '^1.0.0',
      'vue-hot-reload-api': '^1.3.2'
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

  if (babelSettings.presets.indexOf('es2015') < 0) {
    babelSettings.presets.push('es2015');
  }

  if (!babelSettings.plugins) {
    babelSettings.plugins = [];
  }

  if (babelSettings.plugins.indexOf('transform-runtime') < 0) {
    babelSettings.plugins.push('transform-runtime');
  }

  return {
    loaders: [
      { test: /\.vue$/, loader: 'vue', exclude: /\.meteor|node_modules/ },
      { test: /\.js$/, loader: 'babel', exclude: /\.meteor|node_modules/ }
    ],
    extensions: ['.js', '.vue'],
    config: {
      babel: babelSettings
    }
  };
}
