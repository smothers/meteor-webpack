var weight = 300;

function dependencies(settings) {
  return {
    devDependencies: {
      'less-loader': '^2.2.2',
      'less': '^2.3.1'
    }
  };
}

function config(settings, require) {
  var cssLoader = settings.cssLoader + '!less';

  if (settings.cssExtract) {
    var ExtractTextPlugin = require('extract-text-webpack-plugin');
    cssLoader = ExtractTextPlugin.extract('style', cssLoader);
  }

  return {
    loaders: [{ test: /\.less$/, loader: cssLoader }],
    extensions: ['.less']
  };
}
