Package.describe({
    name: 'webpack:common',
    version: '1.0.1',
    summary: 'Add common script to your Webpack config',
    git: 'https://github.com/thereactivestack/meteor-webpack.git',
    documentation: 'README.md'
});

Package.onUse(function(api) {
  api.use('webpack:core-config@1.0.1');
  api.add_files(['webpack.config.js']);
});
