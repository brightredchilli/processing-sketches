define(["processing", "gaussian"], function(Processing, Gaussian) {
  var module = {};

  

  //processing setup
  module.initialize = function(canvas) {
    module.processing = new Processing(canvas, start);
  };

  function start(p) {
    //declare classes
    
    function Mover() {
      this.location = new p.PVector(p.random(p.width), p.random(p.height));
      this.velocity = new p.PVector(p.random(-2, 2), p.random(-2, 2));

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
        this.location.add(this.velocity);
      };

      this.display = function () {
        p.ellipse(this.location.x, this.location.y, 15, 15);;
      };
    }



    //declare variables
    p.size(800,600);
    p.background(0);

    var mover = new Mover();

    p.draw = function() {
      p.background(p.color(0, 0, 0, 200));;
      mover.update();
      mover.checkEdges();
      mover.display();
    };
  }
  return module;
});
