Package.describe({
    name: 'webpack:webpack',
    version: '0.1.0',
    summary: '',
    git: 'https://github.com/thereactivestack/meteor-webpack.git',
    documentation: 'README.md'
});

Package.registerBuildPlugin({
    name: 'webpack:webpack',
    use: [
      'meteor',
      'ecmascript'
    ],
    sources: [
      'plugin/WebpackCompiler.js',
      'plugin/webpack-plugin.js'
    ],
    npmDependencies: {
      'underscore': '1.8.3',
      'connect': '3.4.0',
      'cors': '2.7.1',
      'webpack': '1.12.2',
      'webpack-dev-middleware': '1.2.0',
      'webpack-hot-middleware': '2.4.1',
      'memory-fs': '0.2.0'
    }
});

Package.onUse(function(api) {
    api.versionsFrom('1.2');

    api.use('isobuild:compiler-plugin@1.0.0');
    api.use('webpack:reload@0.1.0');
});
