class Play extends Phaser.Scene {
    constructor() {
        super('playScene')
    }

    preload() {
        this.load.path = './assets/img/'
        this.load.image('grass', 'grass.jpg')
        this.load.image('cup', 'cup.jpg')
        this.load.image('ball', 'ball.png')
        this.load.image('wall', 'wall.png')
        this.load.image('oneway', 'one_way_wall.png')
    }

    create() {
        this.gameOver = false;
        // add background grass
        this.grass = this.add.image(0, 0, 'grass').setOrigin(0)

        // add cup
        this.cup = this.physics.add.sprite(width / 2, height / 10, 'cup')
        this.cup.body.setCircle(this.cup.width/4)
        this.cup.body.setOffset(this.cup.width/4)
        this.cup.body.setImmovable(true)

        //add ball
        this.ball = this.physics.add.sprite(width / 2, height - height / 10, 'ball')
        this.ball.body.setCircle(this.ball.width / 2)
        this.ball.body.setCollideWorldBounds(true)
        this.ball.body.setBounce(0.5)
        this.ball.setDamping(true).setDrag(0.5)

        // add walls
        let wallA = this.physics.add.sprite(0, height / 4, 'wall')
        wallA.setX(Phaser.Math.Between(0 + wallA.width/2, width - wallA.width / 4))
        wallA.body.setImmovable(true)
        wallA.setCollideWorldBounds(true,1)
        wallA.setVelocityX(100)
        

        let wallB = this.physics.add.sprite(0, height / 2, 'wall')
        wallB.setX(Phaser.Math.Between(0 + wallB.width/2, width - wallB.width / 4))
        wallB.body.setImmovable(true)

        this.wallsA = this.add.group([wallA])
        this.wallsB = this.add.group([wallB])

        // one way
        this.oneWay = this.physics.add.sprite(0, height / 4 * 3, 'oneway')
        this.oneWay.setX(Phaser.Math.Between(0 + this.oneWay.width / 2, width - this.oneWay.width / 2))
        this.oneWay.body.setImmovable(true)

        // variables
        this.SHOT_VELOCITY_X = 200
        this.SHOT_VELOCITY_Y_MIN = 700
        this.SHOT_VELOCITY_Y_MAX = 1100

        this.input.on('pointerdown', (pointer) => {
            let shotDirection 
            if(pointer.y <= this.ball.y){
                shotDirection = -1
            }else{
                shotDirection = 1
            }
            if(pointer.x <= this.ball.x){
                this.ball.body.setVelocityX(-this.SHOT_VELOCITY_X)
            }
            else{
                this.ball.body.setVelocityX(this.SHOT_VELOCITY_X)
            }
            //this.ball.body.setVelocityX(Phaser.Math.Between(-this.SHOT_VELOCITY_X, this.SHOT_VELOCITY_X))
            this.ball.body.setVelocityY(Phaser.Math.Between(this.SHOT_VELOCITY_Y_MIN, this.SHOT_VELOCITY_Y_MAX) * shotDirection)
        })

        this.physics.add.collider(this.ball, this.cup, (ball, cup) => {
            ball.destroy()
            this.gameOver = true
        })
        this.physics.add.collider(this.ball, this.wallsA)
        this.physics.add.collider(this.ball, this.wallsB)
        this.physics.add.collider(this.ball, this.oneWay)
    }

    update() {
        if(this.gameOver == true){
            this.scene.restart()
        }
    }
}
