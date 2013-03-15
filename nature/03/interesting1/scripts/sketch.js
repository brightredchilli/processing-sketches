define(["processing", "mover"], function(Processing, Mover) {
  var module = {};

  //processing setup
  module.initialize = function(canvas) {
    module.processing = new Processing(canvas, start);
  }

  function start(p) {
    //declare classes


    //declare variables
    p.size(800,600);
    p.background(255);

    Mover.prototype.display = function() {
      p.pushStyle();
      p.translate(this.location.x, this.location.y);
      p.rotate(p.radians(this.angle));
      p.strokeWeight(2);
      p.rect(0, 0, 20, 50);
      p.popStyle();
    };


    function createMover() {
      var mover = new Mover();
      mover.acceleration = new p.PVector(5, -5);
      mover.location = new p.PVector(30, 500);
      mover.aAcceleration = 20;
      return mover;
    }

    var m = createMover();
    p.draw = function() {
      m.update();
      m.display();

    };
  };
  return module;
});
