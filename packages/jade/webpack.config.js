var weight = 500;

function dependencies(settings) {
  return {
    devDependencies: {
      'jade-loader' : '^0.8.0'
    }
  };
}

function config() {
  return {
    loaders: [{ test: /\.jade$/, loader: 'jade' }],
    extensions: ['.jade']
  };
}
