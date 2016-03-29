Plugin.registerCompiler({
  extensions: [
    'import.css', // Ignore CSS files that are going to be bundled with components
    'import.html', // So that you can import html files and still use static-html / blaze packages
    'js', 'jsx', 'ts', 'tsx', 'coffee', 'vue' // watch JavaScript, CoffeeScript and TypeScript files
  ],
  filenames: [
    'webpack.json',
    'webpack.conf.js',
    'webpack.packages.json'
  ]
}, () => new WebpackCompiler());
