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

const IS_WINDOWS = process.platform === 'win32';
const CWD = process.cwd();
const ROOT_NPM = CWD + '/packages/npm-container/.npm/package/node_modules';

let IS_DEBUG = process.env.NODE_ENV !== 'production';

WebpackCompiler = class WebpackCompiler {
  processFilesForTarget(files, options) {
    // Waiting for the PR to be merged
    // https://github.com/meteor/meteor/pull/5448
    if (options) {
      IS_DEBUG = options.buildMode !== 'production';
    }

    const packageFiles = files.filter(file => file.getPackageName() !== null);

    if (packageFiles && packageFiles.length > 0) {
      throw new Error('You cannot use the webpack compiler inside a package');
    }

    const platform = files[0].getArch();
    const shortName =
      (platform.indexOf('cordova') >= 0) ?
        'cordova' :
        (platform.indexOf('web') >= 0) ? 'web' : 'server';

    let webpackConfig = {};
    const configFiles = files
      .filter(file => file.getBasename() === 'webpack.conf.js')
      // Sort by shallower files
      .sort((file1, file2) => file1.getPathInPackage().split('/').length - file2.getPathInPackage().split('/').length);

    if (configFiles.length === 0) {
      throw new Error('Missing webpack.conf.js file');
    }

    configFiles.forEach(configFile => {
      const filePath = configFile.getPathInPackage();
      const data = configFile.getContentsAsString();

      readWebpackConfig(webpackConfig, shortName, configFile, filePath, data);
    });

    const usingDevServer = IS_DEBUG && shortName !== 'server';

    prepareConfig(shortName, webpackConfig, usingDevServer);

    if (usingDevServer) {
      compileDevServer(shortName, configFiles, webpackConfig);
    } else {
      compile(shortName, configFiles, webpackConfig);
    }
  }
}

function readWebpackConfig(webpackConfig, target, file, filePath, data) {
  let module = { exports: {} };
  var fileSplit = filePath.split('/');
  fileSplit.pop();

  const __dirname = path.join(CWD, fileSplit.join('/'));
  const process = { env: { 'NODE_ENV': IS_DEBUG ? 'development' : 'production' } };

  const require = module => {
    if (module === 'webpack') {
      return Npm.require(module);
    }

    if (module === 'fs') {
      return Plugin.fs;
    }

    if (module === 'path') {
      return Plugin.path;
    }

    return NpmWorkaround.require(ROOT_NPM + '/' + module);
  };

  const Meteor = {
    isServer: target === 'server',
    isClient: target !== 'server',
    isCordova: target === 'cordova'
  };

  try {
    eval(data);

    // Make sure the entry path is relative to the correct folder
    if (module.exports && !module.exports.context && module.exports.entry) {
      module.exports.context = __dirname;
    }
  } catch(e) {
    file.error({
      message: e.message
    });
  }

  webpackConfig = _.extend(webpackConfig, module.exports);
}

