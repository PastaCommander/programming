'use strict';

(function() {

  // First, let's set up the page.

  ltpg.setPageTitle('Belt Maniac')

  ltpg.setPageColors({ color: '#C0C0C0', background: '#110555' })

  ltpg.setPageFavicon('favicon.ico')

  ltpg.addPageDescription('Use the right and left arrow keys' +
                          ' to move your ship. Look out for ' +
                          ' asteroids!')

  // Declare the variables we're going to share with the functions below.

  var NUM_ASTEROIDS    =  10
  var ASTEROID_RADIUS  =  20
  var SHIP_AGILITY     = 200
  var SHIP_RADIUS      =  35
  var SHIP_START_SPEED =  50
  var HIGH_SCORE_KEY   = 'spaceShip.highScore'

  var game = ltpg.createGame(500, 700, {
    preload:       preload,
    create:        create,
    update:        update,
    debugControls: false,
  })

  var ship = {
    gfx:      null,
    speed:    SHIP_START_SPEED,
    distance: 0,
  }

  var asteroids = []

  var scoreText
  var highScoreText

  var gamepad

  // Define the `preload` function, which will load our assets
  // before the `create` function is called.

  function preload () {
  }

  // Define the `create` function, which will be called once
  // when the game is created. Your setup code goes here.

  function create() {
    game.stage.backgroundColor = 0x000000 // black

    // Create the asteroids. We divide the canvas into rows,
    // one for each asteroid.
    var asteroidSpacing = game.height / NUM_ASTEROIDS

    for (var i = 0; i < NUM_ASTEROIDS; i++) {
      var x = game.rnd.realInRange(0, game.width)
      var y = i * asteroidSpacing

      // Don't let player start the game inside an asteroid!
      // Add half a screen of empty space by moving all asteroids up.
      y -= 0.5 * game.height

      var gfx = game.add.graphics(x, y)

      gfx.beginFill(0x806850, 1) // light brownish
      gfx.drawEllipse(0, 0, ASTEROID_RADIUS, ASTEROID_RADIUS+5)
      gfx.endFill()

      asteroids.push({
        gfx:       gfx,
        spinSpeed: game.rnd.realInRange(-1, 1),
      })
    }

    // Create the ship graphics.
    ship.gfx = game.add.graphics(game.width/2, game.height - 80)

    // Draw the darker wings of the spaceship.
    ship.gfx.beginFill(0x606060, 1) // darker grey
    ship.gfx.moveTo(  0, -25)
    ship.gfx.lineTo( 28,  14)
    ship.gfx.lineTo( 24,  20)
    ship.gfx.lineTo(-24,  20)
    ship.gfx.lineTo(-28,  14)
    ship.gfx.endFill()

    // Draw the lighter body of the spaceship.
    ship.gfx.beginFill(0x909090, 1) // lighter grey
    ship.gfx.drawRect( -12, -10, 24, 30)
    ship.gfx.drawEllipse(0, -10, 12, 17)
    ship.gfx.endFill()

    // Draw the cockpit of the spaceship.
    ship.gfx.lineStyle(1.5, 0x000000, 0.3) // 1.5px, faded black
    ship.gfx.beginFill(0xC0FFEE, 1) // light cyan, of course
    ship.gfx.drawEllipse(0, -10, 7, 12)
    ship.gfx.endFill()
    ship.gfx.lineStyle(0, 0, 0) // no line drawing

    // Draw the shield around the spaceship.
    ship.gfx.beginFill(0x80B0FF, 0.3) // faded blue/cyan
    ship.gfx.drawEllipse(0, 0, SHIP_RADIUS, SHIP_RADIUS)
    ship.gfx.endFill()

    // Create the text object for displaying the current score.
    scoreText = game.add.text(10, 10, 'Score: 0')
    scoreText.font     = 'Verdana'
    scoreText.fontSize = 14
    scoreText.fill     = 'white'

    // Create the text object for displaying the high score.
    highScoreText = game.add.text(game.width - 10, 10,
                                  'High Score: ' + getHighScore())
    highScoreText.font     = 'Verdana'
    highScoreText.fontSize = 14
    highScoreText.fill     = 'white'
    highScoreText.anchor.x = 1

    // Listen to the gamepad.
    game.input.gamepad.start()
    gamepad = game.input.gamepad.pad1
    gamepad.deadZone = 0.1
  }

  // Define the `update` function, which is called for every frame.

  function update(dt) {
    if (ltpg.paused)
      return

    // Update ship position and rotation based on
    // polling the arrow keys and the gamepad.

    var keyboard = game.input.keyboard
    var lStick   = gamepad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X)
    var xAxis    = 0

    // keyboard input
    if (keyboard.isDown(Phaser.Keyboard.LEFT))
      xAxis -= 1
    if (keyboard.isDown(Phaser.Keyboard.RIGHT))
      xAxis += 1

    // gamepad input
    if (gamepad.isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT))
      xAxis -= 1
    if (gamepad.isDown(Phaser.Gamepad.XBOX360_DPAD_RIGHT))
      xAxis += 1
    if (lStick)
      xAxis += lStick

    xAxis = game.math.clamp(xAxis, -1, 1)

    ship.gfx.x += xAxis * dt * SHIP_AGILITY
    ship.gfx.rotation = xAxis * 0.6

    // Make sure the ship stays inside the canvas.
    if (ship.gfx.x < SHIP_RADIUS)
      ship.gfx.x = SHIP_RADIUS
    if (ship.gfx.x > game.width - SHIP_RADIUS)
      ship.gfx.x = game.width - SHIP_RADIUS

    // Difficulty ramp-up: make sure the ship speeds up over time,
    // slowly increasing the difficulty of the game.
    ship.speed = (1 + ltpg.time/15) * SHIP_START_SPEED

    // Keep track of how far the ship has travelled, which we use
    // for scoring.
    ship.distance += dt * ship.speed

    // Determine and display the current score.
    var score = Math.floor(0.1 * ship.distance)
    scoreText.text = 'Score: ' + score

    // Update the asteroids. We want it to *feel* like the ship
    // is moving through an endless asteroid field. But instead
    // we just move the asteroids to create the illusion.
    for (var i = 0; i < asteroids.length; i++) {
      var asteroid = asteroids[i]

      asteroid.gfx.y        += dt * ship.speed
      asteroid.gfx.rotation += dt * asteroid.spinSpeed

      // If the asteroid has gone off the bottom of the canvas,
      // we move it to just above the top of the canvas and give
      // it a random x value, creating the illusion of
      // never-ending asteroids.
      if (asteroid.gfx.y > game.height + 50) {
        asteroid.gfx.y = -50
        asteroid.gfx.x = game.rnd.realInRange(0, game.width)
      }
    }

    // Check for collisions between the ship and the asteroids.
    // We start assuming no collisions, then check each asteroid.
    // If *any* asteroid collides, then this variable is set to
    // true.
    var collision = false

    for (var i = 0; i < asteroids.length; i++) {
      var asteroid = asteroids[i]

      var distance = game.math.distance(    ship.gfx.x,     ship.gfx.y,
                                        asteroid.gfx.x, asteroid.gfx.y)

      if (distance - SHIP_RADIUS - ASTEROID_RADIUS < -2)
        collision = true
    }

    // Handle a collision by pausing the game, changing the
    // background color, and possibly updating the high score.
    if (collision) {
      ltpg.paused = true
      game.stage.backgroundColor = 0x800000 // red

      if (score > getHighScore()) {
        localStorage.setItem(HIGH_SCORE_KEY, score)
        highScoreText.text = 'High Score: ' + getHighScore()
      }
    }
  }

  // Get the high score.

  function getHighScore() {
    return parseInt(localStorage.getItem(HIGH_SCORE_KEY)) || 0
  }

})()

