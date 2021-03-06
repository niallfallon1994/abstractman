require! {
  backbone4000: Backbone
  helpers: h
  underscore: _
}

metaPlug = (cls) ->
  makePlugFunctions = (options, name) ~>
    if options@@ isnt Object then options = {}
    
    options = _.extend { singular: name }, options    
    cls::['push' + h.capitalize options.singular] = cls::['push' + h.capitalize name] = cls::['add' + h.capitalize options.singular] = cls::['add' + h.capitalize name] = (obj) -> @plugPush(name,obj)
    cls::['pop' + h.capitalize options.singular] = (obj) -> @plugPop(name,obj)
    cls::['get' + h.capitalize name] = (obj) -> @plugGet(name)
    
  if cls::plugs then h.dictMap cls::plugs, makePlugFunctions
  return cls

GraphNode = exports.GraphNode = Backbone.Model.extend4000(
  name: 'graphnode'
  mergers: [ Backbone.metaMerger.mergeDict('plugs') ]
  transformers: [ metaPlug ]

  initialize: (options) ->
    if options.name then @name = options.name
      
    @plugs = h.dictmap (@plugs or {}), (options,name) ~>
      c = new Backbone.Collection()
      if @[name] then @["_" + name] = @[name]
      @[name] = c
      c
    
  plugPush: (plug,obj) -> @plugs[plug].push obj
  plugPop: (plug) -> @plugs[plug].pop()
  plugGet: (plug) -> @plugs[plug].models
)


DirectedGraphNode = exports.DirectedGraphNode = GraphNode.extend4000(
  plugs: {
    parents: { singular: 'parent' }
    children: { singular: 'child' }
  })

