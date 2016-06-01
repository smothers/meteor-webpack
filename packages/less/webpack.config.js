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

  if (settings.styles && settings.styles.sourceMap) {
    cssLoader += '?sourceMap';
  }

  // a loader without css-modules, used in case the settings have "modulesExcludes"
  var simpleCssLoader = 'style-loader!css-loader';

  if (settings.cssExtract) {
    var ExtractTextPlugin = require('extract-text-webpack-plugin');
    cssLoader = ExtractTextPlugin.extract('style', cssLoader);
  }
  
  var finalLoaders = [];
  var _mapRegex = function(stringArray) {
    var result = [];
    for (var i = 0, len = stringArray.length; i < len; i++) {
      result.push(new RegExp(stringArray[i]));
    }
    return result;
  };

  if (settings.css && settings.css.modules && settings.css.modulesExcludes) {
    finalLoaders.push({ test: /\.less$/, loader: cssLoader, exclude: _mapRegex(settings.css.modulesExcludes) });
    // add a simple css loader too with the same "include" option as the normal case will be to import final-compiled dist-files (which are .css)
    finalLoaders.push({ test: /\.css$/, loader: simpleCssLoader, include: _mapRegex(settings.css.modulesExcludes) });
  } else {
    finalLoaders.push({ test: /\.less$/, loader: cssLoader });
  }

  return {
    loaders: finalLoaders,
    extensions: ['.less']
  };
}
