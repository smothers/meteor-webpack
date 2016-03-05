Package.describe({
    name: 'webpack:postcss',
    version: '1.0.1',
    summary: 'Integrate PostCSS (.css) import with Webpack',
    git: 'https://github.com/thereactivestack/meteor-webpack.git',
    documentation: 'README.md'
});

Package.onUse(function(api) {
  api.use('webpack:core-config@1.0.0');
  api.add_files(['webpack.config.js']);
});
