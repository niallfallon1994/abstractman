// Generated by LiveScript 1.4.0
(function(){
  var Backbone, h, _, abstractMan, ubigraph, testone;
  Backbone = require('backbone4000');
  h = require('helpers');
  _ = require('underscore');
  abstractMan = require('./index');
  ubigraph = require('ubigraph');
  testone = function(){
    var A, B, C;
    A = new abstractMan.DirectedGraphNode({
      name: 'A'
    });
    B = new abstractMan.DirectedGraphNode({
      name: 'B'
    });
    C = new abstractMan.DirectedGraphNode({
      name: 'C'
    });
    console.log(A.pushChild);
    A.pushChild(B);
    B.pushChild(C);
    return ubigraph.visualize(A, function(node){
      return node.getChildren();
    }, function(node){
      return node.name;
    });
  };
  testone();
}).call(this);
