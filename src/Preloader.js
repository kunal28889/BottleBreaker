gta.Preloader = function(game){
	// define width and height of the game
	gta.GAME_WIDTH = winWidth;
	gta.GAME_HEIGHT = winHeight;
};
gta.Preloader.prototype = {
	preload: function(){
		// set background color and preload image
		this.stage.backgroundColor = 'transparent';
		this.preloadBar = this.add.sprite((gta.GAME_WIDTH-311)/2, (gta.GAME_HEIGHT-27)/2, 'preloaderBar');
		// this.load.setPreloadSprite(this.preloadBar);
		// load images
		this.load.spritesheet("background", 'img/FrontPage1.png',321,481);
		this.load.atlas('mainMenuSprites', 'img/FrontPage1.png', 'src/texturepacker.json');
		this.load.atlas('bottles', 'img/wine1.png', 'src/bottles.json');

		// this.load.image('background', 'img/background.jpg');
		this.load.image('stone', 'img/cannon.png');
	    this.load.image('bomb', 'img/bomb.png');
	    this.load.image('life', 'img/bomb.png');
	    this.load.image('explode', 'img/explode.png');
	    this.load.spritesheet('bullets', 'img/balls.png', 36, 36);
	    this.load.image('pic', 'img/transparent.png');
	    this.load.image('title', 'img/title.png');
	    this.load.image('game-over', 'img/gameover.jpg');
	    this.load.image('question', 'img/question.png');
		this.load.spritesheet('button-start', 'img/button-start2.png', 230, 85);

		this.load.bitmapFont('rock', 'css/font.png', 'css/font.fnt');
	},
	create: function(){
		// start the MainMenu state
		myVars.stone = game.cache.getImage('stone');
		myVars.bullets = game.cache.getImage('bullets');
		myVars.bomb = game.cache.getImage("bomb")
		window.setTimeout(this.start.bind(this), 280)
		
	},start : function () {
		this.state.start('Cannon')
	}
};