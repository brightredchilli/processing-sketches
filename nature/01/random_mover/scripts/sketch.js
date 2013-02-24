define(["processing", "gaussian"], function(Processing, Gaussian) {
  var module = {};

  

  //processing setup
  module.initialize = function(canvas) {
    module.processing = new Processing(canvas, start);
  };

  function start(p) {
    //declare classes
    
    function Mover() {
      var topspeed = 20;
      this.location = new p.PVector(p.random(p.width), p.random(p.height));
      this.velocity = new p.PVector(0,0); //object is at rest to begin with

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
        this.acceleration = new p.PVector(p.random(-1, 1), p.random(-1, 1));
        this.acceleration.mult(p.random(2));
        this.velocity.add(this.acceleration);
        this.velocity.limit(topspeed);

        //update location
        this.location.add(this.velocity);
        this.checkEdges();
      };

      this.display = function () {
        p.ellipse(this.location.x, this.location.y, 15, 15);
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
