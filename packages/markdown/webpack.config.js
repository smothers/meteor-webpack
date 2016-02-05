var weight = 500;

function dependencies(settings) {
  return {
    devDependencies: {
      'html-loader' : '^0.4.0',
      'markdown-loader': '^0.1.7'
    }
  };
}

function config() {
  return {
    loaders: [{ test: /\.md$/, loader: 'html!markdown' }],
    extensions: ['.md']
  };
}
