var detectPackages = function(code) {
  var rx = /\\usepackage(\[[^\]]+\])?{([^}]+)}/g;

  var res = rx.exec(code);
  var packages = [];
  while(res !== null) {
    packages.push(res[2]);
    res = rx.exec(code);
  }
  return packages;
};

var supported_packages = {
  "_basic_": [
    ['../website/texlive/texmf-dist/bibtex/bst/base/plain.bst', '/', 'plain.bst'],
  ],
};

window.TeXLive = function(bibtex) {

  this.compile = function(code, root, callback) {
    // var packages = detectPackages(code).concat(['_basic_']);
    
      bibtex.compile(code).then(function() {
        // bibtex.getFile('/', 'bibtex-input-file.pdf').then(function(pdf) {
        //   callback.apply(this, arguments);
        // });
      });

    // downloadPackages(bibtex, root, packages, function() {
    //   bibtex.compile(code).then(function() {
    //     // bibtex.getFile('/', 'bibtex-input-file.pdf').then(function(pdf) {
    //     //   callback.apply(this, arguments);
    //     // });
    //   });
    // });

    return this;
  }

  var downloadFiles = function(bibtex, root, files, callback) {
    var pending = files.length;
    var cb = function() {
      pending--;
      if(pending === 0)
        callback();
    }

    for(var i in files) {
      var f = files[i];
      f[0] = root+f[0];
      bibtex.addUrl.apply(bibtex, f).then(cb);
    }
  }

  var downloadPackages = function(bibtex, root, packages, callback) {
    var files = [];
    for(var i in packages) {
      var p = packages[i];
      var files_for_package = supported_packages[p];
      for(var j in files_for_package) {
        files.push(files_for_package[j]);
      }
    }

    var unique_files = [];
    for(var i in files) {
      var found = false;
      for(var j in unique_files) {
        if(unique_files[j][0] === files[i][0] &&
          unique_files[j][1] === files[i][1] &&
          unique_files[j][2] === files[i][2]) {
          found = true;
          break;
        }
      }
      if(!found)
        unique_files.push(files[i]);
    }
    downloadFiles(bibtex, root, unique_files, callback);
  }

  return this;
}


