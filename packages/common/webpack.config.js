var weight = 200;

function dependencies(settings) {
  return {};
}

function config(settings, require) {
  var webpack = require('webpack');
  var plugins = [];

  // Only has to work for the Web (server doesn't need it and cordova can't load the common script first)
  if (settings.platform === 'web') {
    plugins.push(new webpack.optimize.CommonsChunkPlugin('common', settings.common.file || 'common.web.js'));
  }

  return {
    plugins: plugins
  };
}
