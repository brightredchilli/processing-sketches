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
        startAngle = 0,
        aVelocity = 0.5,
        amp = 30,
        xOffset = p.width/2,
        yOffset = p.height/2;


    p.fill(125, 182, 255, 150);
    p.stroke(221, 100, 255, 150);
    p.strokeWeight(4);

    function getAmplitude(angle) {
      var noise = p.noise(p.frameCount/40);
      noise = p.map(noise, 0, 1, 2, 200);
      return noise;
    }

    p.draw = function() {
      p.background(255);
      
      startAngle = angle;

      for (var i = 0; i < 50; i++) {
        var y = p.sin(startAngle) * getAmplitude(startAngle) + yOffset;
        var x = i * 20 + 30;
        p.ellipse(x, y, 50, 50);
        startAngle += aVelocity;
      }
      angle += 0.1;
    };
  };
  return module;
});
