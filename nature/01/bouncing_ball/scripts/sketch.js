define(["processing", "gaussian"], function(Processing, Gaussian) {
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
    p.smooth();

    var location = new p.PVector(100, 100);
    var speed = new p.PVector(5, 3);
    
    p.draw = function() {
      p.background(255);

      location.add(speed);

      if ((location.x > p.width) || (location.x < 0)) {
        speed.x *= -1;
      }
      if ((location.y > p.height) || (location.y < 0)) {
        speed.y *= -1;
      }

      p.stroke(0);
      p.fill(p.color(255, 130, 90));
      p.ellipse(location.x, location.y, 16, 16);
    };
  };
  return module;
});
