var es = require('event-stream');
var coffee = require('coffee-script');
var gutil = require('gulp-util');
var formatError = require('./lib/formatError');
var Buffer = require('buffer').Buffer;
var match = require('minimatch');
var path = require('path');
var defaults = require('defaults');

module.exports = function(opt){
  var options = defaults(opt, {
    ignore: '*.js',
    bare: false,
    literate: false,
    sourceMap: false
  });

  function modifyFile(file){
    if (file.isNull() || match(path.basename(file.path), options.ignore)) return this.emit('data', file); // pass along
    if (file.isStream()) return this.emit('error', new Error("gulp-coffee: Streaming not supported"));

    var str = file.contents.toString('utf8');

    try {
      file.contents = new Buffer(coffee.compile(str, options));
    } catch (err) {
      var newError = formatError(file, err);
      return this.emit('error', newError);
    }
    file.path = gutil.replaceExtension(file.path, ".js");
    this.emit('data', file);
  }

  return es.through(modifyFile);
};
