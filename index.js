var through = require('through2');
var applySourceMap = require('vinyl-sourcemaps-apply');
var path = require('path');
var replaceExt = require('replace-ext');
var PluginError = require('plugin-error');

module.exports = function (opt) {
  function replaceExtension(path) {
    path = path.replace(/\.coffee\.md$/, '.litcoffee');
    return replaceExt(path, '.js');
  }

  function transform(file, enc, cb) {
    if (file.isNull()) return cb(null, file);
    if (file.isStream()) return cb(new PluginError('gulp-coffee', 'Streaming not supported'));

    var data;
    var str = file.contents.toString('utf8');
    var dest = replaceExtension(file.path);

    var options = Object.assign({
      bare: false,
      coffee: require('coffeescript'),
      header: false,
      sourceMap: !!file.sourceMap,
      sourceRoot: false,
      literate: /\.(litcoffee|coffee\.md)$/.test(file.path),
      filename: file.path,
      sourceFiles: [file.relative],
      generatedFile: replaceExtension(file.relative)
    }, opt);

    try {
      data = options.coffee.compile(str, options);
    } catch (err) {
      return cb(new PluginError('gulp-coffee', err));
    }

    if (data && data.v3SourceMap && file.sourceMap) {
      applySourceMap(file, data.v3SourceMap);
      file.contents = Buffer.from(data.js);
    } else {
      file.contents = Buffer.from(data);
    }

    file.path = dest;
    cb(null, file);
  }

  return through.obj(transform);
};
