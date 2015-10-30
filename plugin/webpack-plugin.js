Plugin.registerCompiler({
  extensions: [
    'import.css', // Ignore CSS files that are going to be bundled with components
    'js', 'jsx', 'ts', 'tsx' // watch JavaScript and TypeScript files
  ],
  filenames: [
    'webpack.conf.js',
    'webpack.packages.json'
  ]
}, () => new WebpackCompiler());
