var weight = 300;

function dependencies(settings) {
  return {
    devDependencies: {
      'style-loader' : '^0.13.0',
      'css-loader': '^0.23.0',
      'sass-loader': '^3.1.2',
      'node-sass': '^3.4.2'
    }
  };
}

function config(settings, require) {
  var cssLoader = '';
  var loaders = [];
  var plugins = [];
  var moduleStr = (settings.css && settings.css.module) ? 'module&' : '';

  if (settings.isDebug) {
    if (settings.platform === 'server') {
      cssLoader = 'css/locals?' + moduleStr + 'localIdentName=[name]__[local]__[hash:base64:5]';
    } else {
      cssLoader = 'style!css?' + moduleStr + 'localIdentName=[name]__[local]__[hash:base64:5]';
    }
  } else {
    if (settings.platform === 'server') {
      cssLoader = 'css/locals?' + moduleStr + 'localIdentName=[hash:base64:5]';
    } else {
      var ExtractTextPlugin = require('extract-text-webpack-plugin');
      plugins.push(new ExtractTextPlugin('style.css'));
      cssLoader = ExtractTextPlugin.extract('style', 'css?' + moduleStr + 'localIdentName=[hash:base64:5]');
    }
  }

  if (cssLoader) {
    loaders.push({ test: /\.scss$/, loader: cssLoader + '!sass' });
  }

  return {
    loaders: loaders,
    plugins: plugins,
    extensions: ['.scss']
  };
}
