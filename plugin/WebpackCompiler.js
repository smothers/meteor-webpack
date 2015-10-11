const webpack = Npm.require('webpack');
const _ = Npm.require('underscore');
const MemoryFS = Npm.require('memory-fs');

const fs = Plugin.fs;
const path = Plugin.path;

const http = Npm.require('http');
const connect = Npm.require('connect');
const cors = Npm.require('cors');

let devServerApp = null;
let devServerMiddleware = {};
let devServerHotMiddleware = {};
let configHashes = {};

const IS_DEBUG = process.env.NODE_ENV !== 'production';
const CWD = process.cwd();
const ROOT_NPM = CWD + '/packages/npm-container/.npm/package/node_modules/node_modules';
const WEBPACK_PORT = process.env.WEBPACK_PORT || 3500;

WebpackCompiler = class WebpackCompiler {
  processFilesForTarget(files) {
    const packageFiles = files.filter(file => file.getPackageName() !== null);

    if (packageFiles && packageFiles.length > 0) {
      throw new Error('You cannot use the webpack compiler inside a package');
    }

    const platform = files[0].getArch();
    const configFile = _.find(files, file => file.getBasename() === 'webpack.conf.js');

    if (configFile) {
      const filePath = configFile.getPathInPackage();
      const data = configFile.getContentsAsString();
      const webpackConfig = getWebpackConfig(configFile, filePath, data);

      const shortName =
        (platform.indexOf('cordova') === 0) ?
          'cordova' :
          (platform.indexOf('web') === 0) ? 'web' : 'server';

      const usingDevServer = IS_DEBUG && shortName !== 'server';

      prepareConfig(shortName, webpackConfig, usingDevServer);

      if (usingDevServer) {
        compileDevServer(shortName, configFile, webpackConfig);
      } else {
        compile(shortName, configFile, webpackConfig);
      }
    }
  }
}

function getWebpackConfig(file, filePath, data) {
  let module = { exports: {} };
  var fileSplit = filePath.split('/');
  fileSplit.pop();

  const __dirname = path.join(CWD, fileSplit.join('/'));

  const require = Npm.require;

  try {
    eval(data);

    // Make sure the entry path is relative to the correct folder
    if (module.exports && !module.exports.context) {
      module.exports.context = __dirname;
    }
  } catch(e) {
    file.error({
      message: e.message
    });
  }

  return module.exports;
}

function prepareConfig(target, webpackConfig, usingDevServer) {
  if (usingDevServer) {
    webpackConfig.entry = ['webpack-hot-middleware/client?path=http://localhost:' + WEBPACK_PORT + '/__webpack_hmr', webpackConfig.entry];
  }

  if (!webpackConfig.output) {
    webpackConfig.output = {};
  }

  webpackConfig.output.path = '/memory/webpack';
  webpackConfig.output.publicPath = IS_DEBUG ? 'http://localhost:' + WEBPACK_PORT + '/assets/' : '/assets/';
  webpackConfig.output.filename = target + '.js';

  if (!webpackConfig.resolve) {
    webpackConfig.resolve = {};
  }

  // Use meteorhacks:npm to get packages from NPM
  webpackConfig.resolve.root = ROOT_NPM;

  if (!webpackConfig.resolveLoader) {
    webpackConfig.resolveLoader = {};
  }

  // Same for the loaders
  webpackConfig.resolveLoader.root = ROOT_NPM;

  if (!webpackConfig.plugins) {
    webpackConfig.plugins = [];
  }

  webpackConfig.plugins.shift(new webpack.optimize.DedupePlugin());

  webpackConfig.plugins.shift(new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(IS_DEBUG ? 'development' : 'production'),
    'Meteor.isClient': JSON.stringify(target !== 'server'),
    'Meteor.isServer': JSON.stringify(target === 'server'),
    'Meteor.isCordova': JSON.stringify(target === 'cordova')
  }));

  if (!IS_DEBUG) {
    // Production optimizations
    webpackConfig.plugins.push(new webpack.optimize.UglifyJsPlugin());
    webpackConfig.plugins.push(new webpack.optimize.OccurenceOrderPlugin());
  }

  if (usingDevServer) {
    webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
    webpackConfig.plugins.push(new webpack.NoErrorsPlugin());
  }
}

const compilers = {};

function compile(target, file, webpackConfig) {
  const sourceHash = file.getSourceHash();

  if (sourceHash !== configHashes[target]) {
    configHashes[target] = sourceHash;
    compilers[target] = new webpack(webpackConfig);
    compilers[target].outputFileSystem = new MemoryFS();
  }

  const fs = compilers[target].outputFileSystem;
  let errors = null;

  Meteor.wrapAsync(done => {
    compilers[target].run(function(err, stats) {
      if (stats && stats.hasErrors()) {
        errors = stats.toJson({ errorDetails: true }).errors;
      }

      if (err) {
        if (errors) {
          errors.shift(err);
        } else {
          errors = [err];
        }
      }

      done();
    });
  })();

  if (errors) {
    for (let error of errors) {
      file.error({
        message: error
      });
    }
  } else {
    const outputPath = webpackConfig.output.path + '/' + webpackConfig.output.filename;

    file.addJavaScript({
      path: target + '.js',
      data: fs.readFileSync(outputPath).toString()
    });

    if (!IS_DEBUG && target !== 'server') {
      addAssets(target, file, fs);
    }
  }
}

function addAssets(target, file, fs) {
  const assets = fs.readdirSync('/memory/webpack');

  for (let asset of assets) {
    if (asset !== target + '.js') {
      const data = fs.readFileSync('/memory/webpack/' + asset);

      file.addAsset({
        path: 'assets/' + asset,
        data
      });
    }
  }
}

function compileDevServer(target, file, webpackConfig) {
  const sourceHash = file.getSourceHash();

  if (sourceHash === configHashes[target]) {
    return;
  }

  configHashes[target] = sourceHash;

  if (!devServerApp) {
    devServerApp = connect();
    devServerApp.use(cors());

    http.createServer(devServerApp).listen(WEBPACK_PORT);
  }

  if (devServerMiddleware[target]) {
    devServerMiddleware[target].close();

    devServerApp.stack.splice(
      devServerApp.stack.indexOf(devServerMiddleware[target]),
      1
    );

    devServerApp.stack.splice(
      devServerApp.stack.indexOf(devServerHotMiddleware[target]),
      1
    );
  }

  const compiler = webpack(webpackConfig);

  devServerMiddleware[target] = Npm.require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath,
    stats: { colors: true },
    watchOptions: webpackConfig.watchOptions // {poll:true}
  });

  devServerHotMiddleware[target] = Npm.require('webpack-hot-middleware')(compiler);

  devServerApp.use(devServerMiddleware[target]);
  devServerApp.use(devServerHotMiddleware[target]);
}
