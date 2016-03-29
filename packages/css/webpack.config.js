var weight = 200;

function dependencies(settings) {
  return {
    devDependencies: {
      'style-loader' : '^0.13.0',
      'css-loader': '^0.23.0',
      'extract-text-webpack-plugin': '^0.9.1'
    }
  };
}

function config(settings, require) {
  var cssLoader = '';
  var loaders = [];
  var plugins = [];

  // Disable if webpack:postcss is present
  var moduleStr = (settings.css && settings.css.module) ? 'module&' : '';

  if (settings.isDebug) {
    if (settings.platform === 'server') {
      settings.cssLoader = 'css/locals?' + moduleStr + 'localIdentName=[name]__[local]__[hash:base64:5]';
    } else {
      settings.cssLoader = 'style!css?' + moduleStr + 'localIdentName=[name]__[local]__[hash:base64:5]';
    }
  } else {
    if (settings.platform === 'server') {
      settings.cssLoader = 'css/locals?' + moduleStr + 'localIdentName=[hash:base64:5]';
    } else {
      settings.cssLoader = 'css?' + moduleStr + 'localIdentName=[hash:base64:5]';
      settings.cssExtract = true;
    }
  }

  var cssLoader = settings.cssLoader;

  if (settings.cssExtract) {
    var ExtractTextPlugin = require('extract-text-webpack-plugin');
    plugins.push(new ExtractTextPlugin('style.css'));
    cssLoader = ExtractTextPlugin.extract('style', cssLoader);
  }

  // Let postcss control CSS files if it is there
  if (cssLoader && settings.packages.indexOf('webpack:postcss') < 0) {
    loaders.push({ test: /\.css$/, loader: cssLoader });
  }

  return {
    loaders: loaders,
    plugins: plugins,
    extensions: ['.css']
  };
}
