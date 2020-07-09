const spritesheet = require('spritesheet-js')
spritesheet('../images/*.png', {format: 'json'}, function(err) {
  if(err) throw err
  console.log('spritesheet success')
})
