if (Package['velocity:core']) {
  Meteor.call('velocity/isMirror', function(err, isMirror) {
    // Don't run with Velocity mirror
    if (isMirror) {
      return;
    }

    patchReload();
  });
} else {
  patchReload();
}

function patchReload() {
  // Never reload the page, Hot Module Replacement don't need to
  Reload._onMigrate(function () {
    return [false];
  });

  Meteor.startup(() => {
    // Use the script from the webpack dev server
    const target = Meteor.isCordova ? 'cordova' : 'web';
    const devServerOrigin = __WebpackDevServerConfig__.protocol + '//' + __WebpackDevServerConfig__.host + ':' + __WebpackDevServerConfig__.port;

    const scriptEl = document.createElement('script');
    scriptEl.type = 'text/javascript';
    scriptEl.src = `${devServerOrigin}/assets/${target}.js`;
    document.head.appendChild(scriptEl);
  });
}
