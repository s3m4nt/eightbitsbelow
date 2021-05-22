window.addEventListener('load', (event) => {
  console.log('dom loaded')

  // let gamePause = true

  // if (gamePause === 'true'){
  //   console.log();
  // }

  // Audio func via howler.js
  let sfx = {
    dead: new Howl({
      src: '../audio/dead1.mp3',
    }),
    trash: new Howl({
      src: '../audio/points.mp3',
    }),
    theme: new Howl({
      src: '../audio/main-theme.mp3',
    }),
  }

  // Restart button DOM
  let restart = document.getElementById('playAgain')
  restart.addEventListener('click', () => {
    // Reset scoreboard
    document.getElementById('score2').innerHTML = ''
    document.getElementById('score').innerHTML = ''
    // Restart game refresh loop
    window.cancelAnimationFrame(loopId)
    game()
  })

  // Move HERO logic w/ W A S D or arrows
  document.addEventListener('keydown', keyDownHandler, false)
  document.addEventListener('keyup', keyUpHandler, false)

  // Empty button variables
  let rightPressed = false
  let leftPressed = false
  let upPressed = false
  let downPressed = false

  function keyDownHandler(event) {
    if (event.key == 'd') {
      rightPressed = true
    } else if (event.key == 'a') {
      leftPressed = true
    }
    if (event.key == 'w') {
      upPressed = true
    } else if (event.key == 's') {
      downPressed = true
    }
  }

  function keyUpHandler(event) {
    if (event.key == 'd') {
      rightPressed = false
    } else if (event.key == 'a') {
      leftPressed = false
    }
    if (event.key == 'w') {
      upPressed = false
    } else if (event.key == 's') {
      downPressed = false
    }
  }

  // Create the game canvas
  var canvas = document.getElementById('canvas')
  var ctx = canvas.getContext('2d')
  canvas.width = 800
  canvas.height = 450

  // create new images and path
  let jacque = new Image()
  jacque.src = '../images/SubmarineJacquesYELLOW4.png'
  let fish = new Image()
  fish.src = '../images/Fish012.png'
  let foe = new Image()
  foe.src = '../images/PlasticBottle2.png'
  let seaFloor = new Image()
  seaFloor.src = '../images/SeaFloor.png'
  let seaTop = new Image()
  seaTop.src = '../images/SeaTop.png'
  // Collision graphics
  let bomb2 = new Image()
  bomb2.src = '../images/bomb2.png'
  let heart = new Image()
  heart.src = '../images/heart.png'

  // set loopid requestAnimationFrame to 0
  let loopId = 0

  //////////////
  // Main GAME function
  //////////////
  function game() {
    sfx.theme.stop()
    sfx.theme.play()
    document.getElementById('playAgain').style.backgroundColor =
      'rgb(137, 216, 245)'
    // jacque start point
    let jacqueX = 12
    let jacqueY = canvas.height / 2 - jacque.height / 2 - 25
    // fish start point
    let fishX = canvas.width + Math.random() * 500
    let fishY = Math.random() * canvas.height

    // PLAY!
    let gameState = 'PLAY'

    // FOE start point
    let foeX = canvas.width + Math.random() * 300
    let foeY = Math.random() * canvas.height

    // https://developer.mozilla.org/en-US/docs/Games/Anatomy#building_a_more_optimized_main_loop_in_javascript
    function main(tFrame) {
      // cancelanimationframe
      loopId = window.requestAnimationFrame(main)
      console.log(loopId)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      if (gameState === 'PLAY') {
        // Handle Jacque
        if (upPressed) {
          jacqueY -= 3
        } else if (downPressed) {
          jacqueY += 3
        }
        if (leftPressed) {
          jacqueX -= 3
        } else if (rightPressed) {
          jacqueX += 3
        }

        // https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
        if (
          jacqueX < foeX + 25 + foe.width &&
          jacqueX + jacque.width > foeX &&
          jacqueY < foeY + foe.height &&
          jacqueY + jacque.height > foeY
        ) {
          // gameState = 'WIN'
          gameState = 'WIN'
          gamePoints = 0
          console.log('foe hit')
          sfx.trash.play()
          sfx.theme.stop()
          document.getElementById('playAgain').style.backgroundColor = 'red'
          document.getElementById('score').innerHTML = gamePoints + 10
        }

        if (
          jacqueX < fishX + fish.width &&
          jacqueX + jacque.width > fishX &&
          jacqueY < fishY + fish.height &&
          jacqueY + jacque.height > fishY
        ) {
          gameState = 'LOSE'
          sfx.dead.play()
          sfx.theme.stop()
          document.getElementById('playAgain').style.backgroundColor = 'red'
          document.getElementById('score').innerHTML = 'U LOSE!!'
          document.getElementById('score2').innerHTML = ''
        }
      }
      // Handle trash / foe
      if (gameState === 'WIN') {
        ctx.drawImage(heart, foeX, foeY)
      } else if (gameState === 'PLAY') {
        foeX -= 2
        ctx.drawImage(foe, foeX, foeY)
      }

      // Handle fish
      if (gameState === 'LOSE') {
        ctx.drawImage(bomb2, fishX - 25, fishY)
        // sfx.dead.play()
      } else if (gameState === 'PLAY') {
        fishX -= 2
        ctx.drawImage(fish, fishX, fishY)
      }

      // Draw J
      ctx.drawImage(jacque, jacqueX, jacqueY)

      drawImages()
    }
    main()

    // draw and place the static background images
    function drawImages() {
      ctx.drawImage(seaFloor, -1, 365, 832, 85)
      ctx.drawImage(seaTop, -1, 0, 832, 15)
    }
  }
  game()
})
