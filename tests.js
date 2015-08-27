// Generated by LiveScript 1.4.0
(function(){
  var Backbone, h, _, abstractman, ubigraph, p;
  Backbone = require('backbone4000');
  h = require('helpers');
  _ = require('underscore');
  abstractman = require('./index');
  ubigraph = require('ubigraph');
  p = require('bluebird');
  exports.basic = function(test){
    var data, SM, sm;
    data = {};
    SM = abstractman.StateMachine.extend4000({
      state: 'init',
      states: {
        init: {
          children: {
            A: true,
            B: true
          },
          visit: function(){
            data.initVisit = true;
            return this.changeState('A');
          },
          leave: function(){
            return data.initLeave = true;
          }
        },
        A: {
          children: {
            B: true
          },
          visit: function(){
            data.Avisit = true;
            return this.changeState('B');
          },
          leave: function(){
            return data.Aleave = true;
          }
        },
        B: {
          visit: function(){
            test.deepEqual(data, {
              initVisit: true,
              initLeave: true,
              Avisit: true,
              Aleave: true
            });
            return test.done();
          }
        }
      }
    });
    sm = new SM();
    return sm.on('changestate', function(newStateName, oldStateName){
      return console.log('changestate', oldStateName, '->', newStateName);
    });
  };
  exports.promise = function(test){
    var events, SM, sm;
    events = [];
    SM = abstractman.PromiseStateMachine.extend4000({
      state: 'init',
      states: {
        init: {
          children: {
            A: true,
            B: true
          }
        },
        A: {
          children: {
            B: true,
            'error': 'error'
          }
        },
        B: {
          child: 'A'
        },
        error: true
      },
      state_init: function(){
        var this$ = this;
        return new p(function(resolve, reject){
          events.push('init');
          return h.wait(100, function(){
            return resolve({
              state: 'B',
              event: 8
            });
          });
        });
      },
      state_B: function(fromState, data){
        var this$ = this;
        return new p(function(resolve, reject){
          events.push('b');
          test.equals(data, 8);
          test.equals(fromState, 'init');
          return resolve('A');
        });
      },
      state_A: function(fromState, data){
        var this$ = this;
        return new p(function(resolve, reject){
          events.push('a');
          test.equals(data, void 8);
          test.equals(fromState, 'B');
          return reject(new Error('some error'));
        });
      },
      state_error: function(fromState, data){
        test.deepEqual(['init', 'b', 'a'], events);
        return test.done();
      }
    });
    sm = new SM();
    return sm.on('changestate', function(newStateName, oldStateName){
      return console.log('changestate', oldStateName, '->', newStateName);
    });
  };
}).call(this);
