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

    var x = 100, y = 100;
    var xspeed = 5, yspeed = 3.3;
    
    p.draw = function() {
      p.background(255);

      x += xspeed;
      y += yspeed;

      if ((x > p.width) || (x < 0)) {
        xspeed *= -1;
      }
      if ((y > p.height) || (y < 0)) {
        yspeed *= -1;
      }

      p.stroke(0);
      p.fill(p.color(255, 130, 90));
      p.ellipse(x, y, 16, 16);
    };
  };
  return module;
});
