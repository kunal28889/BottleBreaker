gta.Cannon = function(game){
    this.angle = 0;
    this.fireRate = 0;
    this.nextFire = 0;
    this.stone = null;
    this.bullets = null;
    this.spawnBombsTimer = 0;
    this.bombGroup = null;
    this.levelBar = 1300;
    this.bottles = null;
    this.lives = null;
    this.curScoreLength = 1;
    
    gta.scoreObj = null;
}

gta.Cannon.prototype = {

    create : function(){
        
        this.health = 4;
        this.curLvl = 0;
        this.bulletSpeed = 900;
        this.curScoreLength = 1;

        var a = this.add.sprite(0, 0, 'background', null);
        a.height = gta.GAME_HEIGHT;
        a.width = gta.GAME_WIDTH;

        // game.stage.backgroundColor = '#2d2d2d';
        myHud.watch("score",this.scoreListener.bind(this));
        myHud.initWatchListeners();
        this.physics.startSystem(Phaser.Physics.ARCADE);

        // game.physics.arcade.gravity.y = 400;
        this.physics.arcade.restitution = 0.8;
        this.physics.arcade.friction = 0.1;

        this.bombGroup = this.add.group();
        this.bottles = this.add.group();
        this.lives = this.add.group();
        this.initLives(4);

        this.stone = this.add.sprite(gta.GAME_WIDTH/2-myVars.stone.width/2,gta.GAME_HEIGHT-20, 'stone');
        this.stone.anchor.set(0.50, 0.50);
        this.stone.inputEnabled = true;

        gta.items.spawnBottle(this.bottles, 1);
        gta.items.spawnBottle(this.bottles, 2);
        gta.items.spawnBottle(this.bottles, 3);
        gta.items.spawnBottle(this.bottles, 4);
        this.physics.arcade.enable(this.bottles)
        this.input.holdRate = 200;
        this.input.onHold.add(this.incMangnitude, this);
        this.input.onDown.add(this.fire, this);

        gta.scoreObj =  this.add.text(gta.GAME_WIDTH -30, 20, "0", { font: "40px Arial", fill: "#FFCC00", stroke: "#333", strokeThickness: 5, align: "right" });
        myHud.score = 0;
    },
    initLives : function (num) {
        for (var i = 0; i < num; i++) {
            var t = this.lives.create(10 + (myVars.bomb.width)*i, 10, "life", i);
        };
    },
    incMangnitude : function (e) {
        this.bulletSpeed+=100;
        console.log("Held")
    },
    fire : function (e) {
        if(!this.health)
            backtoMain();
        var dx = this.input.activePointer.worldX - this.stone.x;
        var dy = this.input.activePointer.worldY - this.stone.y;
        this.stone.rotation = Math.atan2(dy, dx);
        // console.log("Pressed")
        // if (this.time.now > this.nextFire)
        // {
        //     // console.log("Fire")
        //     this.nextFire = this.time.now + this.fireRate;

        //     var bullet = this.bullets.getFirstExists(false);

        //     if (bullet)
        //     {   
        //         bullet.frame = this.rnd.integerInRange(0, 6);
        //         bullet.exists = true;
        //         bullet.position.set(this.stone.x-20, this.stone.y-20);

        //         game.physics.arcade.enable(bullet);
        //         bullet.body.bounce.y = 1;
        //         bullet.body.bounce.x = 1;
        //         bullet.body.rotation = this.stone.rotation + this.math.degToRad(-90);

        //         var magnitude = this.bulletSpeed;
        //         var angle = bullet.body.rotation + Math.PI / 2;

        //         bullet.body.velocity.x = magnitude * Math.cos(angle);
        //         bullet.body.velocity.y = magnitude * Math.sin(angle);
        //         bullet.body.gravity.y = 1000;
        //         // console.log(angle + "\t" + e.clientX + "\t" + e.clientY + "\t" + this.stone.rotation + "\t" + this.math.degToRad(-90))
        //         bullet.checkWorldBounds = true;
        //         bullet.events.onOutOfBounds.add(this.removeBullet, game);
        //     }
        //  }
        game.physics.arcade.enable(this.stone);
        var magnitude = 800;
        this.stone.body.rotation = this.stone.rotation + this.math.degToRad(-90);
        var angle = this.stone.body.rotation + Math.PI / 2;
       this.stone.body.velocity.x = magnitude*Math.cos(angle) ;
       this.stone.body.velocity.y = magnitude*Math.sin(angle) ;
       this.stone.body.gravity.y = 1000;
    },
    update : function () {

        this.spawnBombsTimer += this.time.elapsed;
        this.stone.angle += (Math.random()*4);
        game.physics.arcade.collide(this.stone, this.bottles, this.change, null, this);


       // if the health of the player drops to 0, the player dies = game over
       if(!this.health) {
           // show the game over message
           gameOverSprite = this.add.sprite(0, 0, 'game-over');
           gameOverSprite.height = gta.GAME_HEIGHT;
           gameOverSprite.width = gta.GAME_WIDTH;
           // pause the game
           this.game.paused = true;
           this.stone.kill();
           if(myHud.score > myHud.highScore) {
                myHud.highScore = myHud.score;
                localStorage.highScore = myHud.score;
                document.getElementById("scoreValue").innerHTML = myHud.score;
                window.location.hash = "newHighScore";
           }
           gta.scoreObj.destroy();
       }

    },
    removeBullet: function(bullet){
        // kill the candy 
        // console.log("sdf") 
        bullet.kill();
        myHud.bulletCount += 1;      
    },
    change : function (a,b) {
      console.log(b)  
      b.kill();
      var x = this.add.sprite(b.body.x,b.body.y,'bottles');
      x.frameName = "bottleCrack1.png";
      x.scale.x = 1.5;
      x.scale.y = 1.5;
      x.x -= x.width;
      x.y -= x.height;
    },
    scoreListener :  function (id, oldval, newval) {
        var curScore = 0;
        if(newval <= 0) 
          curScore = 0;
        else
          curScore = newval;
        if(curScore > 1){
            this.curLvl++;
            this.levelModifier();
        }
        if(curScore.toString().length>this.curScoreLength) {
            gta.scoreObj.x -=15*curScore.toString().length;
            this.curScoreLength = curScore.toString().length;
        }
        gta.scoreObj.setText(curScore);
        return curScore;
    },
    levelModifier : function () {
        var temp = (Math.ceil(Math.pow(this.curLvl/6, 2)) * 35);
         this.levelBar = (1900 - temp) >= 500 ? (1900 - temp) : 500;
         // console.log(this.levelBar)
    }
};

gta.items = {
    spawnBottle: function (bottleGroup, pos) {
        switch(pos){
            case 1 :    var x = bottleGroup.create(5,180,'bottles')
                        x.frameName = "bottle1.png";
                        x.scale.x = 1.5;
                        x.scale.y = 1.5;
                break;
            case 2 :    var x = bottleGroup.create(90,180,'bottles')
                        x.frameName = "bottle2.png";
                        x.scale.x = 1.5;
                        x.scale.y = 1.5;
                break;
            case 3 :    var x = bottleGroup.create(180,180,'bottles')
                        x.frameName = "bottle3.png";
                        x.scale.x = 1.5;
                        x.scale.y = 1.5;
                break;
            case 4 :    var x = bottleGroup.create(270,180,'bottles')
                        x.frameName = "bottle4.png";
                        x.scale.x = 1.5;
                        x.scale.y = 1.5;
                break;
        }
    },
    spawnStone: function (game) {
        
    }
}
