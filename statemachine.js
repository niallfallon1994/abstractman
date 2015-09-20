// Generated by LiveScript 1.4.0
(function(){
  var _, h, Backbone, colors, State, initEvent, StateMachine, Mixins, PromiseStateMachine;
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
  initEvent = exports.initEvent = {
    init: true
  };
  StateMachine = exports.StateMachine = Backbone.Model.extend4000({
    stateClass: State,
    initialize: function(options){
      var name;
      options == null && (options = {});
      this._states = {};
      _.extend(this, options);
      if (name = options.state || this.state || this.get('state')) {
        return this.changeState(name, initEvent);
      }
    },
    getState: function(name){
      var stateInstance, stateDef, instantiate, this$ = this;
      if (stateInstance = this._states[name]) {
        return stateInstance;
      }
      stateDef = this.states[name];
      if (!stateDef) {
        throw new Error("state definition for " + name + " not found");
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
    executeState: function(prevStateName, newStateName, entryEvent, callback){
      var f, error;
      if (f = this['state_' + newStateName]) {
        try {
          return callback(void 8, f.call(this, entryEvent, prevStateName));
        } catch (e$) {
          error = e$;
          console.log("ERROR EXECUTING", newStateName, error);
          console.log(error.stack);
          return callback(error);
        }
      } else {
        return callback(void 8, entryEvent);
      }
    },
    parseExitEvent: function(state, data, cb){
      return cb(void 8, void 8, data);
    },
    changeState: function(newStateName, entryEvent){
      var this$ = this;
      return _.defer(function(){
        var prevStateName, prevState, ref$, newState;
        if (prevStateName = this$.state) {
          prevState = this$.getState(prevStateName);
          if (entryEvent !== initEvent && newStateName !== 'error' && !((ref$ = prevState.children) != null && ref$[newStateName])) {
            console.log("invalid state change " + prevStateName + " -> " + newStateName);
            throw new Error("invalid state change " + prevStateName + " -> " + newStateName);
          }
        }
        newState = this$.getState(newStateName);
        this$.state = newStateName;
        this$.trigger('prechangestate', newStateName, entryEvent, prevStateName);
        this$.trigger('pre_state_' + newStateName, entryEvent, prevStateName);
        return this$.executeState(prevStateName, newStateName, entryEvent, function(errEvent, exitEvent, nextStateName){
          if (errEvent) {
            if (newStateName !== 'error') {
              return this$.changeState('error', errEvent);
            } else {
              console.log("error changing state to error, avoiding loop", errEvent, errEvent.stack);
            }
          }
          return this$.parseExitEvent(newState, exitEvent, function(err, nextStateName, exitEvent){
            if (err) {
              console.log("error at state", newStateName);
              throw err;
            }
            this$.set({
              state: newStateName
            });
            this$.trigger('state_' + newStateName, exitEvent, prevStateName);
            this$.trigger('changestate', newStateName, exitEvent, prevStateName);
            if (this$.onChangeState) {
              this$.onChangeState(newStateName, exitEvent, prevStateName, entryEvent);
            }
            if (nextStateName) {
              return this$.changeState(nextStateName, exitEvent);
            }
          });
        });
      });
    }
  });
  Mixins = exports.Mixins = {};
  Mixins.exitEvent = {};
  Mixins.exitEvent.NextState = {
    parseExitEvent: function(state, data, cb){
      var children, childName, ref$;
      if ((children = _.keys(state.children)).length === 1) {
        childName = _.first(children);
        if (deepEq$(data, false, '===')) {
          return cb();
        } else {
          return cb(void 8, childName, data);
        }
      } else {
        if (!data) {
          return cb();
        }
        switch (data.constructor) {
        case String:
          if ((ref$ = state.children) != null && ref$[data]) {
            return cb(void 8, data);
          } else {
            return cb(void 8, void 8, data);
          }
          break;
        case Object:
          if (data.state) {
            return cb(void 8, data.state, data.data || data.event);
          } else {
            return cb(void 8, void 8, data);
          }
          break;
        default:
          return cb(void 8, void 8, data);
        }
      }
    }
  };
  PromiseStateMachine = exports.PromiseStateMachine = StateMachine.extend4000(Mixins.exitEvent.NextState, {
    executeState: function(prevStateName, newStateName, entryEvent, callback){
      var f, promise, error, this$ = this;
      if (f = this['state_' + newStateName]) {
        try {
          promise = f.call(this, entryEvent, prevStateName);
        } catch (e$) {
          error = e$;
          return callback(error);
        }
        if (promise.then != null) {
          return promise.then(function(it){
            return callback(void 8, it);
          }, function(error){
            return callback(error);
          });
        } else {
          return callback(void 8, promise);
        }
      } else {
        return callback(void 8, void 8);
      }
    }
  });
  function deepEq$(x, y, type){
    var toString = {}.toString, hasOwnProperty = {}.hasOwnProperty,
        has = function (obj, key) { return hasOwnProperty.call(obj, key); };
    var first = true;
    return eq(x, y, []);
    function eq(a, b, stack) {
      var className, length, size, result, alength, blength, r, key, ref, sizeB;
      if (a == null || b == null) { return a === b; }
      if (a.__placeholder__ || b.__placeholder__) { return true; }
      if (a === b) { return a !== 0 || 1 / a == 1 / b; }
      className = toString.call(a);
      if (toString.call(b) != className) { return false; }
      switch (className) {
        case '[object String]': return a == String(b);
        case '[object Number]':
          return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);
        case '[object Date]':
        case '[object Boolean]':
          return +a == +b;
        case '[object RegExp]':
          return a.source == b.source &&
                 a.global == b.global &&
                 a.multiline == b.multiline &&
                 a.ignoreCase == b.ignoreCase;
      }
      if (typeof a != 'object' || typeof b != 'object') { return false; }
      length = stack.length;
      while (length--) { if (stack[length] == a) { return true; } }
      stack.push(a);
      size = 0;
      result = true;
      if (className == '[object Array]') {
        alength = a.length;
        blength = b.length;
        if (first) {
          switch (type) {
          case '===': result = alength === blength; break;
          case '<==': result = alength <= blength; break;
          case '<<=': result = alength < blength; break;
          }
          size = alength;
          first = false;
        } else {
          result = alength === blength;
          size = alength;
        }
        if (result) {
          while (size--) {
            if (!(result = size in a == size in b && eq(a[size], b[size], stack))){ break; }
          }
        }
      } else {
        if ('constructor' in a != 'constructor' in b || a.constructor != b.constructor) {
          return false;
        }
        for (key in a) {
          if (has(a, key)) {
            size++;
            if (!(result = has(b, key) && eq(a[key], b[key], stack))) { break; }
          }
        }
        if (result) {
          sizeB = 0;
          for (key in b) {
            if (has(b, key)) { ++sizeB; }
          }
          if (first) {
            if (type === '<<=') {
              result = size < sizeB;
            } else if (type === '<==') {
              result = size <= sizeB
            } else {
              result = size === sizeB;
            }
          } else {
            first = false;
            result = size === sizeB;
          }
        }
      }
      stack.pop();
      return result;
    }
  }
}).call(this);
