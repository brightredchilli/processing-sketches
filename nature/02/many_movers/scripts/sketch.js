define(["processing", "mover"], function(Processing, M) {
  /*@pjs transparent */
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
      this.mass = 5;

      this.checkEdges = function () {
        if (this.location.x > p.width) {
          this.location.x = p.width;
          this.velocity.x *= -1;

        } else if (this.location.x < 0){
          this.location.x = p.width;
        }

        if (this.location.y > p.height) {
          this.location.y = p.height;
          this.velocity.y *= -1;
        } else if (this.location.y < 0){
        }
      };

      this.applyForce = function(f) {
        var tmp = f.get();
        f.div(this.mass);
        this.acceleration.add(tmp);
      };

      this.update = function () {

        //get the acceleration due to helium

        //update location
        this.velocity.add(this.acceleration);
        //this.velocity.limit(topspeed);
        this.location.add(this.velocity);
        this.checkEdges();
        tx += 0.003;
        this.acceleration.mult(0);
      };

      this.display = function () {
        p.ellipse(this.location.x, this.location.y, this.mass*2, this.mass*2);
      };
    }
    //declare variables
    p.size(800,600);
    p.background(200,20,200);


    var movers = [];
    for (var i = 0; i < 20; i++) {
      var mover = new Mover();
      mover.mass = p.random(10, 30);
      mover.location = new p.PVector(10, 10);
      mover.velocity = new p.PVector(5, 0);
      movers.push(mover);
    }

    p.draw = function() {
      p.background(p.color(30, 0, 0, 100));

      var windMag = p.map(p.noise(tx), 0, 1, 0, 5);
      var wind = new p.PVector(windMag, 0);
      var helium = new p.PVector(0, -0.005);

      for (var i = 0; i < movers.length; i++) {
        var mover = movers[i];
        var gravity = new p.PVector(0, 0.1*mover.mass);
        mover.applyForce(wind);
        mover.applyForce(gravity);
        mover.acceleration.limit(5);
        mover.update();
        mover.display();
      }
    };
  }
  return module;
});
