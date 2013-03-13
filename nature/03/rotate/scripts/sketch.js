define(["processing"], function(Processing) {
  var module = {};

  //processing setup
  module.initialize = function(canvas) {
    module.processing = new Processing(canvas, start);
  }

  function start(p) {
    //declare classes


    //declare variables
    p.size(800,600);
    p.background(0);

    var   angle = 0,
          aVelocity = 0,
          aAcc = 0.001,
          time = 0;
      

    p.draw = function() {
      p.background(p.color(255,255,255, 10));
      p.fill(100);
      p.rectMode(p.CENTER);
      p.translate(p.width/2, p.height/2);
      p.rotate(angle);
      p.line(-50, 0, 50, 0);
      p.ellipse(-50, 0, 15, 15);
      p.ellipse(50, 0, 15, 15);


      var noise = p.noise(time);
      noise = p.map(noise, 0, 1, 0, 720); 
      aVelocity += noise;
      angle = p.radians(noise);
      time += 0.003;

    };
  };
  return module;
});
