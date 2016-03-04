Package.describe({
    name: 'zaklampert:webpack-stylus',
    version: '1.0.1',
    summary: 'Integrate Stylus import with Webpack',
    git: 'https://github.com/zaklampert/webpack-stylus.git',
    documentation: 'README.md'
});

Package.onUse(function(api) {
  api.use('webpack:core-config@1.0.0');
  api.add_files(['webpack.config.js']);
});