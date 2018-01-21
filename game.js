export default ({
    props = {},
    step = () => {},
    draw = () => {},
    fps = 60
  } = {}) => {
    const game = {
      entities: [],
      
      stepFn() {
        if (step.call(this) !== false) {
          this.entities.forEach(i => i.step && i.step())
        }
        this.key.pressed = []
        this.mouse.clicked = false
      },
      
      drawFn(ctx) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        if (draw.call(this, ctx) !== false) {
          this.entities.forEach(i => i.draw && i.draw(ctx))
        }
      },
      
      createEntity(entity) {
        this.entities.push(entity)
        return entity
      },
      
      remove(entity) {
        this.entities.splice(this.entities.indexOf(entity), 1)
      },
      
      key: {
        held: {},
        pressed: {}
      },
      
      mouse: {
        x: 0,
        y: 0,
        clicked: false
      },
      
      ...props
    }
    
    const start = () => {
      // get canvas context
      const canvas = document.getElementById('game')
      const ctx = canvas.getContext('2d')
      
      canvas.width = game.width = 800
      canvas.height = game.height = 600
      canvas.style.border = '3px solid black'
      game.mouse.x = game.width / 2
      game.mouse.y = game.height / 2
      
      // handle keyboard input
      window.onkeydown = ({ code }) => {
        if (!game.key.held[code]) {
          game.key.held[code] = game.key.pressed[code] = true
        }
      }
      window.onkeyup = ({ code }) => {
        game.key.held[code] = false
      }
      
      // handle mouse events
      window.onmousemove = ({ offsetX, offsetY }) => {
        game.mouse.x = offsetX
        game.mouse.y = offsetY
      }
      window.onclick = () => {
        game.mouse.clicked = true
      }
      
      // handle frames and steps
      const stepTime = 1000/fps
      let accumulator = 0
      let last = 0
      const frame = (time) => {
        accumulator += (time - last)
        last = time
        
        if (accumulator >= stepTime) {
          while (accumulator >= stepTime) {
            accumulator -= stepTime
            game.stepFn()
          }
          
          game.drawFn(ctx)
        }
        
        requestAnimationFrame(frame)
      }
      requestAnimationFrame(frame)
      
      return game
    }
    
    return start()
  }