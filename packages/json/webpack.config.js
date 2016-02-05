var weight = 500;

function dependencies(settings) {
  return {
    devDependencies: {
      'json-loader' : '^0.5.4'
    }
  };
}

function config() {
  return {
    loaders: [{ test: /\.json$/, loader: 'json' }],
    extensions: ['.json']
  };
}
