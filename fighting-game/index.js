const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.7

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: '/fighting-game-main/fighting-game-main/img/background.png',
})

const shop = new Sprite ({
    position: {
        x: 630,
        y: 128
    },
    imageSrc: '/fighting-game-main/fighting-game-main/img/shop.png',
    scale: 2.75, // Shop at ground level
    framesMax: 6
})

const player = new Fighter ({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0
    },
    imageSrc: '/fighting-game-main/fighting-game-main/img/samuraiMack/Idle.png',
    framesMax: 8,
    scale: 2.5,
    offset: {
        x: 155,
        y: 155
    },
    sprites: {
        idle: {
            imageSrc: '/fighting-game-main/fighting-game-main/img/samuraiMack/Idle.png',
            framesMax: 8 
        },
        run: {
            imageSrc: '/fighting-game-main/fighting-game-main/img/samuraiMack/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: '/fighting-game-main/fighting-game-main/img/samuraiMack/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: '/fighting-game-main/fighting-game-main/img/samuraiMack/Fall.png',
            framesMax: 2
        },
        attack1: {
            imageSrc: '/fighting-game-main/fighting-game-main/img/samuraiMack/Attack1.png',
            framesMax: 6
        },
        takeHit: {
            imageSrc: '/fighting-game-main/fighting-game-main/img/samuraiMack/Take Hit - white silhouette.png',
            framesMax: 4
        },
        death: {
            imageSrc: '/fighting-game-main/fighting-game-main/img/samuraiMack/Death.png',
            framesMax: 6
        }
      },
        attackBox: {
        offset: {
            x: 50,
            y: 160
        },
        width: 160,
        height: 50
    }
})

const enemy = new Fighter ({
    position: {
        x: 400,
        y: 100
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: 'blue',
    offset: {
        x: -50,
        y: 0
    },
    imageSrc: '/fighting-game-main/fighting-game-main/img/kenji/Idle.png',
    framesMax: 4,
    scale: 2.2,
    offset: {
        x: 155,
        y: 133
    },
    sprites: {
        idle: {
            imageSrc: '/fighting-game-main/fighting-game-main/img/kenji/Idle.png',
            framesMax: 4
        },
        run: {
            imageSrc: '/fighting-game-main/fighting-game-main/img/kenji/Run.png',
            framesMax: 8,
        },
        jump: {
            imageSrc: '/fighting-game-main/fighting-game-main/img/kenji/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: '/fighting-game-main/fighting-game-main/img/kenji/Fall.png',
            framesMax: 2
        },
        attack1: {
            imageSrc: '/fighting-game-main/fighting-game-main/img/kenji/Attack1.png',
            framesMax: 4
        },
        takeHit: {
            imageSrc: '/fighting-game-main/fighting-game-main/img/kenji/Take hit.png',
            framesMax: 3
        },
        death: {
            imageSrc: '/fighting-game-main/fighting-game-main/img/kenji/Death.png',
            framesMax: 7
        }
      },
    attackBox: {
        offset: {
            x: 50,
            y: -120
        },
        width: 110,
        height: 50
    }
})

console.log(player)

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    }
}

decreaseTimer()

function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    shop.update()
    c.fillStyle = 'rgba(255, 255,255, .15)'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    enemy.update()
    player.velocity.x = 0
    enemy.velocity.x = 0

    // player movement
  
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5
        player.switchSprite('run')
    } else if (keys.d.pressed && player.lastKey === 'd') {    
        player.velocity.x = 5
        player.switchSprite('run')
    } else {
        player.switchSprite('idle')
    }

    // jumping
    if (player.velocity.y < 0) {
        player.switchSprite('jump')
    } else if (player.velocity.y > 0) {
        player.switchSprite('fall')
    }

    // enemy movement
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5
        enemy.switchSprite('run')
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 5
        enemy.switchSprite('run')
    } else {
        enemy.switchSprite('idle')
    }

    // enemy jump 
    if (enemy.velocity.y < 0) {
        enemy.switchSprite('jump')
    } else if (enemy.velocity.y > 0) {
        enemy.switchSprite('fall')
    }

    // detect for collision & enemy gets hits
    if (
        rectangularCollision({
            rectangle1: player,
            rectangle2: enemy
        }) &&
        player.isAttacking &&
        player.isAttacking && player.framesCurrent === 4
    ) {
        enemy.takeHit()
        player.isAttacking = false

        gsap.to('#enemyHealth', {
            width: enemy.health + '%'
        })
    }

    // if player misses
    if (player.isAttacking && player.framesCurrent === 4) {
        player.isAttacking = false
    }

    // this is where a plyr gets hit
    if (
        rectangularCollision({
            rectangle1: enemy,
            rectangle2: player
        }) &&
        enemy.isAttacking &&
        enemy.framesCurrent === 2
    ) {
        player.takeHit()
        enemy.isAttacking = false
        gsap.to('#playerHealth', {
            width: player.health + '%'
        })
    }

    // if enemy misses
    if (enemy.isAttacking && enemy.framesCurrent === 2) {
        enemy.isAttacking = false
    }

    // end game based on health
    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({ player, enemy, timerId })
    }
}

animate()

window.addEventListener('keydown', (event) => {
    if (!player.dead) {
    switch (event.key) {
        case 'd':
            keys.d.pressed = true
            player.lastKey = 'd'
            break
        case 'a':
            keys.a.pressed = true
            player.lastKey = 'a'
            break
        case 'w':
            player.velocity.y = -20
            break
        case ' ':
        player.attack()
        break
        }
    }

    if (!enemy.dead) {
    switch (event.key) {           
        case 'ArrowRight':
            keys.ArrowRight.pressed = true
            enemy.lastKey = 'ArrowRight'
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            enemy.lastKey = 'ArrowLeft'
            break
        case 'ArrowUp':
            enemy.velocity.y = -20
            break
        case 'ArrowDown':
            enemy.attack()
            break
        }
    }
})


window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
    }
    // enemy keys
    switch (event.key) {
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break
    }
    console.log(event.key)
})

