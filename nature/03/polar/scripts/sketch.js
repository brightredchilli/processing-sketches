define(["processing", "mover"], function(Processing, Mover) {
  var module = {};

  //processing setup
  module.initialize = function(canvas) {
    module.processing = new Processing(canvas, start);
  }

  function start(p) {
    //declare classes
    
    var r = 75,
        theta = 0;


    //declare variables
    p.size(800,600);
    p.background(255);

    p.draw = function() {
      var x = r * p.cos(theta);
      var y = r * p.sin(theta);

      p.fill(0);
      p.ellipse(x + p.width/2, y + p.height/2, 25, 25);
      theta += 0.1;

    };
  };
  return module;
});
