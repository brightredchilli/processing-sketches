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

    var amp = 100,
        period = 120,
        xOffset = p.width/2,
        yOffset = p.height/2;



    p.draw = function() {
      p.background(255);
      var time = p.frameCount;
      var x = amp * p.tan(2*p.PI * time/period);
      var y = amp * p.sin(2*p.PI * time/period);

      p.fill(0);
      p.ellipse(x + xOffset, y + yOffset, 50, 50);


      // p.pushStyle();
      // p.popStyle();

    };
  };
  return module;
});
