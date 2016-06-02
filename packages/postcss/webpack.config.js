var weight = 210;

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

  // Add postcss support to LESS, SASS, stylus, ...
  settings.cssLoader += '!postcss';

  if (process.env.NODE_ENV !== 'production' && settings.styles && settings.styles.sourceMap) {
    settings.cssLoader += '?sourceMap';
  }

  var cssLoader = settings.cssLoader;

  if (settings.cssExtract) {
    var ExtractTextPlugin = require('extract-text-webpack-plugin');
    cssLoader = ExtractTextPlugin.extract('style', cssLoader);
  }

  var _mapRegex = function(stringArray) {
    var result = [];
    for (var i = 0, len = stringArray.length; i < len; i++) {
      result.push(new RegExp(stringArray[i]));
    }
    return result;
  };

  if (cssLoader) {
    if (settings.css && settings.css.modules && settings.css.modulesExcludes) {
      loaders.push({ test: /\.css$/, loader: cssLoader, exclude: _mapRegex(settings.css.modulesExcludes) });
    } else {
      loaders.push({ test: /\.css$/, loader: cssLoader });
    }
  }

  return {
    loaders: loaders,
    config: {
      postcss: postcss
    }
  };
}
