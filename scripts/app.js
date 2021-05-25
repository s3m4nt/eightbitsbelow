window.addEventListener('DOMContentLoaded', (event) => {
  console.log('dom loaded')

  // Audio func via howler.js

  const muteBtn = document.querySelector('.mute')
  muteBtn.onclick = function () {
    sfx.theme.mute(true)
    sfx.trash.mute(true)
    sfx.dead.mute(true)
  }

  const unmuteBtn = document.querySelector('.unmute')
  unmuteBtn.onclick = function () {
    sfx.theme.mute(false)
    sfx.trash.mute(false)
    sfx.dead.mute(false)
  }

  let sfx = {
    dead: new Howl({
      src: './audio/dead1.mp3',
      volume: 0.5,
    }),
    trash: new Howl({
      src: './audio/points.mp3',
      volume: 0.4,
    }),
    theme: new Howl({
      src: './audio/main-theme.mp3',
      volume: 0.4,
    }),
  }

  // Restart button DOM
  let restart = document.getElementById('playAgain')
  restart.addEventListener('click', () => {
    // Reset scoreboard
    document.getElementById('scoreboard').innerHTML = 'Score: 0'

    // Restart game refresh loop
    window.cancelAnimationFrame(loopId)
    game()
  })

  // Move j logic w/ W A S D or arrows
  document.addEventListener('keydown', keyDownHandler, false)
  document.addEventListener('keyup', keyUpHandler, false)

  // Empty button variables
  let rightPressed = false
  let leftPressed = false
  let upPressed = false
  let downPressed = false

  function keyDownHandler(event) {
    if (event.key == 'd' || event.key == 'ArrowRight') {
      rightPressed = true
    } else if (event.key == 'a' || event.key == 'ArrowLeft') {
      leftPressed = true
    }
    if (event.key == 'w' || event.key == 'ArrowUp') {
      upPressed = true
    } else if (event.key == 's' || event.key == 'ArrowDown') {
      downPressed = true
    }
  }

  function keyUpHandler(event) {
    if (event.key == 'd' || event.key == 'ArrowRight') {
      rightPressed = false
    } else if (event.key == 'a' || event.key == 'ArrowLeft') {
      leftPressed = false
    }
    if (event.key == 'w' || event.key == 'ArrowUp') {
      upPressed = false
    } else if (event.key == 's' || event.key == 'ArrowDown') {
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
  jacque.src = './images/SubmarineJacquesYELLOW4.png'
  let fish = new Image()
  fish.src = './images/Fish012.png'
  let plastic = new Image()
  plastic.src = './images/PlasticBottle2.png'
  let seaFloor = new Image()
  seaFloor.src = './images/SeaFloor.png'
  let seaTop = new Image()
  seaTop.src = './images/SeaTop.png'
  // Collision graphics
  let bomb2 = new Image()
  bomb2.src = './images/bomb2.png'
  let heart = new Image()
  heart.src = './images/heart.png'

  // draw and place the static background images
  function drawImages() {
    ctx.drawImage(seaFloor, -1, 365, 832, 85)
    ctx.drawImage(seaTop, -1, 0, 832, 15)
  }
  // set loopid requestAnimationFrame to 0
  let loopId = 0

  //////////////////////////////////////////
  //////////// GAME function
  //////////////////////////////////////////
  function game() {
    sfx.theme.stop()
    sfx.theme.play()
    document.getElementById('playAgain').style.backgroundColor =
      'rgb(137, 216, 245)'
    // jacque start point
    let jacqueX = 12
    let jacqueY = canvas.height / 2 - jacque.height / 2 - 25

    let heartX = -1000
    let heartY = -1000

    // fish start point

    // Random fish array
    let fishes = [
      {
        x: canvas.width + Math.random() * 400,
        y: Math.random() * canvas.height,
        hit: false,
      },
      {
        x: canvas.width + Math.random() * 400,
        y: Math.random() * canvas.height,
        hit: false,
      },
      // {
      //   x: canvas.width + Math.random() * 400,
      //   y: Math.random() * canvas.height,
      //   hit: false,
      // },
      // {
      //   x: canvas.width + Math.random() * 400,
      //   y: Math.random() * canvas.height,
      //   hit: false,
      // },
      // {
      //   x: canvas.width + Math.random() * 400,
      //   y: Math.random() * canvas.height,
      //   hit: false,
      // },
    ]

    let gameScore = 0

    // PLAY!
    let gameState = 'PLAY'

    // plastic start point
    let plasticX = canvas.width + Math.random() * 300
    let plasticY = Math.random() * canvas.height

    //////////////////////////////////////////
    //////////// main function
    //////////////////////////////////////////
    // https://developer.mozilla.org/en-US/docs/Games/Anatomy#building_a_more_optimized_main_loop_in_javascript

    function main(tFrame) {
      // REQUESTanimationframe
      loopId = window.requestAnimationFrame(main)
      // reset canvas context
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      if (gameState === 'PLAY') {
        // Handle Jacque speed
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
        // Collision logic
        // https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection

        // if j collides w plastic add points + heart
        if (
          jacqueX < plasticX + 25 + plastic.width &&
          jacqueX + jacque.width > plasticX &&
          jacqueY < plasticY + plastic.height &&
          jacqueY + jacque.height > plasticY
        ) {
          //
          console.log(`gameState = ${gameState}`)
          heartX = plasticX
          heartY = plasticY
          setTimeout(function () {
            heartX = -1000
            heartY = -1000
          }, 600)
          // ctx.drawImage(heart, jacqueX + jacque.width, jacqueY)

          plasticX = canvas.width + Math.random() * 300
          plasticY = Math.random() * canvas.height
          sfx.trash.play()
          gameScore += 10
          console.log(gameScore)
          document.getElementById(
            'scoreboard'
          ).innerHTML = `Score: ${gameScore}`
          if (gameScore >= 50) {
            gameState = 'WIN'
            console.log(`gameState = ${gameState}`)
            sfx.theme.stop()
            // fanfare sound here
            document.getElementById('scoreboard').innerHTML = 'You win!!'
            document.getElementById('playAgain').style.backgroundColor = 'red'
          }
        }

        for (fishData of fishes) {
          // if j hits fish
          if (
            jacqueX < fishData.x + fish.width &&
            jacqueX + jacque.width > fishData.x &&
            jacqueY < fishData.y + fish.height &&
            jacqueY + jacque.height > fishData.y
          ) {
            fishData.hit = true
            gameState = 'LOSE'
            console.log(`gameState = ${gameState}`)
            sfx.dead.play()
            sfx.theme.stop()
            document.getElementById('playAgain').style.backgroundColor = 'red'
            document.getElementById('scoreboard').innerHTML = 'U LOSE!!'
          }
        }
      }
      // game WIN else
      if (gameState === 'WIN') {
        ctx.drawImage(heart, plasticX, plasticY)
      } else if (gameState === 'PLAY') {
        plasticX -= 2
        ctx.drawImage(plastic, plasticX, plasticY)
        if (plasticX < -100) {
          plasticX = canvas.width + Math.random() * 300
          plasticY = Math.random() * canvas.height
        }
      }

      // Loop through fishes array
      for (fishData of fishes) {
        if (gameState === 'LOSE') {
          if (fishData.hit) ctx.drawImage(bomb2, fishData.x - 25, fishData.y)
          // sfx.dead.play()
        } else if (gameState === 'PLAY') {
          fishData.x -= 2
          ctx.drawImage(fish, fishData.x, fishData.y)
          if (fishData.x < -100) {
            fishData.x = canvas.width + Math.random() * 400
            fishData.y = Math.random() * canvas.height
          }
        }
      }
      // Draw J
      ctx.drawImage(jacque, jacqueX, jacqueY)
      ctx.drawImage(heart, heartX, heartY)

      drawImages()
    }
    main()
  }
  game()
  // sfx.theme.stop()
})
