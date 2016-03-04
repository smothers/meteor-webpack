var weight = 100;

function dependencies() {
  return {
    dependencies: {
      // React has to be there for peerDependencies every though we are using the Meteor package
      'react': '~0.14.1',
    },
    devDependencies: {
      'babel': '^6.3.26',
      'babel-core': '^6.3.26',
      'babel-loader' : '^6.2.0',
      'babel-preset-react': '^6.3.13',
      'babel-preset-es2015': '^6.3.13',
      'babel-preset-stage-0': '^6.3.13',
      'babel-plugin-transform-decorators-legacy': '^1.3.2',
      'babel-plugin-add-module-exports': '^0.1.2',
      'babel-plugin-react-transform': '^2.0.0',
      'expose-loader': '^0.7.1',
      'react-transform-hmr' : '^1.0.1',
      'react-transform-catch-errors': '^1.0.0',
      'redbox-react': '^1.2.0'
    }
  };
}

function config(settings, require) {
  var fs = require('fs');
  var path = require('path');
  var babelSettings = {};

  var CWD = path.resolve('./');

  if (fs.existsSync(CWD + '/.babelrc')) {
    var babelrc = fs.readFileSync(CWD + '/.babelrc');
    babelSettings = JSON.parse(babelrc);
  }

  if (!babelSettings.presets) {
    babelSettings.presets = [];
  }

  if (!babelSettings.plugins) {
    babelSettings.plugins = [];
  }

  if (babelSettings.presets.indexOf('react') < 0) {
    babelSettings.presets.push('react');
  }

  if (babelSettings.presets.indexOf('es2015') < 0) {
    babelSettings.presets.push('es2015');
  }

  if (babelSettings.presets.indexOf('stage-0') < 0 &&
      babelSettings.presets.indexOf('stage-1') < 0 &&
      babelSettings.presets.indexOf('stage-2') < 0 &&
      babelSettings.presets.indexOf('stage-3') < 0) {
    babelSettings.presets.push('stage-0');
  }

  if (settings.babel && settings.babel.plugins) {
    babelSettings.plugins = babelSettings.plugins.concat(settings.babel.plugins);
  }

  if (babelSettings.plugins.indexOf('transform-decorators-legacy') < 0) {
    babelSettings.plugins.push('transform-decorators-legacy');
  }

  if (babelSettings.plugins.indexOf('add-module-exports') < 0) {
    babelSettings.plugins.push('add-module-exports');
  }

  if (settings.isDebug && settings.platform !== 'server') {
    var transforms = [{
      transform: 'react-transform-hmr',
      imports: ['react'],
      locals: ['module']
    }];

    if (settings.babel && !settings.babel.disableRedbox) {
      transforms.push({
        transform: 'react-transform-catch-errors',
        imports: ['react', 'redbox-react']
      });
    }

    babelSettings.plugins.push(['react-transform', { transforms: transforms }]);
  }

  var usingMeteorReact = settings.packages.indexOf('react-runtime') >= 0;
  var externals = {};
  var loaders = [
    { test: /\.jsx?$/, loader: 'babel', query: babelSettings, exclude: /\.meteor|node_modules/ }
  ];

  if (usingMeteorReact) {
    externals = {
      'react-addons-transition-group': 'React.addons.TransitionGroup',
      'react-addons-css-transition-group': 'React.addons.CSSTransitionGroup',
      'react-addons-linked-state-mixin': 'React.addons.LinkedStateMixin',
      'react-addons-create-fragment': 'React.addons.createFrament',
      'react-addons-update': 'React.addons.update',
      'react-addons-pure-render-mixin': 'React.addons.PureRenderMixin',
      'react-addons-test-utils': 'React.addons.TestUtils',
      'react-addons-perf': 'React.addons.Perf'
    };
  } else {
    // Expose window.React
    loaders.unshift({ test: /\/node_modules\/react\/react\.js$/, loader: 'expose?React' });
  }

  return {
    loaders: loaders,
    extensions: ['.js', '.jsx'],
    externals: externals
  };
}
