var coffee = require('../');
var should = require('should');
var coffeescript = require('coffee-script');
var gutil = require('gulp-util');
var fs = require('fs');
require('mocha');

describe('gulp-coffee', function() {
  describe('coffee()', function() {
    it('should concat two files', function(done) {
      var stream = coffee({bare: true});
      var fakeFile = new gutil.File({
        path: "/home/contra/test/file.coffee",
        base: "/home/contra/test/",
        cwd: "/home/contra/",
        contents: new Buffer("a = 2")
      });

      var expected = coffeescript.compile(String(fakeFile.contents), {bare:true});
      stream.on('error', done);
      stream.on('data', function(newFile){
        should.exist(newFile);
        should.exist(newFile.path);
        should.exist(newFile.relative);
        should.exist(newFile.contents);

        newFile.path.should.equal("/home/contra/test/file.js");
        newFile.relative.should.equal("file.js");
        String(newFile.contents).should.equal(expected);
        done();
      });
      stream.write(fakeFile);
    });

    it('should emit errors correctly', function(done) {
      var stream = coffee({bare: true});
      var fakeFile = new gutil.File({
        path: "/home/contra/test/file.coffee",
        base: "/home/contra/test/",
        cwd: "/home/contra/",
        contents: new Buffer("if a()\r\n  then huh")
      });

      var expected = "";

      stream.on('error', function(err){
        err.message.indexOf(fakeFile.path).should.not.equal(-1);
        done();
      });
      stream.on('data', function(newFile){
        throw new Error("no file should have been emitted!");
      });
      stream.write(fakeFile);
    });

    it('should compile a file (no bare)', function(done) {
      var stream = coffee();
      var fakeFile = new gutil.File({
        path: "test/fixtures/grammar.coffee",
        base: "test/fixtures",
        cwd: "test/",
        contents: fs.readFileSync( 'test/fixtures/grammar.coffee' )
      });

      stream.on('error', done);
      stream.on('data', function(newFile){
        should.exist(newFile);
        should.exist(newFile.path);
        should.exist(newFile.relative);
        should.exist(newFile.contents);

        newFile.path.should.equal("test/fixtures/grammar.js");
        newFile.relative.should.equal("grammar.js");
        String(newFile.contents).should.equal(fs.readFileSync('test/expected/grammar.js', 'utf8'));
        done();
      });
      stream.write(fakeFile);
    });

    it('should compile a file (with bare)', function(done) {
      var stream = coffee({bare: true});
      var fakeFile = new gutil.File({
        path: "test/fixtures/grammar.coffee",
        base: "test/fixtures",
        cwd: "test/",
        contents: fs.readFileSync( 'test/fixtures/grammar.coffee' )
      });

      stream.on('error', done);
      stream.on('data', function(newFile){
        should.exist(newFile);
        should.exist(newFile.path);
        should.exist(newFile.relative);
        should.exist(newFile.contents);

        newFile.path.should.equal("test/fixtures/grammar.js");
        newFile.relative.should.equal("grammar.js");
        String(newFile.contents).should.equal(fs.readFileSync('test/expected/grammar-bare.js', 'utf8'));
        done();
      });
      stream.write(fakeFile);
    });

    it('should compile a literate file', function(done) {
      var stream = coffee({literate: true});
      var fakeFile = new gutil.File({
        path: "test/fixtures/journo.litcoffee",
        base: "test/fixtures",
        cwd: "test/",
        contents: fs.readFileSync( 'test/fixtures/journo.litcoffee' )
      });

      stream.on('error', done);
      stream.on('data', function(newFile){
        should.exist(newFile);
        should.exist(newFile.path);
        should.exist(newFile.relative);
        should.exist(newFile.contents);

        newFile.path.should.equal("test/fixtures/journo.js");
        newFile.relative.should.equal("journo.js");
        String(newFile.contents).should.equal(fs.readFileSync('test/expected/journo.js', 'utf8'));
        done();
      });
      stream.write(fakeFile);
    });

    it('should compile a literate file (with bare)', function(done) {
      var stream = coffee({literate: true, bare: true});
      var fakeFile = new gutil.File({
        path: "test/fixtures/journo.litcoffee",
        base: "test/fixtures",
        cwd: "test/",
        contents: fs.readFileSync( 'test/fixtures/journo.litcoffee' )
      });

      stream.on('error', done);
      stream.on('data', function(newFile){
        should.exist(newFile);
        should.exist(newFile.path);
        should.exist(newFile.relative);
        should.exist(newFile.contents);

        newFile.path.should.equal("test/fixtures/journo.js");
        newFile.relative.should.equal("journo.js");
        String(newFile.contents).should.equal(fs.readFileSync('test/expected/journo-bare.js', 'utf8'));
        done();
      });
      stream.write(fakeFile);
    });

    it('should pass through js files by default', function (done) {
      var stream = coffee();
      var fakeFile = new gutil.File({
        path: "test/fixtures/regular.js",
        base: "test/fixtures",
        cwd: "test/",
        contents: fs.readFileSync( 'test/fixtures/regular.js' )
      });

      stream.on('error', done);
      stream.on('data', function(newFile){
        should.exist(newFile);
        should.exist(newFile.path);
        should.exist(newFile.relative);
        should.exist(newFile.contents);

        newFile.path.should.equal("test/fixtures/regular.js");
        newFile.relative.should.equal("regular.js");
        String(newFile.contents).should.equal(fs.readFileSync('test/fixtures/regular.js', 'utf8'));
        done();
      });
      stream.write(fakeFile);
    });

    it('should pass through files that match an ignored pattern', function (done) {
      var stream = coffee({ignore: '*.me'});
      var fakeFile = new gutil.File({
        path: "test/fixtures/ignore.me",
        base: "test/fixtures",
        cwd: "test/",
        contents: fs.readFileSync( 'test/fixtures/ignore.me' )
      });

      stream.on('error', done);
      stream.on('data', function(newFile){
        should.exist(newFile);
        should.exist(newFile.path);
        should.exist(newFile.relative);
        should.exist(newFile.contents);

        newFile.path.should.equal("test/fixtures/ignore.me");
        newFile.relative.should.equal("ignore.me");
        String(newFile.contents).should.equal(fs.readFileSync('test/fixtures/ignore.me', 'utf8'));
        done();
      });
      stream.write(fakeFile);
    });
  });
});
