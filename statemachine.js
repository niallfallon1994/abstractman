// Generated by LiveScript 1.4.0
(function(){
  var _, h, Backbone, colors, State, StateMachine, PromiseStateMachine;
  _ = require('underscore');
  h = require('helpers');
  Backbone = require('backbone4000');
  colors = require('colors');
  State = Backbone.Model.extend4000({
    initialize: function(options){
      return _.extend(this, options);
    },
    changeState: function(name, event){
      return this.root.changeState(name, event);
    }
  });
  StateMachine = exports.StateMachine = Backbone.Model.extend4000({
    stateClass: State,
    initialize: function(options){
      var name, this$ = this;
      options == null && (options = {});
      this._states = {};
      _.extend(this, options);
      this.on('change:state', function(self, name){
        return this$.changeState(name);
      });
      if (name = options.state || this.state || this.get('state')) {
        return this.runTriggers(false, name, false);
      }
    },
    getState: function(name){
      var stateInstance, stateDef, instantiate, this$ = this;
      if (stateInstance = this._states[name]) {
        return stateInstance;
      }
      stateDef = this.states[name];
      if (!stateDef) {
        throw "state definition for " + name + " not found";
      }
      instantiate = function(def){
        def == null && (def = {});
        if (def.child) {
          def.children = {};
          def.children[def.child] = true;
          delete def.child;
        }
        return new this$.stateClass(_.extend({
          name: name,
          root: this$
        }, def));
      };
      stateInstance = (function(){
        switch (stateDef.constructor) {
        case Function:
          return new stateDef({
            root: this
          });
        case Boolean:
          return instantiate();
        case Object:
          return instantiate(stateDef);
        default:
          throw new Error("state constructor is wrong (" + (typeof it != 'undefined' && it !== null) + ")");
        }
      }.call(this));
      return this._states[name] = stateInstance;
    },
    changeState: function(newStateName, event){
      var this$ = this;
      return _.defer(function(){
        var prevStateName, prevState, ref$;
        console.log('changestate', newStateName);
        if (prevStateName = this$.state) {
          prevState = this$.getState(prevStateName);
          if (!((ref$ = prevState.children) != null && ref$[newStateName])) {
            throw new Error("invalid state change " + prevStateName + " -> " + newStateName);
          }
          if (prevState.leave) {
            prevState.leave(newStateName, event);
          }
          return _.defer(function(){
            return this$.runTriggers(prevStateName, newStateName, event);
          });
        }
      });
    },
    runTriggers: function(prevStateName, newStateName, event){
      var newState, f;
      newState = this.getState(newStateName);
      this.state = newStateName;
      this.trigger('changestate', newStateName, prevStateName, event);
      if (newState.visit) {
        newState.visit(prevStateName, event);
      }
      if (f = this['state_' + newStateName]) {
        return f.call(this, prevStateName, event);
      }
    }
  });
  PromiseStateMachine = exports.PromiseStateMachine = StateMachine.extend4000({
    runTriggers: function(prevStateName, newStateName, event){
      var newState, f, promise, this$ = this;
      newState = this.getState(newStateName);
      this.state = newStateName;
      this.trigger('changestate', newStateName, prevStateName, event);
      if (newState.visit) {
        newState.visit(prevStateName, event);
      }
      if (f = this['state_' + newStateName]) {
        if (promise = f.call(this, prevStateName, event)) {
          return promise.then(function(it){
            switch (it != null && it.constructor) {
            case String:
              return this$.changeState(it);
            case Object:
              return this$.changeState(it.state, it.event || it.data);
            default:
              throw Error("unknown response from promise: " + (typeof data != 'undefined' && data !== null));
            }
          }, function(e){
            console.log('catch', e);
            return this$.changeState('error', e);
          });
        }
      }
    }
  });
}).call(this);