function prepareConfig(target, webpackConfig, usingDevServer) {
  if (!webpackConfig.output) {
    webpackConfig.output = {};
  }

  if (IS_DEBUG) {
    webpackConfig.devtool = webpackConfig.devtool || 'cheap-eval-module-source-map';

    if (!webpackConfig.devServer) {
      webpackConfig.devServer = {};
    }

    webpackConfig.devServer.protocol = webpackConfig.devServer.protocol || 'http:';
    webpackConfig.devServer.host = webpackConfig.devServer.host || 'localhost';
    webpackConfig.devServer.port = webpackConfig.devServer.port || 3500;
  } else {
    webpackConfig.devtool = webpackConfig.devtool || 'source-map';
  }

  if (usingDevServer) {
    webpackConfig.entry = [
      'webpack-hot-middleware/client?path=' + webpackConfig.devServer.protocol + '//' + webpackConfig.devServer.host + ':' + webpackConfig.devServer.port + '/__webpack_hmr',
      webpackConfig.entry
    ];
  }

  if (!usingDevServer) {
    if (IS_DEBUG) {
      if (target === 'server') {
        webpackConfig.devtool = webpackConfig.devtool || 'cheap-module-source-map';
      } else {
        webpackConfig.devtool = webpackConfig.devtool || 'cheap-eval-module-source-map';
      }
    } else {
      webpackConfig.devtool = webpackConfig.devtool || 'source-map';
    }
  }

  webpackConfig.output.path = '/memory/webpack';
  webpackConfig.output.publicPath = IS_DEBUG ? webpackConfig.devServer.protocol + '//' + webpackConfig.devServer.host + ':' + webpackConfig.devServer.port + '/assets/' : '/assets/';
  webpackConfig.output.filename = target + '.js';

  if (!webpackConfig.resolve) {
    webpackConfig.resolve = {};
  }

  // Use meteorhacks:npm to get packages from NPM
  if (typeof webpackConfig.resolve.root === 'string') {
    webpackConfig.resolve.root = [webpackConfig.resolve.root, ROOT_NPM];
  } else if (typeof webpackConfig.resolve.root === 'object' && Array.isArray(webpackConfig.resolve.root)) {
    webpackConfig.resolve.root.push(ROOT_NPM);
  } else {
    webpackConfig.resolve.root = ROOT_NPM;
  }

  if (!webpackConfig.resolveLoader) {
    webpackConfig.resolveLoader = {};
  }

  // Same for the loaders
  if (typeof webpackConfig.resolveLoader.root === 'string') {
    webpackConfig.resolveLoader.root = [webpackConfig.resolveLoader.root, ROOT_NPM];
  } else if (typeof webpackConfig.resolveLoader.root === 'object' && Array.isArray(webpackConfig.resolveLoader.root)) {
    webpackConfig.resolveLoader.root.push(ROOT_NPM);
  } else {
    webpackConfig.resolveLoader.root = ROOT_NPM;
  }

  if (!webpackConfig.plugins) {
    webpackConfig.plugins = [];
  }

  webpackConfig.plugins.unshift(new webpack.optimize.DedupePlugin());

  webpackConfig.plugins.unshift(new webpack.DefinePlugin({
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

function compile(target, files, webpackConfig) {
  if (!configHashes[target] || _.some(files, file => !configHashes[target][file.getSourceHash()])) {
    compilers[target] = new webpack(webpackConfig);
    compilers[target].outputFileSystem = new MemoryFS();

    configHashes[target] = {};
    files.forEach(file => { configHashes[target][file.getSourceHash()] = true; });
  }

  const file = files[files.length - 1];
  const fs = compilers[target].outputFileSystem;
  let errors = null;

  Meteor.wrapAsync(done => {
    compilers[target].run(function(err, stats) {
      if (stats) {
        if (stats.hasErrors()) {
          errors = stats.toJson({ errorDetails: true }).errors;
        }

        // Save the chunk file names in the private folder of your project
        if (target === 'web') {
          if (!Plugin.fs.existsSync(CWD + '/private')) {
            Plugin.fs.mkdirSync(CWD + '/private');
          }

          Plugin.fs.writeFileSync(CWD + `/private/webpack.stats.json`, JSON.stringify(stats.toJson({ chunks: true })));
        }
      }

      if (err) {
        if (errors) {
          errors.unshift(err);
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
    const sourceMapPath = `/memory/webpack/${target}.js.map`;

    // We have to fix the source map until Meteor update source-map:
    // https://github.com/meteor/meteor/pull/5411

    let sourceMapData;
    let sourceMap;

    // In case the source map isn't in a file
    try {
      sourceMapData = fs.readFileSync(sourceMapPath);
    } catch(e) {}

    if (sourceMapData) {
      sourceMap = JSON.parse(sourceMapData.toString());
      WebpackSourceMapFix(sourceMap);
    }

    file.addJavaScript({
      path: target + '.js',
      data: fs.readFileSync(outputPath).toString(),
      sourceMap
    });

    if (!IS_DEBUG && target !== 'server') {
      addAssets(target, file, fs);
    }
  }
}

function addAssets(target, file, fs) {
  const assets = fs.readdirSync('/memory/webpack');

  for (let asset of assets) {
    if (asset !== target + '.js' && asset !== target + '.js.map') {
      const data = fs.readFileSync('/memory/webpack/' + asset);

      file.addAsset({
        path: 'assets/' + asset,
        data
      });
    }
  }
}

function compileDevServer(target, files, webpackConfig) {
  const file = files[files.length - 1];

  if (webpackConfig.devServer) {
    file.addJavaScript({
      path: 'webpack.conf.js',
      data: '__WebpackDevServerConfig__ = ' + JSON.stringify(webpackConfig.devServer) + ';'
    });
  }

  if (configHashes[target] && _.every(files, file => configHashes[target][file.getSourceHash()])) {
    // Webpack with Meteor doesn't detect file change on Windows
    // So we force the rebuild
    if (IS_WINDOWS) {
      // Meteor watch system is too fast!
      setTimeout(() => {
        devServerMiddleware[target].invalidate();
      }, 100);
    }

    return;
  }

  configHashes[target] = {};
  files.forEach(file => { configHashes[target][file.getSourceHash()] = true; });

  if (!devServerApp) {
    devServerApp = connect();
    devServerApp.use(cors());

    http.createServer(devServerApp).listen(webpackConfig.devServer.port);
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
    stats: { colors: true }
  });

  devServerHotMiddleware[target] = Npm.require('webpack-hot-middleware')(compiler);

  devServerApp.use(devServerMiddleware[target]);
  devServerApp.use(devServerHotMiddleware[target]);
}

(function checkSymbolicLink() {
  // Babel plugins absolutely need this symbolic link to work
  if (!fs.existsSync(CWD + '/node_modules')) {
    fs.symlinkSync('packages/npm-container/.npm/package/node_modules', 'node_modules', 'dir');
  }
})();
