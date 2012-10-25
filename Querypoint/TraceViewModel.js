
 // Google BSD license http://code.google.com/google_bsd_license.html
// Copyright 2012 Google Inc. johnjbarton@google.com

(function() {
  window.Querypoint = window.Querypoint || {};
  
  Querypoint.TraceViewModel = function(root) {
    // Model
    this._root = root;
    this._tracesByTree = [];
    // ViewModel
    this._currentTreeIndex = ko.observable();
    this._currentTree = ko.computed({
      read: function() {
        var index = this._currentTreeIndex(); // we need to call the observable to trigger dependency
        return (typeof index === 'number') ? this._tracesByTree[index] : undefined;
      }.bind(this),
      deferEvaluation: true
    });
    this._currentTraces = ko.computed({
      read: function() {
        var tree = this._currentTree();
        return tree ? tree.location.trace : undefined;
      }.bind(this),
      deferEvaluation: true
    });
    this._currentOffsets = ko.computed({
      read: function() {
        var tree = this._currentTree();
        if (!tree) return;
        var location = tree.location;
        return location.start.offset + '-' + location.end.offset;
      }.bind(this),
      deferEvaluation: true
    });
    
    ko.applyBindings(this, document.querySelector('.QPOutput'));
  }
  
  Querypoint.TraceViewModel.prototype = {
    
    setModel: function(tree) {
      if (!tree.location || !tree.location.trace) {
        console.warn("Don't call setModel without a tree.location.trace!");
        return;
      }
      var index = this._tracesByTree.indexOf(tree);
      if (index !== -1) {
        this._currentTreeIndex(index);
      } else {
        this._currentTreeIndex(this._tracesByTree.push(tree) - 1);
      }
    }
  };
}());