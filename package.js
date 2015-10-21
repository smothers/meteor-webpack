Package.describe({
    name: 'webpack:webpack',
    version: '0.2.4',
    summary: 'Seamlessly integrate Webpack with Meteor build system',
    git: 'https://github.com/thereactivestack/meteor-webpack.git',
    documentation: 'README.md'
});

Package.registerBuildPlugin({
    name: 'webpack:webpack',
    use: [
      'meteor',
      'ecmascript@0.1.5',
      'webpack:npmworkaround@0.1.0'
    ],
    sources: [
      'plugin/WebpackSourceMapFix.js',
      'plugin/WebpackCompiler.js',
      'plugin/webpack-plugin.js'
    ],
    npmDependencies: {
      'underscore': '1.8.3',
      'connect': '3.4.0',
      'cors': '2.7.1',
      'npm': '3.3.8',
      'webpack': '1.12.2',
      'webpack-dev-middleware': '1.2.0',
      'webpack-hot-middleware': '2.4.1',
      'memory-fs': '0.2.0',
      'mime': '1.3.4',
      'shelljs': '0.5.3',
      'mkdirp': '0.5.1'
    }
});

Package.onUse(function(api) {
    api.versionsFrom('1.2');

    api.use('isobuild:compiler-plugin@1.0.0');
    api.use('webpack:reload@0.1.4');
});
