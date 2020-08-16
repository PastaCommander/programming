'use strict';


var ltpg = {

  // the Phaser game
  game:          null,

  // various bits of game state
  defaultWidth:  640,
  defaultHeight: 480,
  debug:         false,
  paused:        false,
  timeScale:     0,
  time:          0.0,
  absoluteTime:  window.performance.now(),
  lastFpsTime:   window.performance.now(),
  fps:           60.0,
  fpsText:      '60.0',


  // Creates the Phaser game.
  //
  // Also installs a `render` function if none is provided,
  // and wraps `create` and `update` to provide some debug
  // controls and to track FPS.

  createGame: function(w, h, funcsAndFlags) {
    ltpg.defaultWidth  = w
    ltpg.defaultHeight = h

    // find out if 'debugControls' was passed in, and if it's true
    var enableDebugControls = false

    if (funcsAndFlags.hasOwnProperty('debugControls')) {
      enableDebugControls = funcsAndFlags.debugControls
      delete funcsAndFlags.debugControls
    }

    // Supply our default debug rendering if they provide none.
    if (!funcsAndFlags.hasOwnProperty('render')) {
      funcsAndFlags.render = function() {
        if (!ltpg.debug)
          return

        var now = window.performance.now()

        if (now - ltpg.lastFpsTime > 250) { // update 4 times per second
          ltpg.lastFpsTime = now
          ltpg.fpsText = ltpg.fps.toFixed(1)
        }

        var text = ltpg.fpsText + ' fps'

        if (ltpg.paused)
          text += '   (paused)'
        else if (ltpg.timeScale !== 0)
          text += '   x' + Math.pow(1.5, ltpg.timeScale).toFixed(4)

        ltpg.game.debug.text(text, 2, 14)
      }
    }

    // Wrap `update` to pass in dt and to track FPS.
    var origUpdate = funcsAndFlags.update

    funcsAndFlags.update = function() {
      var now         = window.performance.now()
      var wallClockDT = (now - ltpg.absoluteTime) * 0.001

      if (wallClockDT > 1.0)
        wallClockDT = 0.0 // game must have been paused or something

      var gameDT = ltpg.paused ? 0.0 : Math.pow(1.5, ltpg.timeScale) * wallClockDT

      var fpsSnapshot = 1 / Math.max(wallClockDT, 0.001)
      var blendFactor = 3 / fpsSnapshot // average fps over time

      ltpg.absoluteTime = now
      ltpg.fps = Math.max(0.001, blendFactor * fpsSnapshot + (1-blendFactor) * ltpg.fps)

      ltpg.time += gameDT

      if (origUpdate)
        origUpdate(gameDT)
    }

    // Add input handling for debug controls.
    if (enableDebugControls) {
      var origCreate = funcsAndFlags.create

      funcsAndFlags.create = function() {
        ltpg.game.scale.fullScreenScaleMode = Phaser.ScaleManager.RESIZE

        // Add our own debug input handling.
        var keyboard = ltpg.game.input.keyboard

        keyboard.addKey(Phaser.Keyboard.D             ).onDown.add(ltpg.toggleDebug       , this)
        keyboard.addKey(Phaser.Keyboard.F             ).onDown.add(ltpg.toggleFullScreen  , this)
        keyboard.addKey(Phaser.Keyboard.SPACEBAR      ).onDown.add(ltpg.toggleGamePaused  , this)
        keyboard.addKey(Phaser.Keyboard.CLOSED_BRACKET).onDown.add(ltpg.incrementGameSpeed, this)
        keyboard.addKey(Phaser.Keyboard.OPEN_BRACKET  ).onDown.add(ltpg.decrementGameSpeed, this)
        keyboard.addKey(Phaser.Keyboard.EQUALS        ).onDown.add(ltpg.resetGameSpeed    , this)

        // Call the original `create` function, if it exists.
        if (origCreate)
          origCreate()
      }
    }

    // Now we're finally ready to create the Phaser game,
    // passing in the above functions.
    ltpg.game = new Phaser.Game(w, h, Phaser.AUTO, 'the_game', funcsAndFlags)

    return ltpg.game
  },


  // Add a few basic ways to manipulate the page
  // without having to touch the HTML file.

  setPageTitle: function(title) {
    $('title'     ).text(title)
    $('#the_title').text(title)
  },

  addSubTitle: function(subtitle) {
    $('#the_title').after('<h2>'+subtitle+'</h2>')
  },

  setPageColors: function(css_hash) {
    Object.keys(css_hash).forEach(function (key) { $('body').css(key, css_hash[key]) })
  },

  setPageFavicon: function(favicon_file) {
    $('head').append('<link href="'+favicon_file+'" rel="shortcut icon" type="image/x-icon" />')
  },

  addPageDescription: function(paragraph) {
    $('<p>').text(paragraph).appendTo('#the_description')
  },


  // These are the debug controls that we call,
  // assuming that enableDebugControls was passed into `ltpg.createGame()`

  toggleFullScreen: function() {
    if (ltpg.game.scale.isFullScreen)
      ltpg.game.scale.stopFullScreen()
    else
      ltpg.game.scale.startFullScreen()
  },

  toggleDebug: function() {
    ltpg.debug = !ltpg.debug

    if (!ltpg.debug)
      ltpg.game.debug.reset()
  },

  toggleGamePaused:   function() { ltpg.paused = !ltpg.paused },

  resetGameSpeed:     function() { ltpg.timeScale = 0         },

  incrementGameSpeed: function() { ltpg.timeScale++           },

  decrementGameSpeed: function() { ltpg.timeScale--           },

}

