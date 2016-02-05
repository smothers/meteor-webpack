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
      'react-transform-hmr' : '^1.0.1',
      'react-transform-catch-errors': '^1.0.0',
      'redbox-react': '^1.2.0'
    }
  };
}

function config(settings) {
  var babelSettings = {
    presets: ['react', 'es2015', 'stage-0'],
    plugins: ['transform-decorators-legacy', 'add-module-exports']
  };

  if (settings.babel && settings.babel.plugins) {
    babelSettings.plugins = babelSettings.plugins.concat(settings.babel.plugins);
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

  return {
    loaders: [
      { test: /\.jsx?$/, loader: 'babel', query: babelSettings, exclude: /node_modules/ }
    ],
    extensions: ['.js', '.jsx'],
    externals: {
      'react-addons-transition-group': 'React.addons.TransitionGroup',
      'react-addons-css-transition-group': 'React.addons.CSSTransitionGroup',
      'react-addons-linked-state-mixin': 'React.addons.LinkedStateMixin',
      'react-addons-create-fragment': 'React.addons.createFrament',
      'react-addons-update': 'React.addons.update',
      'react-addons-pure-render-mixin': 'React.addons.PureRenderMixin',
      'react-addons-test-utils': 'React.addons.TestUtils',
      'react-addons-perf': 'React.addons.Perf'
    }
  };
}
