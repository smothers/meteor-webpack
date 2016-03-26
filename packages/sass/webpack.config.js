var weight = 300;

function dependencies(settings) {
  return {
    devDependencies: {
      'sass-loader': '^3.1.2',
      'node-sass': '^3.4.2',
      "sass-resources-loader": "1.0.2"
    }
  };
}

function config(settings, require) {
  var plugins = [];
  var cssLoader;
  var config = settings.sassResources ? { "sassResources":settings.sassResources }  : {};

  if(settings.sassResources){
    cssLoader = settings.cssLoader + '!sass!sass-resources?' + JSON.stringify(settings.sass || {});
    console.log(cssLoader);
  }else {
    cssLoader = settings.cssLoader + '!sass?' + JSON.stringify(settings.sass || {});
    console.log(cssLoader);
  }

  if (settings.cssExtract) {
    var ExtractTextPlugin = require('extract-text-webpack-plugin');
    cssLoader = ExtractTextPlugin.extract(cssLoader);
  }

  return {
    loaders: [{ test: /\.scss$/, loader: cssLoader }],
    extensions: ['.scss'],
    config:config
  };
}