Plugin.registerCompiler({
  extensions: [
    'import.css', // Ignore CSS files that are going to be bundled with components
    'js', // make sure js files are bundled with Webpack
    'jsx'
  ],
  filenames: [
    'webpack.conf.js'
  ]
}, () => new WebpackCompiler());
