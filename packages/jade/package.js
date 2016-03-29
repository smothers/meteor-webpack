Package.describe({
    name: 'webpack:jade',
    version: '1.0.1',
    summary: 'Integrate Jade import (.jade) with Webpack',
    git: 'https://github.com/thereactivestack/meteor-webpack.git',
    documentation: 'README.md'
});

Package.onUse(function(api) {
  api.use('webpack:core-config@1.0.1');
  api.add_files(['webpack.config.js']);
});
