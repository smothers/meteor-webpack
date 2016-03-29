var weight = 300;

function dependencies(settings) {
  return {
    devDependencies: {
      'stylus-loader': '^1.5.1'
    }
  };
}

function config(settings, require) {
  var cssLoader = settings.cssLoader + '!stylus';

  if (settings.cssExtract) {
    var ExtractTextPlugin = require('extract-text-webpack-plugin');
    cssLoader = ExtractTextPlugin.extract(cssLoader);
  }
  var stylus = ((settings.stylus || []).reduce(function(prev,curr){
    var k = Object.keys(curr)[0];
    var v = curr[k];
    prev.use.push(require(k)());
    prev.import.push(v);
    return prev;
  }, { use: [], import:[] })  || { use: [], import:[] }) ;
  return {
    loaders: [{ test: /\.styl$/, loader: cssLoader }],
    extensions: ['.styl'],
    config : {
      stylus: stylus
    }
  };
}
