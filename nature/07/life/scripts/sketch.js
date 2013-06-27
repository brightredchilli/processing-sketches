define(["processing", "particle",  "particlesystem"], function(Processing, Particle, ParticleSystem) {

  var module = {};

  //processing setup
  module.initialize = function() {
    var contentElement = document.getElementById("content");
    var descriptionElement = document.getElementById("content-description");
    var canvas = document.createElement("canvas");
    contentElement.insertBefore(canvas, descriptionElement);
    module.processing = new Processing(canvas, function (p) {
      p.size(800, 600);

      var cellWidth = 10;

      function GameOfLife() {
        this.lookahead = 1;
        this.prevState = [], this.nextState = [];
        //initialize board
        this.cols = Math.ceil(p.width/cellWidth);
        this.rows = Math.ceil(p.height/cellWidth);
        for (var i = 0; i < this.cols; i++) {
          this.prevState[i] = [];
          this.nextState[i] = [];
          for (var j = 0; j < this.rows; j++) {
            this.prevState[i][j] = 0;
            this.nextState[i][j] = 0;
          }
        }


        this.cellStep = function (x, y) {
          //for previous row
          var startX = x - this.lookahead; var endX = startX + this.lookahead * 2 + 1;
          var startY = y - this.lookahead; var endY = startY + this.lookahead * 2 + 1;
          
          var sum = 0;
          //for previous row
          for (var i = startY; i < endY; i++) {
              if (i < 0 || i >= this.rows) continue;
            for (var j = startX; j < endX; j++) {
              if (j < 0 || j >= this.cols) continue;
              sum += this.prevState[j][i];
            }
          }
          sum -= this.prevState[x][y];
          return sum;
        }

        this.step = function () {
          //swap next and previous state
          var tmp = this.prevState;
          this.prevState = this.nextState;
          this.nextState = tmp;
          //previous row
          for (var i = 0; i < this.cols; i++) {
            for (var j = 0; j < this.rows; j++) {

              var neighbors = this.cellStep(i, j);
              if (this.prevState[i][j] == 1 && neighbors < 2) this.nextState[i][j] = 0;
              else if (this.prevState[i][j] == 1 && neighbors > 3) this.nextState[i][j] = 0;
              else if (this.prevState[i][j] == 0 && neighbors == 3) this.nextState[i][j] = 1;
              else this.nextState[i][j] = this.prevState[i][j];
            }
          }
        }

        this.display = function () {
          //draw tiles
          p.stroke(200);
          p.strokeWeight(1);
          for (var x = 0; x < this.cols; x++) {
            p.line(x * cellWidth, 0, x * cellWidth, p.height);
          }
          for (var y = 0; y < this.rows; y++) {
            p.line(0, y * cellWidth, p.width, y * cellWidth);
          }
        }
      }

      
      var game = new GameOfLife();
      var play = true;

      p.keyPressed = function () {
        if (p.keyCode == 32) {
          play = !play;
          console.log(play);

          var text = document.getElementById("running_text");
          if (play) {
            text.innerHTML = "Game is playing...press spacebar to pause.";
          } else {
            text.innerHTML = "Game is paused...press spacebar to continue. Click anywhere to make life.";
          }

        }

      }

      p.mousePressed = function () {
        var col = Math.floor(p.mouseX / cellWidth);
        var row = Math.floor(p.mouseY / cellWidth);
        game.nextState[col][row] = (game.nextState[col][row] + 1) % 2;
      }

      
      Particle.prototype.display = function () {
        p.fill(0, this.lifespan);
        p.rect(this.location.x, this.location.y, cellWidth, cellWidth);
      }

      Particle.prototype.updateLifespan  = function () {
        this.lifespan -= 40;
      }


      //particle system used to handle rendering
      var ps = new ParticleSystem();
      ps.displayGame = function (game) {
        for (var i = 0; i < game.cols; i++) {
          for (var j = 0; j < game.rows; j++) {
            if (game.nextState[i][j] > 0) {
              var particle = new Particle();
              particle.location.x = i * cellWidth;
              particle.location.y = j * cellWidth;
              this.addParticle(particle);
            }
          }
        }

        for (var i = 0; i < this.particles.size(); i++) {
          this.particles.get(i).display();
        }
      }

      

      p.background(255);
      p.frameRate(30);
      p.draw = function() {
        if (play){
          game.step();
          ps.run();
        }
        p.background(255);
        game.display();
        ps.displayGame(game);

      }


    });
  }

  return module;
});
