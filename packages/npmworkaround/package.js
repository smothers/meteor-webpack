Package.describe({
    name: 'webpack:npmworkaround',
    version: '0.1.0',
    summary: 'Internal package for webpack',
    git: 'https://github.com/thereactivestack/meteor-webpack.git',
    documentation: 'README.md'
});

Package.onUse(function(api) {
    api.versionsFrom('1.2');

    api.addFiles('npm-workaround.js', 'server');
    api.export('NpmWorkaround');
});
