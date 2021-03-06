// Generated by LiveScript 1.4.0
(function(){
  var _, h, Backbone, colors, graph, State, GraphStateMachine, slice$ = [].slice;
  _ = require('underscore');
  h = require('helpers');
  Backbone = require('backbone4000');
  colors = require('colors');
  graph = require('./graph');
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
      return newState;
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
  GraphStateMachine = exports.GraphStateMachine = Backbone.Model.extend4000({
    stateClass: State,
    initialize: function(options){
      var stateName;
      this.smWakeup();
      if (this.initialize_) {
        this.initialize_(options);
      }
      stateName = (options != null ? options.state : void 8) || this.get('state') || this.state;
      if (stateName) {
        return this.changeState(stateName);
      }
    },
    smWakeup: function(stateName){
      var this$ = this;
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
        return stateInstance = (function(){
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
            throw new Error("state constructor is wrong (" + (typeof it != 'undefined' && it !== null) + ")");
          }
        }.call(this$));
      });
      _.map(this.states, function(state, name){
        return state.connectChildren();
      });
      this.on('change:state', function(self, stateName){
        return this$.changeState(stateName);
      });
      return this.trigger('smwakeup');
    },
    smSleep: function(){
      return this.trigger('smsleep');
    },
    changeState: function(toStateName, event){
      var fromState, toState;
      if (fromState = this.state) {
        toState = fromState.findChild(toStateName);
        fromState.leave();
      } else {
        toState = this.states[toStateName];
        if (!toState) {
          throw new Error(this.name + " can't find initial state \"" + toStateName + "\"");
        }
      }
      console.log(this.name, colors.green('changestate'), fromState != null ? fromState.name : void 8, '->', toState.name, 'event:', event);
      this.set({
        state: toState.name
      }, {
        silent: true
      });
      this.state = toState;
      toState.visit(fromState, event);
      return this.stateTriggers(toState.name, fromState != null ? fromState.name : void 8, event);
    },
    stateTriggers: function(toStateName, fromStateName, event){
      var f;
      if (f = this['state_' + toStateName]) {
        f.call(this, fromStateName, event);
      }
      this.trigger('changestate', toStateName, fromStateName, event);
      this.trigger('changestate:', toStateName, fromStateName, event);
      return this.trigger('state_' + toStateName, fromStateName, event);
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
  GraphStateMachine.mergers.push(Backbone.metaMerger.chainF('initialize_'));
  GraphStateMachine.defineState = function(){
    var classes, stateSubClass;
    classes = slice$.call(arguments);
    classes.push({
      rootClass: this
    });
    stateSubClass = this.prototype.stateClass.extend4000.apply(this.prototype.stateClass, classes);
    if (!this.prototype.states) {
      this.prototype.states = {};
    }
    return this.prototype.states[stateSubClass.prototype.name] = stateSubClass;
  };
  GraphStateMachine.defineStates = function(){
    var states, this$ = this;
    states = slice$.call(arguments);
    return _.map(states, function(it){
      return this$.defineState(it);
    });
  };
}).call(this);
