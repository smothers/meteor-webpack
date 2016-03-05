var weight = 200;

function dependencies(settings) {
  return {
    devDependencies: {
      'postcss-loader': '^0.8.1'
    }
  };
}

function config(settings, require) {
  var cssLoader = '';
  var loaders = [];
  var plugins = [];
  var moduleStr = ((settings.css && settings.css.module) ? 'module&' : '') + 'importLoaders=1&';

  var postcss = (settings.postcss || []).map(function(pluginName) {
    if (pluginName === 'postcss-import') {
      return require(pluginName)({ addDependencyTo: require('webpack') })
    }

    return require(pluginName);
  });

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
    loaders.push({ test: /\.css$/, loader: cssLoader + '!postcss' });
  }

  return {
    loaders: loaders,
    plugins: plugins,
    config: {
      postcss: postcss
    }
  };
}
