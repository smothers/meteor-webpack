var weight = 500;

function dependencies(settings) {
  return {
    devDependencies: {
      'html-loader' : '^0.4.0'
    }
  };
}

function config() {
  return {
    loaders: [{ test: /\.html$/, loader: 'html' }],
    extensions: ['.html']
  };
}
