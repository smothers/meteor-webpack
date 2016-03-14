
var weight = 300;

function dependencies(settings) {
  return {
    devDependencies: {
      'stylus-loader':'^1.4.0'
    }
  };
}

function config(settings, require) {
  var cssLoader = settings.cssLoader + '!stylus';

  if (settings.cssExtract) {
    var ExtractTextPlugin = require('extract-text-webpack-plugin');
    cssLoader = ExtractTextPlugin.extract(cssLoader);
  }

  return {
    loaders: [{ test: /\.styl$/, loader: cssLoader }],
    extensions: ['.styl']
  };
}
