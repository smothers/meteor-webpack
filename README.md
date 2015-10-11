Meteor pacakge to build your application using Webpack. Use hot module replacement (HMR) in development mode.

To try different examples or setup a new project, you can use the [kickstart projects](https://github.com/thereactivestack/kickstart).

# How does it work?
Every JavaScript files (.js) and CSS import files (.import.css) will be ignored by Meteor except webpack.conf.js. This is the file that will be configuring your build process. You need one for the server and one for the client.

One little difference is you don't need to specify the ouput or setup the hot module replacement (it will automatically in development).

Here is an example of a webpack.conf.js:

```javascript
var webpack = require('webpack');

module.exports = {
  entry: './entry',
  externals: {
    // Add global variables you would like to import
    'react': 'React'
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.json']
  },
  module: {
    loaders: [
      { test: /\.jsx?$/, loader: 'babel', query: { stage: 0 }, exclude: /node_modules/ }
    ]
  }
};
```

# Production
There is no way to know inside a Meteor compiler plugin if we are in production or development mode. You need to tell the webpack compiler by setting NODE_ENV at production.

You can use meteor run, meteor build, mup or anything working with Meteor.

# Run in production mode
`NODE_ENV=production meteor run --production`

# Build for production
`NODE_ENV=production meteor build .`

# Install
It is easier to start by cloning one of the [kickstart projects](https://github.com/thereactivestack/kickstart).

If you would like to create your own from scratch, here are the steps.

1. Setup the correct Meteor packages
```bash
meteor remove ecmascript # webpack will take care of it, you can't keep both
meteor add webpack:webpack
meteor add meteorhacks:npm # you absolutely need this to get the relevant NPM modules
```

2. Add the NPM modules your webpack config will need.

3. Add `webpack.conf.js` and your client entry file in a client folder.

4. Add `webpack.conf.js` and your server entry file in a server folder.

5. (optional) Add ios and/or android support
```bash
meteor add-platform ios
meteor add-platform android
```

# Troubleshooting

## Module build failed: ReferenceError: Unknown plugin "react-transform"
It seems like the babel plugins are not looking into the correct directory and their is no setting to fix that. However, what you can do is create a symbolic link in your project root to the correct folder:

`ln -s packages/npm-container/.npm/package/node_modules`

*Hopefully we will find a fix for this. It only applies to babel plugins.*
