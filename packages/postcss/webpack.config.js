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
    if (typeof pluginName === 'string') {
      if (pluginName === 'postcss-import') {
        return require(pluginName)({ addDependencyTo: require('webpack') })
      }

      return require(pluginName);
    }

    if (typeof pluginName === 'object' && Array.isArray(pluginName) && pluginName.length > 0) {
      if (pluginName.length === 1) {
        pluginName.push({});
      }

      if (pluginName[0] === 'postcss-import') {
        pluginName[1].addDependencyTo = require('webpack');
      }

      return require(pluginName[0])(pluginName[1]);
    }
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
