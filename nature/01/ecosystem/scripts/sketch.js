define(["processing", "mover"], function(Processing, Mover) {
  var module = {};

  //processing setup
  module.initialize = function(canvas) {
    module.processing = new Processing(canvas, start);
  }

  



  function start(p) {
    //declare classes
    Mover.prototype.checkEdges = Mover.NoEdges;
    
    function Red() {
      this.constructor.apply(this);
      this.size = 30;
      var r = new p.PVector.random2d();
      r.mult(200);
      this.location.add(r);
      this.location.add(new p.PVector(p.width/2, p.height/2));
      
      this.noiseX = p.random(0, 10000);
      this.noiseY = p.random(0, 10000);
    }
    Red.prototype = new Mover();
    Red.prototype.display = function () {
      p.pushStyle();
      p.fill(250, 20, 30);
      p.ellipse(this.location.x, this.location.y, this.size + 10, this.size + 10);
      p.noStroke();
      p.fill(200, 20, 20);
      p.ellipse(this.location.x, this.location.y, this.size, this.size);
      p.popStyle();
    }

    var redUpdate = Red.prototype.update;
    Red.prototype.update = function () {
      redUpdate.apply(this);
      this.velocity.limit(1);
      this.noiseX += 0.003;
      this.noiseY += 0.003;

    };

    Red.prototype.move = function () {
      var x = p.noise(this.noiseX);
      var y = p.noise(this.noiseY);
      x = p.map(x, 0, 1, -0.5, 0.5);
      y = p.map(y, 0, 1, -0.5, 0.5);
      this.applyForce(new p.PVector(x, y));
    }

    var movers = [];
    for(var i = 0; i < 20; i++) {
      var f = new Red();
      movers.push(f);
    }

    //declare variables
    p.size(800,600);

    p.draw = function() {
    p.background(70, 0, 0);

      for(var i = 0; i < movers.length; i++) {
        movers[i].move();
        movers[i].update();
        movers[i].display();
      }
    };
  };
  return module;
});
