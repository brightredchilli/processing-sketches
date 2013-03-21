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
    p.smooth();

    var angle = 0,
        aVelocity = 0.5,
        amp = 30,
        xOffset = p.width/2,
        yOffset = p.height/2;

    p.background(255);

    p.fill(125, 182, 255, 150);
    p.stroke(221, 100, 255, 150);
    p.strokeWeight(4);
    for (var i = 0; i < 50; i++) {
      var y = p.sin(angle) * amp + yOffset;
      var x = i * 20 + 30;
      p.ellipse(x, y, 50, 50);
      angle += aVelocity;
    }

    p.draw = function() {

    };
  };
  return module;
});
