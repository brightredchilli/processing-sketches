define(["processing"], function(Processing) {
  var module = {};

  

  //processing setup
  module.initialize = function(canvas) {
    module.processing = new Processing(canvas, start);
  };

  function start(p) {
    //declare classes
    var tx = 1;
    
    p.PVector.noise2D = function(tx, ty) {
      var v = new p.PVector();
      v.x = p.noise(tx);
      v.y = p.noise(ty);
      return v;
    };

    p.PVector.random2D = function() {
      var v = new p.PVector(p.random(-1, 1), p.random(-1, 1));
      return v;
    };
    
    function Mover() {
      var topspeed = 4;
      this.location = new p.PVector(p.random(p.width), 600);
      this.velocity = new p.PVector(0,0); //object is at rest to begin with
      this.acceleration = new p.PVector(0,0);

      this.checkEdges = function () {
        if (this.location.x > p.width) {
          this.location.x = 0;
        } else if (this.location.x < 0){
          this.location.x = p.width;
        }

        if (this.location.y > p.height) {
          this.location.y = 0;
        } else if (this.location.y < 0){
          this.location.y = p.height;
        }
      };

      this.update = function () {

        //get the acceleration due to helium

        this.acceleration.mult(0);

        var windMag = p.map(p.noise(tx), 0, 1, -0.1, 0.1);
        var wind = new p.PVector(windMag, 0);
        var helium = new p.PVector(0, -0.02);
        this.acceleration.add(helium);
        this.acceleration.add(wind);
        this.acceleration.limit(5);

        //update location
        this.velocity.add(this.acceleration);
        this.velocity.limit(topspeed);
        this.location.add(this.velocity);
        this.checkEdges();
        tx += 0.003;
      };

      this.display = function () {
        p.ellipse(this.location.x, this.location.y, 50, 50);
      };
    }



    //declare variables
    p.size(800,600);
    p.background(0);

    var mover = new Mover();

    p.draw = function() {
      p.background(p.color(0, 0, 0, 200));
      mover.update();
      mover.display();
    };
  }
  return module;
});
