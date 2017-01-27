var path = require('path');
var fs = require('fs');

var appDirectory = fs.realpathSync(process.cwd());
function resolveApp(relativePath) {
  return path.resolve(appDirectory, relativePath);
}

module.exports = {
    appBuild: resolveApp('build'),
    appSrc: resolveApp('src/client'),
    appPublic: resolveApp('public'),
    appHtml: resolveApp('public/index.html'),
    appIndexJs: resolveApp('src/client/index.js'),
    dataFile: resolveApp('src/api/datafile.db')
};