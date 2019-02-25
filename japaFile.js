// Load ts-node
require('ts-node').register()

const { configure } = require('japa')
configure({
  files: [ 'test/*.ts' ]
})
