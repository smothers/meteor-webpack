var weight = 300;

function dependencies(settings) {
  const devDependencies = {
    'sass-loader': '^3.1.2',
    'node-sass': '^3.4.2'
  };

  if (settings.sassResources) {
    devDependencies['sass-resources-loader'] = '^1.0.2';
  }

  return {
    devDependencies: devDependencies
  };
}

function config(settings, require) {
  var plugins = [];
  var config = {};
  var cssLoader = settings.cssLoader + '!sass?' + JSON.stringify(settings.sass || {});

  if (settings.sassResources) {
    config.sassResources = settings.sassResources;
    cssLoader += '!sass-resources';
  }

  if (settings.cssExtract) {
    var ExtractTextPlugin = require('extract-text-webpack-plugin');
    cssLoader = ExtractTextPlugin.extract('style', cssLoader);
  }

  return {
    loaders: [{ test: /\.scss$/, loader: cssLoader }],
    extensions: ['.scss'],
    config: config
  };
}
