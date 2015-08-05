// Generated by LiveScript 1.4.0
(function(){
  var graph, _, Backbone, h, State, StateMachine, slice$ = [].slice;
  graph = require('./graph');
  _ = require('underscore');
  Backbone = require('backbone4000');
  h = require('helpers');
  State = exports.State = graph.DirectedGraphNode.extend4000({
    defaults: {
      name: 'unnamed',
      visited: false,
      active: false
    },
    name: 'unnamed',
    initialize: function(options){
      return _.extend(this, options);
    },
    connectChildren: function(){
      var ref$, ref1$, this$ = this;
      if (((ref$ = this._children) != null ? ref$.constructor : void 8) === String) {
        this._children = [];
      }
      if (((ref1$ = this._children) != null ? ref1$.constructor : void 8) === Object) {
        this._children = _.keys(this._children);
      }
      if (this.child) {
        this._children = h.push(this._children, this.child);
      }
      return _.map(this._children || [], function(val, key){
        if (key.constructor !== Number) {
          val = key;
        }
        return this$.addChild(this$.root.states[val]);
      });
    },
    leave: function(toState, event){
      this.set({
        active: false
      });
      return this.trigger('leave', toState, event);
    },
    visit: function(fromState, event){
      this.set({
        visited: true,
        active: true
      });
      return this.trigger('visit', fromState, event);
    },
    changeState: function(){
      var args;
      args = slice$.call(arguments);
      return this.root.changeState.apply(this.root, args);
    },
    findChild: function(searchState){
      var newState;
      newState = (function(){
        switch (searchState != null && searchState.constructor) {
        case undefined:
          throw new Error("trying to change to undefined state from state " + this.name);
        case Number:
          return this.children.find(function(state){
            return state.n === searchState;
          });
        case String:
          return this.children.find(function(state){
            return state.name === searchState;
          });
        case Function:
          return this.children.find(function(state){
            return state === searchState;
          });
        default:
          throw new Error("wrong state search term constructor at " + this.name + ", (" + it + ")");
        }
      }.call(this));
      if (!newState) {
        throw new Error("I am \"" + this.name + "\", state not found in my children when using a search term \"" + searchState + "\"");
      }
    }
  });
  State.defineChild = function(){
    var classes, newState;
    classes = slice$.call(arguments);
    newState = this.prototype.rootClass.defineState.apply(this.prototype.rootClass, classes);
    this.addChild(newState.prototype.name);
    return newState;
  };
  State.addChild = function(name){
    return this.prototype.children = h.push(this.prototype.children, name);
  };
  StateMachine = exports.StateMachine = Backbone.Model.extend4000({
    stateClass: State,
    stateLength: 0,
    initialize: function(options){
      var this$ = this;
      this.stateN = {};
      this.states = h.dictMap(this.states || {}, function(state, name){
        var instantiate, stateInstance;
        instantiate = function(params){
          params == null && (params = {});
          return new (this$.stateClass.extend4000({
            name: name
          }, params))({
            root: this$
          });
        };
        stateInstance = (function(){
          switch (state.constructor) {
          case Function:
            return new state({
              root: this
            });
          case Boolean:
            return instantiate();
          case Object:
            return instantiate(state);
          default:
            throw new Error("state constructor is wrong (" + it + ")");
          }
        }.call(this$));
        return this$.stateN[stateInstance.n] = stateInstance;
      });
      _.map(this.states, function(state, name){
        return state.connectChildren();
      });
      if (this.startState) {
        return this.changeState(this.startState);
      }
    },
    changeState: function(toState, event){
      var fromState, f;
      if (fromState = this.get('state')) {
        toState = fromState.findChild(toState);
        fromState.leave();
      } else {
        toState = this.states[toState];
      }
      console.log(this.name, 'changestate', fromState != null ? fromState.name : void 8, '->', toState.name, 'event:', event);
      toState.visit(fromState, event);
      this.set({
        state: this.state = toState
      });
      this.trigger('state_' + toState.name, fromState, event);
      if (f = this[toState.name]) {
        f.call(this, fromState, event);
      }
      if (f = this['state_' + toState.name]) {
        f.call(this, fromState, event);
      }
      return this.trigger('changeState', toState, fromState, event);
    },
    ubigraph: function(stateName){
      var dontbrowserify, ubi;
      if (!stateName) {
        stateName = _.first(_.keys(this.states));
      }
      dontbrowserify = 'ubigraph';
      ubi = require(dontbrowserify);
      return ubi.visualize(this.states[stateName], function(node){
        return node.getChildren();
      }, function(node){
        return node.name;
      });
    }
  });
  StateMachine.defineState = function(){
    var classes, stateSubClass, stateLength;
    classes = slice$.call(arguments);
    classes.push({
      rootClass: this
    });
    stateSubClass = this.prototype.stateClass.extend4000.apply(this.prototype.stateClass, classes);
    stateLength = this.prototype.stateLength++;
    if (!stateSubClass.prototype.n) {
      stateSubClass.prototype.n = stateLength;
    }
    if (!this.prototype.states) {
      this.prototype.states = {};
    }
    return this.prototype.states[stateSubClass.prototype.name] = stateSubClass;
  };
  StateMachine.defineStates = function(){
    var states, this$ = this;
    states = slice$.call(arguments);
    return _.map(states, function(it){
      return this$.defineState(it);
    });
  };
}).call(this);
