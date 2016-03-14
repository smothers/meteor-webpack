var weight = 300;

function dependencies(settings) {
  return {
    devDependencies: {
      'sass-loader': '^3.1.2',
      'node-sass': '^3.4.2'
    }
  };
}

function config(settings, require) {
  var plugins = [];
  var cssLoader = settings.cssLoader + '!sass?' + JSON.stringify(settings.sass || {});

  if (settings.cssExtract) {
    var ExtractTextPlugin = require('extract-text-webpack-plugin');
    cssLoader = ExtractTextPlugin.extract(cssLoader);
  }

  return {
    loaders: [{ test: /\.scss$/, loader: cssLoader }],
    extensions: ['.scss']
  };
}
